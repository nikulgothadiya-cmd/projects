import "./pages.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart } =
    useContext(CartContext);

  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="cart-page">
      {/* HEADER */}
      <section className="cart-header">
        <div className="header-overlay" />
        <div className="header-content">
          <h1>Shopping Cart</h1>
          <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</p>
        </div>
      </section>

      {/* CART CONTENT */}
      <section className="cart-content">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛍️</div>
            <h2>Your cart is empty</h2>
            <p>Start shopping to add items to your cart</p>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-wrapper">
            {/* ITEMS LIST */}
            <div className="cart-items">
              <div className="items-header">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
                <span></span>
              </div>

              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="item-title">
                    <p>{item.title}</p>
                  </div>

                  <div className="item-price">₹{item.price}</div>

                  <div className="item-qty">
                    <button 
                      className="qty-btn"
                      onClick={() => decreaseQty(item._id)}
                      title="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-value">{item.qty}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => increaseQty(item._id)}
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="item-subtotal">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                    title="Remove from cart"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* CART SUMMARY */}
            <div className="cart-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">Free</span>
              </div>

              <div className="summary-row">
                <span>Tax</span>
                <span>₹{(total * 0.05).toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <span>₹{(total * 1.05).toFixed(2)}</span>
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              <Link to="/" className="continue-shopping-link">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}