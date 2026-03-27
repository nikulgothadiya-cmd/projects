import { Link } from "react-router-dom";
import "./pages.css";

export default function PaymentCancel() {
  return (
    <section className="payment-status-page">
      <div className="payment-status-card">
        <h1>Payment Cancelled</h1>
        <p>Your payment was cancelled. You can try again.</p>
        <Link className="checkout-back-btn" to="/checkout">
          Back to Checkout
        </Link>
      </div>
    </section>
  );
}
