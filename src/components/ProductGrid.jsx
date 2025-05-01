// src/components/ProductGrid.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products.json';
import ProductCard from './ProductCard';
import '../styles/styles.css';

export default function ProductGrid({ onAddToCart }) {
  const { franchiseId, expansionId, typeId } = useParams();

  const filtered = products.filter((p) => {
    const matchFranchise = p.franchiseId === franchiseId;
    const matchExpansion = expansionId ? p.expansionId === expansionId : true;
    const matchType = typeId ? p.productTypeId === typeId : true;
    return matchFranchise && matchExpansion && matchType;
  });
  

  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <h2 className="section-title">
        Resultados ({filtered.length}) – {franchiseId.toUpperCase()}
      </h2>

      {filtered.length === 0 ? (
        <p style={{ color: '#ccc', textAlign: 'center' }}>No se encontraron productos.</p>
      ) : (
        filtered.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))
      )}
    </div>
  );
}
