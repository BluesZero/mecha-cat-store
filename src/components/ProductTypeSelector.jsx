// src/components/ProductTypeSelector.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSupabaseData } from '../hooks/useSupabaseData';
import ProductTypeCard from './ProductTypeCard';
import '../styles/styles.css';

export default function ProductTypeSelector() {
  const { franchiseId } = useParams();

  const { data: products, loading: loadingProducts } = useSupabaseData('products');
  const { data: productTypes, loading: loadingTypes } = useSupabaseData('product_types');

  if (loadingProducts || loadingTypes) {
    return <p style={{ color: 'white', padding: '60px' }}>Cargando tipos de productos...</p>;
  }

  // Obtener solo los tipos usados en esta franquicia
  const typeIds = [
    ...new Set(
      products
        .filter((p) => p.franchise_id === franchiseId)
        .map((p) => p.product_type_id)
    ),
  ];

  const availableTypes = productTypes.filter(
    (pt) => pt.franchise_id === franchiseId && typeIds.includes(pt.id)
  );

  return (
    <div
      className="page-fade"
      
      style={{
        paddingTop: '60px',
        maxWidth: '1300px',
        margin: '0 auto',
        overflowX: 'hidden',
        overflowY: 'hidden',
      }}
    >
      <h2 className="section-title">| Selecciona un tipo de producto |</h2>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '30px',
          padding: '0 30px',
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
