import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api/axios";
import "./components.css";

export default function AdminProtectedRoute({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await API.get("/auth/me");

      if (res.data.isAdmin) {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    } catch {
      setAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-route-loading">
        <div className="route-spinner"></div>
        <p>Checking admin access...</p>
      </div>
    );
  }

  return admin ? children : <Navigate to="/login" />;
}
