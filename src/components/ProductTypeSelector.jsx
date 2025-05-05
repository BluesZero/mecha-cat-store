// src/components/ProductTypeSelector.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products.json';
import productTypes from '../data/productTypes.json';
import ProductTypeCard from './ProductTypeCard';
import '../styles/styles.css';

export default function ProductTypeSelector() {
  const { franchiseId } = useParams();

  // Obtener solo los tipos usados en esta franquicia
  const typeIds = [
    ...new Set(
      products
        .filter((p) => p.franchiseId === franchiseId)
        .map((p) => p.productTypeId)
    ),
  ];

  const availableTypes = productTypes.filter(
    (pt) => pt.franchiseId === franchiseId && typeIds.includes(pt.id)
  );

  return (
    <div style={{ paddingTop: '60px', maxWidth: '1300px', margin: '0 auto' }}>
      <h2 className="section-title">| Selecciona un tipo de producto |</h2>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '30px',
        }}
      >
        {availableTypes.map((type) => (
          <ProductTypeCard
            key={type.id}
            id={type.id}
            name={type.name}
            image={type.image}
            franchiseId={franchiseId}
          />
        ))}
      </div>
    </div>
  );
}
