// src/components/FranchiseCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function FranchiseCard({ id, name, logo }) {
  return (
    <div style={{
      background: '#2d2e38',
      borderRadius: '16px',
      width: '240px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <img
        src={logo}
        alt={name}
        style={{ height: '100px', objectFit: 'contain', marginBottom: '12px' }}
      />
      <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '16px' }}>{name}</h3>
      <Link
        to={`/franchise/${id}/product-types`}
        style={{
          background: '#ff3881',
          color: 'white',
          padding: '10px 14px',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        Explorar
      </Link>
    </div>
  );
}
