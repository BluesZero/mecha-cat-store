// src/components/FranchiseSelector.jsx
import React from 'react';
import franchises from '../data/franchises.json';
import FranchiseCard from './FranchiseCard';
import '../styles/styles.css';

export default function FranchiseSelector() {
  return (
    <div style={{ paddingTop: '60px', maxWidth: '1300px', margin: '0 auto' }}>
      <h2 className="section-title">| Selecciona una franquicia |</h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
        marginTop: '30px'
      }}>
        {franchises.map(f => (
          <FranchiseCard key={f.id} id={f.id} name={f.name} logo={f.logo} />
        ))}
      </div>
    </div>
  );
}
