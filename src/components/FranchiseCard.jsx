// src/components/FranchiseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

export default function FranchiseCard({ id, name, logo }) {
  return (
    <Link
      to={`/franchise/${id}/product-types`}
      className="franchise-card"
      style={{
        background: '#2d2e38',
        color: 'white',
        borderRadius: '16px',
        textDecoration: 'none',
        width: '240px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#3a3b47';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.4)';
        e.currentTarget.style.transform = 'scale(1.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#2d2e38';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {logo && (
        <img
          src={logo}
          alt={name}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'contain',
            marginBottom: '16px',
          }}
        />
      )}

    </Link>
  );
}
