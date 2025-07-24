// components/Account/ProfileTab.jsx
import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProfileTab({ user, address, onProfileUpdate }) {
  const [form, setForm] = useState({
    name: user.name || "",
    lastname: user.lastname || "",
    phone: user.phone || "",
    address: {
      street: address?.street || "",
      city: address?.city || "",
      state: address?.state || "",
      zip: address?.zip || "",
      country: address?.country || "",
    },
  });

  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setStatus("Guardando...");

    // Actualizar perfil
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        name: form.name,
        lastname: form.lastname,
        phone: form.phone,
      })
      .eq("id", user.id);

    // Actualizar dirección principal
    let addressError = null;

    if (address) {
      // UPDATE dirección existente
      const { error } = await supabase
        .from("addresses")
        .update({
          street: form.address.street,
          city: form.address.city,
          state: form.address.state,
          zip: form.address.zip,
          country: form.address.country,
        })
        .eq("id", address.id);
      addressError = error;
    } else {
      // INSERT nueva dirección como default
      const { error } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          street: form.address.street,
          city: form.address.city,
          state: form.address.state,
          zip: form.address.zip,
          country: form.address.country,
          is_default: true,
        });
      addressError = error;
    }

    if (profileError || addressError) {
      setStatus("❌ Error al guardar");
    } else {
      onProfileUpdate?.();
      setStatus("✅ Cambios guardados");
      setEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>👤 Datos de cuenta</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
        {/* Información personal */}
        <div style={infoBox}>
          <h3 style={sectionTitle}>Información personal</h3>
          {editing ? (
            <>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" style={inputStyle} />
              <input name="lastname" value={form.lastname} onChange={handleChange} placeholder="Apellido" style={inputStyle} />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Teléfono" style={inputStyle} />
            </>
          ) : (
            <>
              <p><strong>Nombre:</strong> {user.name} {user.lastname}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Teléfono:</strong> {user.phone || "No registrado"}</p>
              <p><strong>Miembro desde:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            </>
          )}
        </div>

        {/* Dirección */}
        <div style={infoBox}>
          <h3 style={sectionTitle}>📦 Dirección principal</h3>
          {editing ? (
            <>
              <input name="address.street" value={form.address.street} onChange={handleChange} placeholder="Calle" style={inputStyle} />
              <input name="address.city" value={form.address.city} onChange={handleChange} placeholder="Ciudad" style={inputStyle} />
              <input name="address.state" value={form.address.state} onChange={handleChange} placeholder="Estado" style={inputStyle} />
              <input name="address.zip" value={form.address.zip} onChange={handleChange} placeholder="Código Postal" style={inputStyle} />
              <input name="address.country" value={form.address.country} onChange={handleChange} placeholder="País" style={inputStyle} />
            </>
          ) : address ? (
            <>
              <p>{address.street}</p>
              <p>{address.city}, {address.state}</p>
              <p>{address.zip}, {address.country}</p>
            </>
          ) : (
            <p>No has registrado dirección.</p>
          )}
        </div>
      </div>

      {editing ? (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleSave} className="buy-button">Guardar</button>
          <button onClick={() => setEditing(false)} className="buy-button" style={{ background: "#666" }}>
            Cancelar
          </button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="buy-button" style={{ marginTop: "10px" }}>
          Editar datos
        </button>
      )}

      {status && <p style={{ color: "#8fff8f", marginTop: "16px" }}>{status}</p>}

      {/* Toast */}
      {showToast && (
        <div style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#2d2e38",
          color: "#8fff8f",
          padding: "14px 20px",
          borderRadius: "12px",
          fontWeight: "bold",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          zIndex: 9999,
          animation: "fadeInToast 0.3s ease-out"
        }}>
          ✅ Cambios guardados
        </div>
      )}

      <style>{`
        @keyframes fadeInToast {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Estilos
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#1e1f26",
  color: "white",
  fontSize: "14px",
  marginBottom: "10px"
};

const infoBox = {
  backgroundColor: "#1e1f26",
  borderRadius: "10px",
  padding: "20px",
  flex: "1 1 300px",
  minWidth: "300px",
  boxShadow: "0 0 8px rgba(0,0,0,0.3)"
};

const sectionTitle = {
  marginBottom: "16px",
  color: "#ff3881",
  fontSize: "18px"
};
