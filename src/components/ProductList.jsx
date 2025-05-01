//ProductsList.jsx
import React from "react";
import ProductCard from "./ProductCard";
import "../styles/styles.css";

export default function ProductList({ products = [], onAddToCart, onAddToFavorites, onProductClick }) {
  return (
    <div className="container">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToFavorites={onAddToFavorites}
            onClick={() => onProductClick(product)}
          />
        ))
      ) : (
        <p style={{ color: "#ccc", textAlign: "center", marginTop: "20px" }}>
          No se encontraron productos.
        </p>
      )}
    </div>
  );
}

