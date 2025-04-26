// components/Account.jsx
import React from "react";

export default function Account({ user, onLogout, onShowAddProduct }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #1e1f26, #2a2f34)",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "500px",
        background: "#2a2f34",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        textAlign: "center",
        animation: "fadeIn 0.4s ease-out"
      }}>
        <h2 style={{ color: "white", marginBottom: "20px" }}>
          Bienvenido{user?.isAdmin ? " Admin 👑" : ""}, {user.username}!
        </h2>

        <button
          onClick={onLogout}
          className="buy-button"
          style={{ width: "100%", marginBottom: "20px" }}
        >
          Cerrar sesión
        </button>

        {user?.isAdmin && (
          <button
            onClick={onShowAddProduct}
            className="buy-button"
            style={{ width: "100%" }}
          >
            Registrar nuevo producto
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
