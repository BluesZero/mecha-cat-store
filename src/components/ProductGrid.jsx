// src/components/ProductGrid.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSupabaseData } from '../hooks/useSupabaseData';
import ProductCard from './ProductCard';
import '../styles/styles.css';

export default function ProductGrid({ onAddToCart }) {
  const { franchiseId, expansionId, typeId } = useParams();
  const { data: products, loading } = useSupabaseData('products');

  const filtered = products.filter((p) => {
    const matchFranchise = p.franchise_id === franchiseId;
    const matchExpansion = expansionId ? p.expansion_id === expansionId : true;
    const matchType = typeId ? p.product_type_id === typeId : true;
    return matchFranchise && matchExpansion && matchType;
  });

  return (
    <div  className="page-fade" style={{ paddingTop: '60px', maxWidth: '1300px', margin: '0 auto' }}>
      <h2 className="section-title">
        {loading
          ? 'Cargando productos...'
          : `Resultados (${filtered.length}) – ${franchiseId?.toUpperCase()}`}
      </h2>

      {loading ? (
        <p style={{ color: '#ccc', textAlign: 'center' }}>
          Cargando productos...
        </p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#ccc', textAlign: 'center' }}>
          No se encontraron productos.
        </p>
      ) : (
        <div className="container">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: Number(product.price),
                originalPrice: Number(product.original_price),
              }}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
