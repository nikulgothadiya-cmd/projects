import { Link, useLocation } from "react-router-dom";
import "./components.css";
export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="sidebar">
      <h2 className="logo">📚 Admin</h2>

      <nav>
        <Link className={pathname === "/" ? "active" : ""} to="/">
          🏠 Dashboard
        </Link>

        <Link className={pathname === "/books" ? "active" : ""} to="/books">
          📖 Manage Books
        </Link>

        <Link className={pathname === "/orders" ? "active" : ""} to="/orders">
          🧾 Manage Orders
        </Link>

        <Link className={pathname === "/users" ? "active" : ""} to="/users">
          👥 Manage Users
        </Link>
      </nav>
    </div>
  );
}