import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { toast } from "../utils/toast";
import "./pages.css";

export default function PaymentSuccess() {
  const { clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { search } = useLocation();
  const [status, setStatus] = useState("Verifying payment...");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(search);
      const provider = params.get("provider");
      const sessionId = params.get("session_id");

      if (provider !== "stripe" || !sessionId) {
        setStatus("Invalid payment session.");
        setFailed(true);
        return;
      }

      try {
        const verify = await axios.post(
          "/api/payments/stripe/verify",
          { sessionId },
          { withCredentials: true }
        );

        if (verify.data.status !== "paid") {
          setStatus("Payment not completed.");
          setFailed(true);
          return;
        }

        const pending = JSON.parse(localStorage.getItem("pendingOrder") || "{}");
        if (!pending.orderItems || !pending.orderItems.length) {
          setStatus("Order data missing.");
          setFailed(true);
          return;
        }

        await axios.post("/api/orders", pending, { withCredentials: true });
        clearCart();
        localStorage.removeItem("pendingOrder");

        toast.success("Payment successful");
        navigate("/orders");
      } catch (err) {
        setStatus("Payment verification failed.");
        setFailed(true);
      }
    };

    run();
  }, [search, navigate, clearCart]);

  return (
    <section className="payment-status-page">
      <div className="payment-status-card">
        <h1>Payment Status</h1>
        <p>{status}</p>
        {failed && (
          <Link className="checkout-back-btn" to="/checkout">
            Back to Checkout
          </Link>
        )}
      </div>
    </section>
  );
}
