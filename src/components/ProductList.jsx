import React from "react";
import ProductCard from "./ProductCard";
import { useSupabaseData } from "../hooks/useSupabaseData";
import "../styles/styles.css";

export default function ProductList({ onAddToCart, onAddToFavorites, onProductClick }) {
  const { data: products, loading } = useSupabaseData("products");

  return (
    <div style={{ paddingTop: '40px', maxWidth: '1300px', margin: '0 auto' }}>
      {loading ? (
        <p style={{ color: "#ccc", textAlign: "center", marginTop: "20px" }}>
          Cargando productos...
        </p>
      ) : products.length > 0 ? (
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
