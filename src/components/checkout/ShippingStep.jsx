// src/components/checkout/ShippingStep.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ShippingStep({ user, onNext, setShippingAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user?.id);

      if (data?.length > 0) {
        setAddresses(data);
        const defaultAddr = data.find((a) => a.is_default);
        if (defaultAddr) setSelectedId(defaultAddr.id);
      }

      setLoading(false);
    };

    if (user?.id) fetchAddresses();
  }, [user]);

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveNewAddress = async () => {
    const newAddress = {
      ...form,
      user_id: user.id,
      is_default: addresses.length === 0, // primera dirección es predeterminada
    };

    const { data, error } = await supabase.from("addresses").insert([newAddress]).select().single();
    if (!error && data) {
      setAddresses([...addresses, data]);
      setSelectedId(data.id);
      setForm({ street: "", city: "", state: "", zip: "", country: "" });
      setAddingNew(false);
    }
  };

  const handleUseSelected = () => {
    const selected = addresses.find((a) => a.id === selectedId);
    if (!selected) return alert("Selecciona una dirección válida.");
    setShippingAddress(selected);
    onNext();
  };

  if (loading) return <p style={{ color: "white" }}>Cargando direcciones...</p>;

  return (
    <div style={{ color: "white", maxWidth: "700px", margin: "0 auto", padding: "30px" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "24px" }}>Selecciona una dirección de envío</h2>

      {/* Lista de direcciones */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "30px" }}>
        {addresses.map((addr) => (
          <label key={addr.id} style={{
            backgroundColor: selectedId === addr.id ? "#2d2e38" : "#1e1f26",
            padding: "16px",
            borderRadius: "12px",
            border: selectedId === addr.id ? "2px solid #ff3881" : "1px solid #555",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}>
            <input
              type="radio"
              name="selectedAddress"
              checked={selectedId === addr.id}
              onChange={() => setSelectedId(addr.id)}
              style={{ marginRight: "12px" }}
            />
            <strong>{addr.street}</strong><br />
            {addr.city}, {addr.state} – {addr.zip}, {addr.country}
          </label>
        ))}
      </div>

      {/* Botón para continuar */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button className="buy-button" onClick={handleUseSelected}>
          Usar esta dirección
        </button>

        <button
          className="buy-button"
          onClick={() => setAddingNew((prev) => !prev)}
          style={{ backgroundColor: "#444", color: "#fff" }}
        >
          {addingNew ? "Cancelar" : "Agregar nueva dirección"}
        </button>
      </div>

      {/* Formulario para nueva dirección */}
      {addingNew && (
        <div style={{
          marginTop: "30px",
          background: "#2a2f34",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <h3 style={{ marginBottom: "10px" }}>Nueva dirección</h3>

          <input name="street" placeholder="Calle" value={form.street} onChange={handleInputChange} style={inputStyle} />
          <input name="city" placeholder="Ciudad" value={form.city} onChange={handleInputChange} style={inputStyle} />
          <input name="state" placeholder="Estado" value={form.state} onChange={handleInputChange} style={inputStyle} />
          <input name="zip" placeholder="Código Postal" value={form.zip} onChange={handleInputChange} style={inputStyle} />
          <input name="country" placeholder="País" value={form.country} onChange={handleInputChange} style={inputStyle} />

          <button className="buy-button" onClick={saveNewAddress}>
            Guardar dirección
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #555",
  backgroundColor: "#1e1f26",
  color: "white",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box"
};
