import React from "react";
import ProductCard from "./ProductCard";
import "../styles/styles.css";

export default function ProductList({
  products = [],
  onAddToCart,
  onAddToFavorites,
  onProductClick,
}) {
  return (
    <div style={{ paddingTop: '40px', maxWidth: '1300px', margin: '0 auto' }}>
      {products.length > 0 ? (
        <div className="container">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onAddToFavorites={onAddToFavorites}
              onClick={() => onProductClick(product)}
            />
          ))}
        </div>
      ) : (
        <p style={{ color: "#ccc", textAlign: "center", marginTop: "20px" }}>
          No se encontraron productos.
        </p>
      )}
    </div>
  );
}
