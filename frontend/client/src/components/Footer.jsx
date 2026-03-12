import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./components.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* 📚 BRAND */}
        <div className="footer-col">
          <h2>BookStore</h2>
          <p>Your one-stop shop for the best books online.</p>

          <div className="social-icons">
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
            <FaLinkedin />
          </div>
        </div>

        {/* 🔗 QUICK LINKS */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/books">Books</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My Orders</Link>
        </div>

        {/* 🛠 SUPPORT */}
        <div className="footer-col">
          <h3>Support</h3>
          <Link to="#">Contact Us</Link>
          <Link to="#">FAQs</Link>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms & Conditions</Link>
        </div>

        {/* 📍 CONTACT */}
        <div className="footer-col">
          <h3>Contact</h3>
          <p>📍 Ahmedabad, India</p>
          <p>📞 +91 98765 43210</p>
          <p>📧 support@bookstore.com</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 BookStore | All Rights Reserved</p>
      </div>

    </footer>
  );
}