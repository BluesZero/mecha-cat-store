// src/components/FranchiseSelector.jsx
import React from 'react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import FranchiseCard from './FranchiseCard';
import '../styles/styles.css';

export default function FranchiseSelector() {
  const { data: franchises, loading } = useSupabaseData('franchises');

  return (
    <div  className="page-fade" style={{ paddingTop: '60px', maxWidth: '1300px', margin: '0 auto' }}>
      <h2 className="section-title">| Selecciona una franquicia |</h2>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Cargando franquicias...</p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            marginTop: '30px',
            overflowY: 'hidden',
          }}
        >
          {franchises.map((f) => (
            <FranchiseCard key={f.id} id={f.id} name={f.name} logo={f.logo} />
          ))}
        </div>
      )}
    </div>
  );
}
