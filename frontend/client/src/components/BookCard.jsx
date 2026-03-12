import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./components.css";
import { getUploadUrl } from "../utils/api";

export default function BookCard({ book }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="book-card">

      <div className="book-img">
     <img src={getUploadUrl(book.image)} alt={book.title} />
      </div>

      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>

        <div className="card-bottom">
          <span className="price">₹{book.price}</span>

          <button
            className="add-cart-btnn"
            onClick={() => addToCart(book)}
          >
            🛒 Add
          </button>
        </div>

        <Link to={`/book/${book._id}`} className="view-btn">
          View Details
        </Link>
      </div>

    </div>
  );
}
