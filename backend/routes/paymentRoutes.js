import express from "express";
import crypto from "crypto";
import Stripe from "stripe";
import Razorpay from "razorpay";
import paypal from "@paypal/checkout-server-sdk";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const getClientBaseUrl = () =>
  process.env.CLIENT_URL ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const calcTotal = (items = [], deliveryFee = 0) => {
  const itemsTotal = items.reduce(
    (sum, item) => sum + toNumber(item.price) * toNumber(item.qty),
    0
  );
  return itemsTotal + toNumber(deliveryFee);
};

const buildLineItems = (items = [], currency = "INR", deliveryFee = 0) => {
  const normalizedCurrency = currency.toLowerCase();
  const lineItems = items.map((item) => ({
    price_data: {
      currency: normalizedCurrency,
      product_data: {
        name: item.title || "Book",
      },
      unit_amount: Math.round(toNumber(item.price) * 100),
    },
    quantity: Math.max(1, toNumber(item.qty)),
  }));

  const fee = toNumber(deliveryFee);
  if (fee > 0) {
    lineItems.push({
      price_data: {
        currency: normalizedCurrency,
        product_data: {
          name: "Delivery Fee",
        },
        unit_amount: Math.round(fee * 100),
      },
      quantity: 1,
    });
  }

  return lineItems;
};

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
};

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const getPayPalClient = () => {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return null;
  }

  const environment =
    process.env.NODE_ENV === "production"
      ? new paypal.core.LiveEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        )
      : new paypal.core.SandboxEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        );

  return new paypal.core.PayPalHttpClient(environment);
};

router.post("/stripe/checkout-session", protect, async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ msg: "Stripe is not configured" });
    }

    const { items = [], deliveryFee = 0, currency = "INR" } = req.body;

    if (!items.length) {
      return res.status(400).json({ msg: "No items to process" });
    }

    const lineItems = buildLineItems(items, currency, deliveryFee);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${getClientBaseUrl()}/payment/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getClientBaseUrl()}/payment/cancel?provider=stripe`,
      metadata: {
        userId: req.user?.id?.toString?.() || "",
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout-session error:", error);
    if (error?.type) {
      console.error("Stripe error type:", error.type);
    }
    if (error?.raw) {
      console.error("Stripe raw:", {
        message: error.raw.message,
        code: error.raw.code,
        type: error.raw.type,
        statusCode: error.raw.statusCode,
      });
    }
    res.status(500).json({ msg: error.message || "Stripe session failed" });
  }
});

router.post("/stripe/verify", protect, async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ msg: "Stripe is not configured" });
    }

    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ msg: "Session id required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({
      status: session.payment_status,
      amount: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message || "Stripe verify failed" });
  }
});

router.post("/razorpay/order", protect, async (req, res) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(500).json({ msg: "Razorpay is not configured" });
    }

    const { items = [], deliveryFee = 0, currency = "INR" } = req.body;
    const total = calcTotal(items, deliveryFee);

    if (!items.length || total <= 0) {
      return res.status(400).json({ msg: "Invalid order total" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency,
      receipt: `order_${Date.now()}`,
      notes: {
        userId: req.user?.id?.toString?.() || "",
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ msg: error.message || "Razorpay order failed" });
  }
});

router.post("/razorpay/verify", protect, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ msg: "Invalid payment data" });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    res.json({ verified: expected === signature });
  } catch (error) {
    res.status(500).json({ msg: error.message || "Razorpay verify failed" });
  }
});

router.post("/paypal/create-order", protect, async (req, res) => {
  try {
    const client = getPayPalClient();
    if (!client) {
      return res.status(500).json({ msg: "PayPal is not configured" });
    }

    const { items = [], deliveryFee = 0, currency = "INR" } = req.body;
    const total = calcTotal(items, deliveryFee);

    if (!items.length || total <= 0) {
      return res.status(400).json({ msg: "Invalid order total" });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: total.toFixed(2),
          },
        },
      ],
    });

    const response = await client.execute(request);
    res.json({ id: response.result.id });
  } catch (error) {
    res.status(500).json({ msg: error.message || "PayPal order failed" });
  }
});

router.post("/paypal/capture-order", protect, async (req, res) => {
  try {
    const client = getPayPalClient();
    if (!client) {
      return res.status(500).json({ msg: "PayPal is not configured" });
    }

    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ msg: "Order id required" });
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await client.execute(request);
    res.json({
      status: response.result.status,
      id: response.result.id,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message || "PayPal capture failed" });
  }
});

export default router;
