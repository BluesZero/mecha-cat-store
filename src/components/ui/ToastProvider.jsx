import React, { createContext, useCallback, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import "./toast.css";

export const ToastCtx = createContext({ addToast: () => {} });

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = crypto.randomUUID();
    const duration = toast.duration ?? 2600;

    setToasts((prev) => [...prev, { id, ...toast }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {ReactDOM.createPortal(
        <div className="toast-container" aria-live="polite" aria-atomic="true">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.type || "info"}`}>
              <div className="toast-left">
                {t.icon ? <span className="toast-icon">{t.icon}</span> : null}
                <div className="toast-body">
                  {t.title && <div className="toast-title">{t.title}</div>}
                  {t.description && <div className="toast-desc">{t.description}</div>}
                </div>
              </div>

              <div className="toast-actions">
                {t.actionLabel && t.onAction && (
                  <button
                    className="toast-action"
                    onClick={() => { t.onAction(); removeToast(t.id); }}
                  >
                    {t.actionLabel}
                  </button>
                )}
                <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  );
}
