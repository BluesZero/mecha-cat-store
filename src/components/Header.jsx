// src/components/Header.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({
  cartCount,
  searchQuery,
  setSearchQuery,
  filteredProducts
}) {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Detectar clic fuera del buscador
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearchQuery]);

  const handleProductSelect = (product) => {
    setSearchQuery("");
    navigate(`/product/${product.id}`);
  };

  return (
    <header style={{ background: "#ff3881", padding: "8px 150px" }}>
      <div className="header-left">
        <h1 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          MEKA CAT STORE
        </h1>

        <div
          ref={searchRef}
          style={{ position: "relative", display: "flex", alignItems: "center" }}
        >
          <img
            src="/img/search.png"
            alt="Buscar"
            style={{
              position: "absolute",
              left: "12px",
              width: "18px",
              opacity: 1
            }}
          />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "300px",
              padding: "10px 12px 10px 38px",
              borderRadius: "10px",
              background: "#fff",
              border: "none",
              color: "#222",
              fontSize: "14px",
              outline: "none"
            }}
          />

          {searchQuery.length > 0 && filteredProducts.length > 0 && (
            <ul
              style={{
                border: "1px solid #444",
                backdropFilter: "blur(4px)",
                position: "absolute",
                top: "44px",
                left: 0,
                backgroundColor: "#1e1f26",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
                width: "300px",
                zIndex: 1000,
                listStyle: "none",
                maxHeight: "300px",
                overflowY: "auto"
              }}
            >
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  style={{
                    transition: "background 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px",
                    color: "white",
                    cursor: "pointer",
                    borderBottom: "1px solid #333"
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "6px"
                    }}
                  />
                  <span>{product.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <nav style={{ position: "relative", display: "flex", gap: "20px", alignItems: "center" }}>
        <img
          src="/img/icon.png"
          alt="Cuenta"
          className="icon"
          onClick={() => navigate("/account")}
          style={{ cursor: "pointer" }}
        />
        <img src="/img/wish.png" alt="Wishlist" className="icon" />
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src="/img/cart.png"
            alt="Carrito"
            className="icon"
            onClick={() => navigate("/checkout/summary")}
            style={{ cursor: "pointer" }}
          />
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                background: "#e22c6b",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px",
                fontWeight: "bold"
              }}
            >
              {cartCount}
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}
