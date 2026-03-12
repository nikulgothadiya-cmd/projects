import { useContext, useState } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "../utils/toast";
import "./pages.css";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
  });

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = totalPrice > 999 || totalPrice === 0 ? 0 : 79;
  const payableAmount = totalPrice + deliveryFee;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const formatPrice = (value) => `Rs. ${value.toFixed(2)}`;

  const placeOrder = async () => {
    try {
      if (cart.length === 0) {
        toast.warn("Your cart is empty");
        return;
      }

      if (!form.address || !form.city || !form.postalCode) {
        toast.warn("Please fill all fields");
        return;
      }

      const orderData = {
        orderItems: cart,
        shippingAddress: form,
        totalPrice: payableAmount,
      };

      await axios.post("/api/orders", orderData, {
        withCredentials: true,
      });

      toast.success("Order placed successfully");
      clearCart();
      navigate("/orders");
    } catch (err) {
      toast.error("Login required");
    }
  };

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
            <div className="summary-row summary-total">
              <span>Total Payable</span>
              <span>{formatPrice(payableAmount)}</span>
            </div>
          </div>

          <button className="place-order-btn" onClick={placeOrder}>
            Place Order
          </button>
        </aside>
      </div>
    </section>
  );
}

