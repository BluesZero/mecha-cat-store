// src/components/FranchiseSelector.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import franchises from '../data/franchises.json';
import expansions from '../data/expansions.json';
import productTypes from '../data/productTypes.json';
import '../styles/styles.css';

export default function FranchiseSelector() {
  const [selectedFranchise, setSelectedFranchise] = useState(null);

  return (
    <main style={{ padding: '60px 20px' }}>
      <h2 className="section-title">| Selecciona una franquicia |</h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {franchises.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFranchise(f.id)}
            style={{
              background: '#2d2e38',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      {selectedFranchise && (
        <>
          <h3 className="section-title" style={{ marginTop: '50px' }}>
            Expansiones de {selectedFranchise.charAt(0).toUpperCase() + selectedFranchise.slice(1)}
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {expansions
              .filter(e => e.franchiseId === selectedFranchise)
              .map(e => (
                <Link
                  key={e.id}
                  to={`/franchise/${selectedFranchise}/expansions/${e.id}/products`}
                  style={{
                    background: '#1e1f26',
                    color: 'white',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    textDecoration: 'none'
                  }}
                >
                  {e.name}
                </Link>
              ))}
          </div>

          <h3 className="section-title" style={{ marginTop: '40px' }}>
            Categorías
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {productTypes.map(pt => (
              <Link
                key={pt.id}
                to={`/franchise/${selectedFranchise}/product-types/${pt.id}/products`}
                style={{
                  background: '#1e1f26',
                  color: 'white',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  textDecoration: 'none'
                }}
              >
                {pt.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
