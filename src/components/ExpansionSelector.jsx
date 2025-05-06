// src/components/ExpansionSelector.jsx
import React from "react";
import expansions from "../data/expansions.json";
import ExpansionCard from "./ExpansionCard";

export default function ExpansionSelector() {
  return (
    <div style={{ paddingTop: '60px', maxWidth: '1300px', margin: '0 auto' }}>
      <h2 className="section-title">| Selecciona una expansión |</h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '30px',
        }}
      >
        {expansions.map((exp) => (
          <ExpansionCard
            key={exp.id}
            id={exp.id}
            name={exp.name}
            franchise={exp.franchise}
            collectionId={exp.collectionId}
            image={exp.image}
          />
        ))}
      </div>
    </div>
  );
}
