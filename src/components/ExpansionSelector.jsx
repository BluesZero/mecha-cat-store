// src/components/ExpansionSelector.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ExpansionCard from "./ExpansionCard";

export default function ExpansionSelector() {
  const [expansions, setExpansions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpansions = async () => {
      const { data, error } = await supabase
        .from("expansions")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error al cargar expansiones:", error);
      } else {
        setExpansions(data);
      }

      setLoading(false);
    };

    fetchExpansions();
  }, []);

  return (
    <div className="page-fade" style={{ paddingTop: '60px', maxWidth: '1300px', margin: '0 auto' }}>
      <h2 className="section-title">| Selecciona una expansión |</h2>

      {loading ? (
        <p style={{ textAlign: "center", color: "#ccc" }}>Cargando expansiones...</p>
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
          {expansions.map((exp) => (
            <ExpansionCard
              key={exp.id}
              id={exp.id}
              name={exp.name}
              franchise={exp.franchise_id}
              collectionId={exp.collection_id}
              image={exp.image}
            />
          ))}
        </div>
      )}
    </div>
  );
}
