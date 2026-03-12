import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import "./pages.css";

export default function ContactUs() {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="hero-overlay" />
        <div className="hero-text">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="details-form-wrapper">
          <div className="contact-details">
            <div className="detail-item">
              <FaMapMarkerAlt className="detail-icon" />
              <div>
                <h3>Address</h3>
                <p>123 Book Street<br />Ahmedabad, India</p>
              </div>
            </div>
            <div className="detail-item">
              <FaEnvelope className="detail-icon" />
              <div>
                <h3>Email</h3>
                <p>support@bookstore.com</p>
              </div>
            </div>
            <div className="detail-item">
              <FaPhone className="detail-icon" />
              <div>
                <h3>Phone</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>

          <form className="contact-form">
            <h2>Send us a message</h2>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required />
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>
    </div>
  );
}
