export const TOAST_EVENT = "app-toast";

function emitToast(type, message, duration = 3000) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: { type, message, duration },
    })
  );
}

export const toast = {
  success: (message, duration) => emitToast("success", message, duration),
  error: (message, duration) => emitToast("error", message, duration),
  info: (message, duration) => emitToast("info", message, duration),
  warn: (message, duration) => emitToast("warn", message, duration),
};

