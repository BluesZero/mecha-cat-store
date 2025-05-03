// src/components/ProductTypeCard.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";

export default function ProductTypeCard({ id, name, icon }) {
  const { franchiseId } = useParams(); // usado en rutas anidadas

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
      {icon && (
        <img
          src={icon}
          alt={name}
          style={{ height: '100px', objectFit: 'contain', marginBottom: '12px' }}
        />
      )}
      <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '16px' }}>{name}</h3>
      <Link
        to={`/franchise/${franchiseId}/product-types/${id}/products`}
        style={{
          background: '#ff3881',
          color: 'white',
          padding: '10px 14px',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        Ver productos
      </Link>
    </div>
  );
}
