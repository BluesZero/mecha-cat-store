// src/components/ProductTypeSelector.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products.json';
import productTypes from '../data/productTypes.json';
import ProductTypeCard from './ProductTypeCard';

export default function ProductTypeSelector() {
  const { franchiseId } = useParams();

  const typeIds = [
    ...new Set(
      products
        .filter((p) => p.franchiseId === franchiseId)
        .map((p) => p.productTypeId)
    ),
  ];

  const availableTypes = productTypes.filter((pt) => typeIds.includes(pt.id));

  return (
    <div style={{ paddingTop: '60px', maxWidth: '1300px', margin: '0 auto' }}>
      <h2 className="section-title">Tipos de producto – {franchiseId.toUpperCase()}</h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
        marginTop: '30px'
      }}>
        {availableTypes.map((type) => (
          <ProductTypeCard key={type.id} id={type.id} name={type.name} icon={type.icon} />
        ))}
      </div>
    </div>
  );
}
