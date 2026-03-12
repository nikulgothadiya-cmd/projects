import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.defaults.baseURL = API_BASE_URL;
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["X-App-Client"] = "client";

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (form) => {
    const res = await axios.post("/api/auth/login", form);
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

