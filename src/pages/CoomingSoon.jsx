// src/pages/ComingSoon.jsx
import React from "react";

export default function ComingSoon() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e1f26, #2a2f34)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        textAlign: "center",
        color: "white",
        animation: "fadeIn 0.6s ease-out",
      }}
    >
      <h1 style={{ fontSize: "48px", color: "#ff3881", marginBottom: "20px" }}>
        🚀 Coming Soon
      </h1>
      <p style={{ fontSize: "22px", marginBottom: "30px", color: "#ccc" }}>
        Our online store will be launching on
      </p>
      <div
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          color: "#8fff8f",
          background: "#1e1f26",
          padding: "16px 30px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        August 28, 2025
      </div>
      <p style={{ marginTop: "40px", fontSize: "16px", color: "#888" }}>
        Stay tuned for amazing products and exclusive deals!
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
