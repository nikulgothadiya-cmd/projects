import { useState } from "react";
import API from "../api/axios";
import { toast } from "../utils/toast";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!form.email || !form.password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      const res = await API.post("/auth/login", form);

      if (!res.data.user.isAdmin) {
        setError("Not an admin. Access denied.");
        setLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("adminEmail", form.email);
      } else {
        localStorage.removeItem("adminEmail");
      }

      toast.success("Admin login successful");
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid credentials");
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setForm({ ...form, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setForm({ ...form, password: e.target.value });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin(e);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-container">
        <div className="login-branding">
          <div className="login-logo">Book</div>
          <h1 className="login-brand-title">BookStore Admin</h1>
          <p className="login-brand-subtitle">Secure Access to Admin Panel</p>
          <div className="login-features">
            <div className="feature-item">
              <span className="feature-icon">Secure</span>
              <span>Secure Login</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">Fast</span>
              <span>Fast Access</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">Safe</span>
              <span>Protected Data</span>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="login-card">
            <div className="login-header">
              <h2 className="login-title">Admin Login</h2>
              <p className="login-description">Sign in to your admin account</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group-login">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">@</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your admin email"
                    value={form.email}
                    onChange={handleEmailChange}
                    onKeyPress={handleKeyPress}
                    className="login-input"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group-login">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">*</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handlePasswordChange}
                    onKeyPress={handleKeyPress}
                    className="login-input"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">!</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>

              <button
                type="submit"
                className={`login-button ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </button>
            </form>

            <div className="login-footer">
              <p className="login-footer-text">Protected with secure authentication - Admin only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
