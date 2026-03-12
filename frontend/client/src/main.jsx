import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import ToastContainer from "./components/ToastContainer";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <ToastContainer />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
