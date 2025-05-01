// src/components/ProductTypeSelector.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import products from '../data/products.json';
import productTypes from '../data/productTypes.json';
import '../styles/styles.css';

export default function ProductTypeSelector() {
  const { franchiseId } = useParams();

  // Encuentra qué tipos de producto están presentes en esta franquicia
  const typeIds = [
    ...new Set(
      products
        .filter((p) => p.franchiseId === franchiseId)
        .map((p) => p.productTypeId)
    ),
  ];

  const availableTypes = productTypes.filter((pt) =>
    typeIds.includes(pt.id)
  );

  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <h2 className="section-title">Productos de {franchiseId.toUpperCase()}</h2>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {availableTypes.map((type) => (
          <Link
            key={type.id}
            to={`/franchise/${franchiseId}/product-types/${type.id}/products`}
            style={{
              background: '#2d2e38',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '10px',
              textDecoration: 'none',
            }}
          >
            {type.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
