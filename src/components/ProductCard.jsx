import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAddToCart }) {
  const isSoldOut = product.stock === 0;
  const isPreorder = product.preorder;
  const isDiscount = product.discount;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  // ✅ Asegurarse de obtener la imagen principal correctamente
  const mainImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : product.image;

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card"
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#2d2e38",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Etiqueta Preventa */}
      {isPreorder && !isSoldOut && (
        <span
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "bold",
            zIndex: 3,
          }}
        >
          Preventa
        </span>
      )}

      {/* Badge de descuento */}
      {isDiscount && product.originalPrice && (
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#ff3881",
            color: "white",
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "bold",
            zIndex: 3,
          }}
        >
          -{Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) * 100
          )}
          %
        </span>
      )}

      {/* Overlay Agotado */}
      {isSoldOut && (
        <div
          className="sold-out-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(25, 34, 53, 0.75)",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            textTransform: "uppercase",
          }}
        >
          Agotado
        </div>
      )}

      {/* Imagen del producto */}
      <img
        src={mainImage}
        alt={product.name}
        className="product-image"
        style={{
          width: "100%",
          height: "240px",
          objectFit: "contain",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          display: "block",
        }}
      />

      {/* Información del producto */}
      <div
        className="product-info"
        style={{
          padding: "18px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          className="product-name"
          style={{
            fontSize: "17px",
            fontWeight: 600,
            color: "white",
            marginBottom: "8px",
          }}
        >
          {product.name}
        </div>

        <div
          className="product-price"
          style={{
            fontSize: "16px",
            marginBottom: "12px",
          }}
        >
          {isDiscount ? (
            <>
              <span
                style={{
                  color: "#ccc",
                  textDecoration: "line-through",
                  marginRight: "8px",
                  fontSize: "14px",
                }}
              >
                ${product.originalPrice.toFixed(2)}
              </span>
              <span style={{ color: "#8fff8f", fontWeight: "bold" }}>
                ${product.price.toFixed(2)} MXN
              </span>
            </>
          ) : (
            <span style={{ color: "#8fff8f" }}>
              ${product.price.toFixed(2)} MXN
            </span>
          )}
        </div>

        <button
          onClick={handleClick}
          disabled={isSoldOut}
          className={`buy-button ${isSoldOut ? "disabled" : ""}`}
          style={{
            backgroundColor: isSoldOut ? "#cccccc" : "#ff3881",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "30px",
            cursor: isSoldOut ? "not-allowed" : "pointer",
            width: "100%",
            fontSize: "15px",
            fontWeight: "bold",
            transition: "background-color 0.3s ease",
            marginTop: "auto",
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </Link>
  );
}
