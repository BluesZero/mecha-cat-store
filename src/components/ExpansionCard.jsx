// src/components/ExpansionCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

export default function ExpansionCard({ id, name, collectionId, image, franchise }) {
  return (
    <Link
      to={`/franchise/${franchise}/expansions/${id}/products`}
      style={{
        background: '#2d2e38',
        borderRadius: '16px',
        width: '240px',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#3a3b47';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.4)';
        e.currentTarget.style.transform = 'scale(1.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#2d2e38';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {image && (
        <img
          src={image}
          alt={name}
          style={{
            height: '100px',
            objectFit: 'contain',
            marginBottom: '12px',
          }}
        />
      )}

    </Link>
  );
}
