import React from "react";
import "../styles/styles.css";

export default function ProductCard({ product, onAddToCart, onAddToFavorites, onClick }) {
  return (
    <div className="product-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-price">${product.price} MXN</div>
        <button
          className="buy-button"
          onClick={(e) => {
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
