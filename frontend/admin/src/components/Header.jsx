import { useEffect, useState } from "react";
import API from "../api/axios";
import "./components.css";

export default function Header() {
  const [admin, setAdmin] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchAdmin();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await API.get("/auth/me");

      setAdmin(res.data);
    } catch (err) {
      console.log("Not authorized");
    }
  };

  const logout = async () => {
    await API.post("/auth/logout", {});

    window.location.href = "/login";
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="admin-header">
      <div className="header-left">
        <div className="header-branding">
          <h1 className="header-title">📚 BookStore</h1>
          <p className="header-subtitle">Admin Panel</p>
        </div>
      </div>

      <div className="header-center">
        <div className="time-widget">
          <div className="time-display">{formatTime(currentTime)}</div>
          <div className="date-display">{formatDate(currentTime)}</div>
        </div>
      </div>

      <div className="header-right">
        <div className="admin-profile">
          <div className="admin-info">
            <p className="admin-greeting">Welcome back,</p>
            <p className="admin-name">{admin?.name || "Admin"}</p>
          </div>
          <div className="admin-avatar">
            {getInitials(admin?.name || "Admin")}
          </div>
        </div>

        <div className="header-divider"></div>

        <button className="logout-btn" onClick={logout} title="Logout">
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
