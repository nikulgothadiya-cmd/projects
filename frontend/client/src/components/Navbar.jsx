import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import "./components.css";
import { ADMIN_BASE_URL } from "../utils/api";

export default function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ordersCount, setOrdersCount] = useState(0);

  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);

  useEffect(() => {
    if (user) {
      axios
        .get("/api/orders/my")
        .then((res) => setOrdersCount(res.data.length))
        .catch((err) => console.error("Failed to fetch orders", err));
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar-loading">
          <div className="loading-spinner"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">📚</span>
          <span className="logo-text">BookStore</span>
        </Link>

        {/* Desktop Search */}
        <div className="navbar-search">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="🔍 Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-actions">
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/about" className="nav-link" onClick={closeMenu}>
            About
          </Link>

          <Link to="/contact" className="nav-link" onClick={closeMenu}>
            Contact
          </Link>

          <Link to="/cart" className="nav-link cart-link" onClick={closeMenu}>
            Cart
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>

          {user && (
            <Link to="/orders" className="nav-link orders-link" onClick={closeMenu}>
              Orders
              {ordersCount > 0 && (
                <span className="orders-count">{ordersCount}</span>
              )}
            </Link>
          )}

          {!user ? (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn" onClick={closeMenu}>
                <span className="btn-icon">🔑</span>
                <span className="btn-text">Login</span>
              </Link>
              <Link to="/register" className="auth-btn register-btn" onClick={closeMenu}>
                <span className="btn-icon">✨</span>
                <span className="btn-text">Sign Up</span>
              </Link>
            </div>
          ) : (
            <div className="user-menu">
              <div className="user-info">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
              </div>

              {user.isAdmin && (
                <button
                  className="admin-btn"
                  onClick={() => window.location.href = ADMIN_BASE_URL}
                  title="Admin Panel"
                >
                  <span className="btn-icon">⚙️</span>
                  <span className="btn-text">Admin</span>
                </button>
              )}

              <button
                className="logout-btn"
                onClick={handleLogout}
                title="Logout"
              >
                <span className="btn-icon">🚪</span>
                <span className="btn-text">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
      <div className="mobile-menu open">
        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mobile-search">
          <input
            type="text"
            placeholder="🔍 Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mobile-search-input"
          />
          <button type="submit" className="mobile-search-btn">Search</button>
        </form>

        {/* Mobile Navigation Links */}
        <div className="mobile-nav-links">
          <Link to="/" className="mobile-nav-link" onClick={closeMenu}>
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>

          <Link to="/about" className="mobile-nav-link" onClick={closeMenu}>
            About
          </Link>

          <Link to="/contact" className="mobile-nav-link" onClick={closeMenu}>
            Contact
          </Link>

          <Link to="/cart" className="mobile-nav-link" onClick={closeMenu}>
            Cart
            {cartItemCount > 0 && (
              <span className="mobile-cart-count">({cartItemCount})</span>
            )}
          </Link>

          {user && (
            <Link to="/orders" className="mobile-nav-link" onClick={closeMenu}>
              My Orders
              {ordersCount > 0 && (
                <span className="mobile-orders-count">({ordersCount})</span>
              )}
            </Link>
          )}
        </div>

        {/* Mobile Auth Section */}
        {!user ? (
          <div className="mobile-auth">
            <Link to="/login" className="mobile-auth-btn login-btn" onClick={closeMenu}>
              <span className="btn-icon">🔑</span>
              <span>Login</span>
            </Link>
            <Link to="/register" className="mobile-auth-btn register-btn" onClick={closeMenu}>
              <span className="btn-icon">✨</span>
              <span>Sign Up</span>
            </Link>
          </div>
        ) : (
          <div className="mobile-user">
            <div className="mobile-user-info">
              <div className="mobile-user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="mobile-user-details">
                <span className="mobile-user-name">{user.name}</span>
                <span className="mobile-user-email">{user.email}</span>
              </div>
            </div>

            {user.isAdmin && (
              <button
                className="mobile-admin-btn"
                onClick={() => window.location.href = ADMIN_BASE_URL}
              >
                <span className="btn-icon">⚙️</span>
                <span>Admin Panel</span>
              </button>
            )}

            <button
              className="mobile-logout-btn"
              onClick={handleLogout}
            >
              <span className="btn-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
      )}
    </nav>
  );
}

