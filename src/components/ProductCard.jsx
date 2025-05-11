//ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card" style={{ position: "relative" }}>
      {/* Etiquetas condicionales */}
      {product.preorder && <span style={tagStyle("#28a745")}>Preventa</span>}
      {product.stock === 0 && <span style={tagStyle("#dc3545")}>Agotado</span>}
      {product.discount && <span style={tagStyle("#ffc107", "right")}>Oferta</span>}

      <Link
        to={`/product/${product.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <div className="product-name">{product.name}</div>
          <div className="product-price">${product.price} MXN</div>
        </div>
      </Link>

      <div style={{ padding: "0 18px 18px", marginTop: "auto" }}>
        <button
          className="buy-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(product);
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

// Estilo de etiqueta reutilizable
const tagStyle = (color, position = "left") => ({
  position: "absolute",
  top: "10px",
  [position]: "10px",
  backgroundColor: color,
  color: "white",
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "bold",
  zIndex: 10
});
