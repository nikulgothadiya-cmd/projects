import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import "./pages.css";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [activeAuthor, setActiveAuthor] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/api/books");
        setBooks(res.data || []);
      } catch (err) {
        setError("Unable to load books right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const authors = ["All", ...new Set(books.map((book) => book.author).filter(Boolean))];

  const filtered = books.filter((book) => {
    const matchTitle = book.title.toLowerCase().includes(search.toLowerCase());
    const matchAuthor = activeAuthor === "All" || book.author === activeAuthor;
    return matchTitle && matchAuthor;
  });

  const sortedBooks = [...filtered].sort((a, b) => {
    if (sortBy === "title-asc") return a.title.localeCompare(b.title);
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  const avgPrice =
    books.length > 0
      ? (books.reduce((acc, book) => acc + Number(book.price || 0), 0) / books.length).toFixed(0)
      : 0;

  const clearFilters = () => {
    setSearch("");
    setActiveAuthor("All");
    setSortBy("featured");
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Welcome to BookStore</h1>
          <p>Discover your next favorite book from thousands of titles</p>
          <div className="hero-search">
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search by book title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="hero-search-btn">Search</button>
          </div>
        </div>
      </section>

      {/* BOOKS SECTION */}
      <section className="books-section">
        <div className="books-showcase-header">
          <div>
            <p className="books-kicker">Collection</p>
            <h2>Find your next read</h2>
            <p className="books-subtitle">
              Explore hand-picked titles and quickly narrow down by author or price.
            </p>
          </div>

          <div className="books-stats">
            <div className="books-stat">
              <span>{books.length}</span>
              <small>Total Books</small>
            </div>
            <div className="books-stat">
              <span>{authors.length - 1}</span>
              <small>Authors</small>
            </div>
            <div className="books-stat">
              <span>Rs. {avgPrice}</span>
              <small>Avg. Price</small>
            </div>
          </div>
        </div>

        <div className="books-toolbar">
          <p className="result-badge">
            Showing {sortedBooks.length} {sortedBooks.length === 1 ? "book" : "books"}
          </p>

          <div className="books-sort">
            <label htmlFor="sortBy">Sort</label>
            <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="title-asc">Title A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="author-chips">
          {authors.map((author) => (
            <button
              key={author}
              type="button"
              className={`author-chip ${activeAuthor === author ? "active" : ""}`}
              onClick={() => setActiveAuthor(author)}
            >
              {author}
            </button>
          ))}
        </div>

        <div className="books-grid books-grid-modern">
          {loading ? (
            <div className="no-results modern-no-results">
              <h3>Loading books...</h3>
            </div>
          ) : error ? (
            <div className="no-results modern-no-results">
              <h3>{error}</h3>
              <p>Please try again in a moment.</p>
            </div>
          ) : sortedBooks.length > 0 ? (
            sortedBooks.map((book) => (
              <BookCard book={book} key={book._id} />
            ))
          ) : (
            <div className="no-results modern-no-results">
              <h3>No books found</h3>
              <p>Try adjusting search, author filter, or sort.</p>
              <button type="button" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
