import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <Link
        to={`/product/${product.id}`}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <div className="product-name">{product.name}</div>
          <div className="product-price">${product.price} MXN</div>
        </div>
      </Link>

      <div style={{ padding: '0 18px 18px', marginTop: 'auto' }}>
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
