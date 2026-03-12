import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "../utils/toast";
import "./pages.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(form);
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Login to continue shopping</p>

        <input name="email" placeholder="Enter your email" onChange={handleChange} />

        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          onChange={handleChange}
        />

        <button onClick={handleLogin}>{loading ? "Please wait..." : "Login"}</button>

        <span onClick={() => navigate("/register")}>Don't have an account? Register</span>
      </div>
    </div>
  );
}
