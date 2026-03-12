import { useEffect, useState } from "react";
import { TOAST_EVENT } from "../utils/toast";

const TYPE_STYLES = {
  success: { background: "#16a34a" },
  error: { background: "#dc2626" },
  info: { background: "#2563eb" },
  warn: { background: "#d97706" },
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const onToast = (event) => {
      const { type = "info", message = "", duration = 3000 } = event.detail || {};
      if (!message) return;

      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message }]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "min(360px, calc(100vw - 24px))",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            color: "#fff",
            borderRadius: 10,
            padding: "12px 14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: 1.4,
            ...TYPE_STYLES[toast.type],
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

