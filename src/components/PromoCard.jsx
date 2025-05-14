// src/components/PromoCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PromoCard({ image, alt, link }) {
  return (
    <Link
      to={link}
      className="promo-card"
      style={{
        background: "#2d2e38",
        borderRadius: "16px",
        width: "40%",
        maxWidth: "500px",
        padding: "0px",
        textAlign: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        display: "block",
        overflow: "hidden",
        lineHeight: 0 
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.04)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
      }}
    >
      <img
        src={image}
        alt={alt}
        style={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
          borderRadius: "12px"
        }}
      />
    </Link>
  );
}
