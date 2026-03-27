import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "../utils/toast";
import "./pages.css";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const paypalContainerRef = useRef(null);

  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [processing, setProcessing] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const paymentOptions = [
    {
      id: "cod",
      value: "Cash on Delivery",
      label: "Cash on Delivery",
      note: "Pay when the order arrives at your doorstep.",
    },
    {
      id: "stripe",
      value: "Stripe",
      label: "Stripe (Cards)",
      note: "Secure card payments powered by Stripe Checkout.",
    },
    {
      id: "razorpay",
      value: "Razorpay",
      label: "Razorpay (UPI)",
      note: "UPI, cards, and net banking via Razorpay.",
    },
    {
      id: "paypal",
      value: "PayPal",
      label: "PayPal",
      note: "Pay securely with your PayPal account.",
    },
  ];

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = totalPrice > 999 || totalPrice === 0 ? 0 : 79;
  const payableAmount = totalPrice + deliveryFee;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const formatPrice = (value) => `Rs. ${value.toFixed(2)}`;

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load script"));
      document.body.appendChild(script);
    });

  const buildOrderData = (overrideMethod) => ({
    orderItems: cart,
    shippingAddress: form,
    totalPrice: payableAmount,
    paymentMethod: overrideMethod || paymentMethod,
  });

  const persistPendingOrder = () => {
    const pending = buildOrderData();
    localStorage.setItem("pendingOrder", JSON.stringify(pending));
  };

  const clearPendingOrder = () => {
    localStorage.removeItem("pendingOrder");
  };

  const createOrderAndFinish = async (overrideMethod) => {
    const orderData = buildOrderData(overrideMethod);
    await axios.post("/api/orders", orderData, { withCredentials: true });
    clearCart();
    clearPendingOrder();
    navigate("/orders");
  };

  const placeOrder = async () => {
    try {
      setPaymentError("");
      if (loading) {
        return;
      }

      if (!user) {
        toast.warn("Please login to place an order");
        navigate("/login");
        return;
      }

      if (cart.length === 0) {
        toast.warn("Your cart is empty");
        return;
      }

      if (!form.address || !form.city || !form.postalCode) {
        toast.warn("Please fill all fields");
        return;
      }

      if (!paymentMethod) {
        toast.warn("Please select a payment method");
        return;
      }

      if (paymentMethod === "Cash on Delivery") {
        await createOrderAndFinish("Cash on Delivery");
        toast.success("Order placed successfully");
        return;
      }

      setProcessing(true);
      persistPendingOrder();

      if (paymentMethod === "Stripe") {
        const res = await axios.post(
          "/api/payments/stripe/checkout-session",
          {
            items: cart,
            deliveryFee,
            currency: "INR",
          },
          { withCredentials: true }
        );
        window.location.href = res.data.url;
        return;
      }

      if (paymentMethod === "Razorpay") {
        const res = await axios.post(
          "/api/payments/razorpay/order",
          {
            items: cart,
            deliveryFee,
            currency: "INR",
          },
          { withCredentials: true }
        );

        await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        const options = {
          key: res.data.keyId,
          amount: res.data.amount,
          currency: res.data.currency,
          name: "Bookstore",
          description: "Order payment",
          order_id: res.data.orderId,
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          handler: async (response) => {
            try {
              const verify = await axios.post(
                "/api/payments/razorpay/verify",
                {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                },
                { withCredentials: true }
              );

              if (!verify.data.verified) {
                toast.error("Payment verification failed");
                setPaymentError("Payment verification failed. Please try again.");
                return;
              }

              await createOrderAndFinish("Razorpay");
              toast.success("Payment successful");
            } catch (err) {
              toast.error("Payment failed");
              setPaymentError("Payment failed. Please try again.");
            }
          },
          modal: {
            ondismiss: () => setProcessing(false),
          },
          theme: {
            color: "#667eea",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        return;
      }
    } catch (err) {
      toast.error("Payment failed");
      setPaymentError("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const setupPayPal = async () => {
      if (paymentMethod !== "PayPal") return;

      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      if (!clientId) {
        toast.error("PayPal client id is missing");
        setPaymentError("PayPal client id is missing.");
        return;
      }

      try {
        setPaypalReady(false);
        if (paypalContainerRef.current) {
          paypalContainerRef.current.innerHTML = "";
        }

        await loadScript(
          `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=INR`
        );

        if (!window.paypal || !paypalContainerRef.current) {
          return;
        }

        window.paypal
          .Buttons({
            createOrder: async () => {
              persistPendingOrder();
              const res = await axios.post(
                "/api/payments/paypal/create-order",
                {
                  items: cart,
                  deliveryFee,
                  currency: "INR",
                },
                { withCredentials: true }
              );
              return res.data.id;
            },
            onApprove: async (data) => {
              try {
                const capture = await axios.post(
                  "/api/payments/paypal/capture-order",
                  { orderId: data.orderID },
                  { withCredentials: true }
                );
                if (capture.data.status === "COMPLETED") {
                  await createOrderAndFinish("PayPal");
                  toast.success("Payment successful");
                } else {
                  toast.error("Payment not completed");
                  setPaymentError("Payment not completed. Please try again.");
                }
              } catch (err) {
                toast.error("Payment failed");
                setPaymentError("Payment failed. Please try again.");
              }
            },
            onError: () => {
              toast.error("PayPal payment failed");
              setPaymentError("PayPal payment failed. Please try again.");
            },
          })
          .render(paypalContainerRef.current);

        setPaypalReady(true);
      } catch (err) {
        toast.error("Failed to load PayPal");
        setPaymentError("Failed to load PayPal. Please try again.");
      }
    };

    setupPayPal();
  }, [paymentMethod]);

  if (cart.length === 0) {
    return (
      <section className="checkout-page">
        <div className="checkout-empty">
          <h2>Your checkout is empty</h2>
          <p>Add books to your cart before placing an order.</p>
          <Link to="/" className="checkout-back-btn">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-heading">
        <h1>Checkout</h1>
        <p>Complete shipping details and review your order before payment.</p>
      </div>

      <div className="checkout-container">
        <div className="checkout-left">
          <h2>Shipping Details</h2>

          <label htmlFor="address">Street Address</label>
          <input
            id="address"
            name="address"
            placeholder="Enter full address"
            onChange={handleChange}
            value={form.address}
          />

          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            placeholder="City"
            onChange={handleChange}
            value={form.city}
          />

          <label htmlFor="postalCode">Postal Code</label>
          <input
            id="postalCode"
            name="postalCode"
            placeholder="Postal Code"
            onChange={handleChange}
            value={form.postalCode}
          />

          <div className="payment-methods">
            <h3>Payment Method</h3>
            <div className="payment-options">
              {paymentOptions.map((option) => (
                <label key={option.id} className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-label">{option.label}</span>
                  <span className="payment-note">{option.note}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <aside className="checkout-right">
          <h2>Order Summary</h2>

          <div className="summary-list">
            {cart.map((item) => (
              <div className="summary-item" key={item._id}>
                <div>
                  <p>{item.title}</p>
                  <small>Qty: {item.qty}</small>
                </div>
                <span>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className="summary-breakup">
            <div className="summary-row">
              <span>Items ({totalItems})</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
            </div>
            <div className="summary-row">
              <span>Payment</span>
              <span>{paymentMethod}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total Payable</span>
              <span>{formatPrice(payableAmount)}</span>
            </div>
          </div>

          {paymentError && (
            <div className="payment-error-banner" role="alert">
              {paymentError}
            </div>
          )}

          {paymentMethod === "PayPal" ? (
            <div className="paypal-panel">
              <div className="paypal-buttons" ref={paypalContainerRef}></div>
              {!paypalReady && (
                <p className="paypal-hint">Loading PayPal options...</p>
              )}
            </div>
          ) : (
            <button
              className="place-order-btn"
              onClick={placeOrder}
              disabled={processing}
            >
              {processing
                ? "Processing..."
                : paymentMethod === "Stripe"
                ? "Pay with Stripe"
                : paymentMethod === "Razorpay"
                ? "Pay with Razorpay"
                : "Place Order"}
            </button>
          )}
        </aside>
      </div>
    </section>
  );
}

