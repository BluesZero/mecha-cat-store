
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AddressesTab({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setAddresses(data || []);
    setLoading(false);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("addresses").insert({
      ...form,
      user_id: userId,
      is_default: addresses.length === 0,
    });
    if (!error) {
      setForm({ label: "", street: "", city: "", state: "", zip: "", country: "" });
      fetchAddresses();
    }
  };

  const setAsDefault = async (id) => {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    fetchAddresses();
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>🏠 Mis direcciones</h2>

      {loading ? <p>Cargando...</p> : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {addresses.map((addr) => (
            <li key={addr.id} style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#1e1f26", borderRadius: "10px" }}>
              <p><strong>{addr.label}</strong> {addr.is_default && "(Predeterminada)"}</p>
              <p style={{ color: "#ccc", margin: 0 }}>{addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}</p>
              {!addr.is_default && (
                <button
                  onClick={() => setAsDefault(addr.id)}
                  style={{ marginTop: "8px", background: "#ff3881", color: "white", padding: "6px 10px", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Marcar como predeterminada
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddAddress} style={{ marginTop: "30px" }}>
        <h3>Agregar nueva dirección</h3>
        {["label", "street", "city", "state", "zip", "country"].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleInput}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            style={{
              display: "block",
              marginBottom: "10px",
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#1e1f26",
              color: "white"
            }}
          />
        ))}
        <button
          type="submit"
          style={{
            marginTop: "10px",
            background: "#28a745",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Guardar dirección
        </button>
      </form>
    </div>
  );
}
