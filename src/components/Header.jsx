//Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({
  cartCount,
  searchQuery,
  setSearchQuery,
  filteredProducts,
  handleProductClick,
}) {
  const navigate = useNavigate();

  return (
    <header>
      <div className="header-left">
        <h1 style={{ cursor: 'pointer' }} onClick={() => navigate("/")}>Meka Cat Store</h1>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <img
            src="/img/search.png"
            alt="Buscar"
            style={{ position: 'absolute', left: '8px', width: '25px', opacity: 0.6 }}
          />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '300px', paddingLeft: '28px' }}
          />
          {searchQuery.length > 0 && filteredProducts.length > 0 && (
            <ul
              style={{
                border: '1px solid #444', // 👈 delimita el contenedor
                backdropFilter: 'blur(4px)', // 👈 mejora visual
                position: 'absolute',
                top: '40px',
                left: 0,
                backgroundColor: '#1e1f26',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                width: '280px',
                zIndex: 1000,
                listStyle: 'none',
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              {filteredProducts.map(product => (
                <li
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  style={{
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    borderBottom: '1px solid #333'
                  }}
                >
                  <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                  <span>{product.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <nav style={{ position: 'relative', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <img
          src="/img/icon.png"
          alt="Cuenta"
          className="icon"
          onClick={() => navigate("/account")}
          style={{ cursor: 'pointer' }}
        />
        <img src="/img/wish.png" alt="Wishlist" className="icon" />
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src="/img/cart.png"
            alt="Carrito"
            className="icon"
            onClick={() => navigate("/cart")}
            style={{ cursor: 'pointer' }}
          />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -6,
              right: -6,
              background: '#e22c6b',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px',
              fontWeight: 'bold',
              
            }}>{cartCount}</span>
          )}
        </div>
      </nav>
    </header>
  );
}
