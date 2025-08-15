// src/components/ExpansionSelector.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import ExpansionCard from "./ExpansionCard";
import "../styles/loader.css";

/**
 * Props:
 * - franchiseId?: string  (opcional: filtra por franquicia en la consulta)
 */
export default function ExpansionSelector({ franchiseId }) {
  const [expansions, setExpansions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  // Debounce para la búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const fetchExpansions = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      let query = supabase
        .from("expansions")
        .select("*")
        .order("name", { ascending: true });

      if (franchiseId) query = query.eq("franchise_id", franchiseId);

      const { data, error } = await query;
      if (error) throw error;
      setExpansions(data || []);
    } catch (e) {
      console.error("Error al cargar expansiones:", e);
      setErr("No se pudieron cargar las expansiones. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [franchiseId]);

  useEffect(() => {
    fetchExpansions();
  }, [fetchExpansions]);

  // Realtime: refrescar cuando cambia la tabla
  useEffect(() => {
    const channel = supabase
      .channel("expansions-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expansions" },
        () => fetchExpansions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchExpansions]);

  // Filtro local por búsqueda
  const filtered = useMemo(() => {
    if (!debounced) return expansions;
    return expansions.filter((e) =>
      (e.name || "").toLowerCase().includes(debounced)
    );
  }, [expansions, debounced]);

  return (
    <div
      className="page-fade"
      style={{ paddingTop: "60px", maxWidth: "1300px", margin: "0 auto" }}
      aria-busy={loading}
      aria-live="polite"
    >
      <h2 className="section-title">| Selecciona una expansión |</h2>

      {/* Buscador + contador */}
      <div
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", width: 320, maxWidth: "90vw" }}>
          <img
            src="/img/search.png"
            alt=""
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 18,
              opacity: 0.6,
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar expansión..."
            aria-label="Buscar expansión"
            style={{
              width: "100%",
              padding: "10px 12px 10px 36px",
              borderRadius: 10,
              border: "1px solid #444",
              background: "#1e1f26",
              color: "white",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>

        <span style={{ color: "#888", fontSize: 14 }}>
          {loading ? "Cargando..." : `Resultados: ${filtered.length}`}
        </span>
      </div>

      {/* Estados */}
      {err && !loading && (
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <p style={{ color: "tomato", marginBottom: 10 }}>{err}</p>
          <button className="buy-button" onClick={fetchExpansions}>
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        // Loader + esqueletos
        <div style={{ marginTop: 30 }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div className="loader" />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
              padding: "0 12px",
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  background: "#2d2e38",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    height: 100,
                    borderRadius: 12,
                    background:
                      "linear-gradient(90deg, #2d2e38 0%, #3a3b47 50%, #2d2e38 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.2s infinite",
                  }}
                />
                <div
                  style={{
                    height: 14,
                    marginTop: 14,
                    width: "70%",
                    borderRadius: 8,
                    background:
                      "linear-gradient(90deg, #2d2e38 0%, #3a3b47 50%, #2d2e38 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.2s infinite",
                  }}
                />
              </div>
            ))}
          </div>

          <style>{`
            @keyframes shimmer {
              0% { background-position: 0% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </div>
      ) : !err && filtered.length === 0 ? (
        // Vacío
        <div style={{ textAlign: "center", marginTop: 40, color: "#ccc" }}>
          <p>No hay expansiones que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        // Grid de expansiones
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            justifyItems: "center",
            marginTop: 30,
            padding: "0 12px 10px",
            overflow: "visible", // 👈 evita recortes en hover
          }}
        >
          {filtered.map((exp) => (
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
