// src/components/checkout/ShippingStep.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ShippingStep({ user, onNext, setShippingAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Alta de nueva dirección
  const [addingNew, setAddingNew] = useState(false);
  const streetRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "México",
    is_default: false,
  });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  // Cargar direcciones
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        setMsg("No se pudieron cargar tus direcciones.");
        setAddresses([]);
      } else {
        setAddresses(data || []);
        const def = data?.find((a) => a.is_default) || data?.[0];
        if (def) setSelectedId(def.id);
      }
      setLoading(false);
    };
    fetchAddresses();
  }, [user]);

  // Si no hay direcciones, abrimos el formulario directamente
  useEffect(() => {
    if (!loading && addresses.length === 0) {
      setAddingNew(true);
      setTimeout(() => streetRef.current?.focus(), 50);
    }
  }, [loading, addresses.length]);

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedId) || null,
    [addresses, selectedId]
  );

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = (v) => {
    const err = {};
    if (!v.street?.trim()) err.street = "Calle requerida";
    if (!v.city?.trim()) err.city = "Ciudad requerida";
    if (!v.state?.trim()) err.state = "Estado requerido";
    if (!v.zip?.trim()) err.zip = "Código Postal requerido";
    if (!v.country?.trim()) err.country = "País requerido";
    return err;
  };

  const saveNewAddress = async (e) => {
    e?.preventDefault?.();
    setErrors({});
    setMsg("");

    const v = validate(form);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    setSaving(true);
    const payload = {
      user_id: user.id,
      label: form.label,
      street: form.street,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: form.country,
      is_default: addresses.length === 0 ? true : !!form.is_default,
    };

    const { data, error } = await supabase
      .from("addresses")
      .insert(payload)
      .select()
      .single();

    setSaving(false);

    if (error) {
      setMsg("No se pudo guardar la dirección.");
      return;
    }

    // Si se marcó como default, quita default del resto
    if (payload.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .neq("id", data.id);
    }

    // Refrescar lista local
    const next = [data, ...addresses.filter((a) => a.id !== data.id)];
    // Ordenar: default primero
    next.sort((a, b) => (a.is_default === b.is_default ? 0 : a.is_default ? -1 : 1));
    setAddresses(next);
    setSelectedId(data.id);
    setForm({
      label: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "México",
      is_default: false,
    });
    setAddingNew(false);
    setMsg("✅ Dirección guardada.");
  };

  const handleUseSelected = () => {
    if (!selectedAddress) {
      setMsg("Selecciona una dirección válida.");
      return;
    }
    setShippingAddress(selectedAddress);
    onNext?.();
  };

  if (loading) {
    return (
      <div style={{ color: "white", maxWidth: 760, margin: "0 auto", padding: 30 }}>
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Selecciona una dirección de envío</h2>
        <SkeletonList />
      </div>
    );
  }

  return (
    <div style={{ color: "white", maxWidth: 760, margin: "0 auto", padding: 30 }}>
      <h2 style={{ fontSize: 24, marginBottom: 8 }}>Selecciona una dirección de envío</h2>
      <p style={{ color: "#9aa0aa", marginTop: 0, marginBottom: 24 }}>
        Enviamos dentro de México. Revisa tu dirección antes de continuar.
      </p>

      {msg && (
        <div
          style={{
            background: "#2a2f34",
            border: "1px solid #3a3f45",
            color: msg.startsWith("✅") ? "#8fff8f" : "white",
            padding: "10px 12px",
            borderRadius: 10,
            marginBottom: 16,
          }}
        >
          {msg}
        </div>
      )}

      {/* Lista de direcciones */}
      {addresses.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
          {addresses.map((addr) => (
            <label
              key={addr.id}
              style={{
                backgroundColor: selectedId === addr.id ? "#2d2e38" : "#1e1f26",
                padding: 14,
                borderRadius: 12,
                border: selectedId === addr.id ? "2px solid #ff3881" : "1px solid #3a3f45",
                cursor: "pointer",
                transition: "all .2s ease",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <input
                type="radio"
                name="selectedAddress"
                checked={selectedId === addr.id}
                onChange={() => setSelectedId(addr.id)}
                style={{ marginTop: 3 }}
                aria-label="Seleccionar esta dirección"
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <strong>Dirección</strong>
                  {addr.is_default && (
                    <span
                      style={{
                        background: "#28a745",
                        color: "white",
                        borderRadius: 8,
                        padding: "2px 8px",
                        fontSize: 12,
                      }}
                    >
                      Predeterminada
                    </span>
                  )}
                </div>
                <div style={{ color: "#ccc", marginTop: 4, lineHeight: 1.6 }}>
                  {addr.label ? <strong style={{ color: "#eee" }}>{addr.label}</strong> : null}
                  {addr.label ? " · " : ""}
                  {addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                </div>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Acciones */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
        <button
          className="buy-button"
          onClick={handleUseSelected}
          disabled={!selectedAddress}
          style={{ opacity: selectedAddress ? 1 : 0.6, minWidth: 180 }}
        >
          Usar esta dirección
        </button>

        <button
          className="buy-button"
          onClick={() => {
            setAddingNew((p) => !p);
            setErrors({});
            setMsg("");
            setTimeout(() => streetRef.current?.focus(), 50);
          }}
          style={{ backgroundColor: "#3a3f45", minWidth: 200 }}
        >
          {addingNew ? "Cancelar" : "Agregar nueva dirección"}
        </button>
      </div>

      {/* Formulario para nueva dirección */}
      {addingNew && (
        <form
          onSubmit={saveNewAddress}
          style={{
            marginTop: 18,
            background: "#2a2f34",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #3a3f45",
            display: "grid",
            gap: 12,
          }}
        >
          <h3 style={{ margin: 0, marginBottom: 4 }}>Nueva dirección</h3>
          <Grid two>
            <Field
              name="label"
              label="Etiqueta (Casa, Oficina, etc.)"
              value={form.label}
              onChange={handleInput}
              autoComplete="shipping address-line2"
            />
            <Field
              name="street"
              label="Calle"
              value={form.street}
              onChange={handleInput}
              error={errors.street}
              inputRef={streetRef}
              autoComplete="shipping address-line1"
            />
            <Field
              name="city"
              label="Ciudad"
              value={form.city}
              onChange={handleInput}
              error={errors.city}
              autoComplete="shipping address-level2"
            />
            <Field
              name="state"
              label="Estado"
              value={form.state}
              onChange={handleInput}
              error={errors.state}
              autoComplete="shipping address-level1"
            />
            <Field
              name="zip"
              label="Código Postal"
              value={form.zip}
              onChange={handleInput}
              error={errors.zip}
              inputMode="numeric"
              maxLength={5}
              pattern="[0-9]*"
              autoComplete="shipping postal-code"
            />
            <Select
              name="country"
              label="País"
              value={form.country}
              onChange={handleInput}
              options={["México", "Estados Unidos", "Canadá", "Otro"]}
              error={errors.country}
            />
          </Grid>

          <label style={{ display: "flex", gap: 8, alignItems: "center", color: "#ccc" }}>
            <input
              type="checkbox"
              name="is_default"
              checked={form.is_default}
              onChange={handleInput}
            />
            Usar como dirección predeterminada
          </label>

          <button
            type="submit"
            className="buy-button"
            disabled={saving}
            style={{ marginTop: 6, minWidth: 180, opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Guardando..." : "Guardar dirección"}
          </button>
        </form>
      )}
    </div>
  );
}

/* ---------- UI helpers ---------- */

function Field({
  name,
  label,
  value,
  onChange,
  error,
  inputRef,
  inputMode,
  maxLength,
  pattern,
  autoComplete,
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", color: "#ccc", marginBottom: 6, fontSize: 13 }}>
        {label}
      </span>
      <input
        ref={inputRef}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        inputMode={inputMode}
        maxLength={maxLength}
        pattern={pattern}
        autoComplete={autoComplete}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: `1px solid ${error ? "#ff6b6b" : "#3b414c"}`,
          background: "#1e1f26",
          color: "white",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
        }}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
      />
      {error && (
        <span id={`${name}-err`} style={{ color: "#ff6b6b", fontSize: 12 }}>
          {error}
        </span>
      )}
    </label>
  );
}

function Select({ name, label, value, onChange, options, error }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", color: "#ccc", marginBottom: 6, fontSize: 13 }}>
        {label}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        autoComplete="shipping country"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: `1px solid ${error ? "#ff6b6b" : "#3b414c"}`,
          background: "#1e1f26",
          color: "white",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          appearance: "none",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ color: "#ff6b6b", fontSize: 12 }}>{error}</span>
      )}
    </label>
  );
}

function Grid({ two, children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: two ? "1fr 1fr" : "1fr",
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}

function SkeletonList() {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: 70,
            borderRadius: 12,
            background:
              "linear-gradient(90deg,#2d2e38 0%,#3a3b47 50%,#2d2e38 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.2s infinite",
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
