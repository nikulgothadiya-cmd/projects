import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "./pages.css";
import { getUploadUrl } from "../utils/api";

export default function BookDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(book);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="details-loading">
        <div className="loading-spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="details-error">
        <h2>📚 Book not found</h2>
        <p>The book you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="book-details-page">
      <div className="details-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">📖 Book Details</h1>
          <p className="hero-subtitle">Discover more about this amazing book</p>
        </div>
      </div>

      <div className="details-container">
        <div className="details-card">
          <div className="book-image-section">
            <div className="image-wrapper">
              <img
                src={getUploadUrl(book.image)}
                alt={book.title}
                className="book-image"
              />
              <div className="image-glow"></div>
            </div>
          </div>

          <div className="book-info-section">
            <div className="book-header">
              <h1 className="book-title">{book.title}</h1>
              <div className="book-meta">
                <span className="author-badge">
                  ✍️ {book.author}
                </span>
                <span className="genre-badge">
                  📚 Fiction
                </span>
              </div>
            </div>

            <div className="book-description">
              <h3>About this book</h3>
              <p>{book.description}</p>
            </div>

            <div className="book-price-section">
              <div className="price-display">
                <span className="price-label">Price:</span>
                <span className="price-amount">₹{book.price}</span>
              </div>
              <div className="price-features">
                <span className="feature">✓ Free shipping</span>
                <span className="feature">✓ 30-day returns</span>
                <span className="feature">✓ Secure payment</span>
              </div>
            </div>

            <div className="book-actions">
              <button
                className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <>
                    <span className="btn-icon">✅</span>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🛒</span>
                    Add to Cart
                  </>
                )}
              </button>

              <button className="wishlist-btn">
                <span className="btn-icon">❤️</span>
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
