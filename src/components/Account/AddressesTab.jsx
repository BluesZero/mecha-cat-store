// src/components/Account/AddressesTab.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useToast } from "../ui/useToast";

export default function AddressesTab({ userId }) {
  const { addToast } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [savingNew, setSavingNew] = useState(false);

  // Estados por fila
  const [defaultLoadingId, setDefaultLoadingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [savingEditId, setSavingEditId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Modal de confirmación para eliminar
  const [confirmDlg, setConfirmDlg] = useState({ open: false, addr: null });

  // Form de alta
  const labelRef = useRef(null);
  const [form, setForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "México",
  });

  // Form de edición
  const [editForm, setEditForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "México",
  });

  const hasAny = addresses.length > 0;

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setErr("");
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) setErr("No se pudieron cargar tus direcciones.");
    else setAddresses(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Realtime (opcional, refresca lista si cambia desde otro lado)
  useEffect(() => {
    const ch = supabase
      .channel("addresses-user")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "addresses", filter: `user_id=eq.${userId}` },
        fetchAddresses
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [userId, fetchAddresses]);

  const handleInput = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) setEditForm((prev) => ({ ...prev, [name]: value }));
    else setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (obj) => {
    const errors = {};
    if (!obj.street?.trim()) errors.street = "Calle requerida";
    if (!obj.city?.trim()) errors.city = "Ciudad requerida";
    if (!obj.state?.trim()) errors.state = "Estado requerido";
    if (!obj.zip?.trim()) errors.zip = "Código Postal requerido";
    if (!obj.country?.trim()) errors.country = "País requerido";
    return errors;
  };

  const [newErrors, setNewErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setNewErrors({});
    const v = validate(form);
    if (Object.keys(v).length) {
      setNewErrors(v);
      return;
    }

    setSavingNew(true);
    const payload = {
      ...form,
      user_id: userId,
      is_default: addresses.length === 0,
    };

    const { error } = await supabase.from("addresses").insert(payload);
    setSavingNew(false);

    if (error) {
      addToast({ type: "error", icon: "⚠️", title: "Error", description: "No se pudo guardar la dirección." });
      return;
    }

    // Limpia y focus al primer campo
    setForm({ label: "", street: "", city: "", state: "", zip: "", country: "México" });
    setNewErrors({});
    labelRef.current?.focus();
    addToast({ type: "success", icon: "🏠", title: "Dirección guardada" });
  };

  const startEdit = (addr) => {
    setEditingId(addr.id);
    setEditErrors({});
    setEditForm({
      label: addr.label || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      zip: addr.zip || "",
      country: addr.country || "México",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditErrors({});
  };

  const saveEdit = async (id) => {
    setEditErrors({});
    const v = validate(editForm);
    if (Object.keys(v).length) {
      setEditErrors(v);
      return;
    }
    setSavingEditId(id);
    const { error } = await supabase.from("addresses").update({ ...editForm }).eq("id", id);
    setSavingEditId(null);

    if (error) {
      addToast({ type: "error", icon: "⚠️", title: "Error", description: "No se pudo actualizar." });
      return;
    }
    setEditingId(null);
    addToast({ type: "success", icon: "✅", title: "Dirección actualizada" });
  };

  const setAsDefault = async (id) => {
    setDefaultLoadingId(id);
    const { error: e1 } = await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    const { error: e2 } = await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    setDefaultLoadingId(null);

    if (e1 || e2) {
      addToast({ type: "error", icon: "⚠️", title: "Error", description: "No se pudo actualizar la dirección predeterminada." });
      return;
    }
    addToast({ type: "success", icon: "⭐", title: "Predeterminada actualizada" });
  };

  // Abrir modal
  const askDelete = (addr) => setConfirmDlg({ open: true, addr });
  // Eliminar
  const deleteAddress = async (id, isDefault) => {
    setDeletingId(id);
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    setDeletingId(null);

    if (error) {
      addToast({ type: "error", icon: "⚠️", title: "Error", description: "No se pudo eliminar." });
      return;
    }

    if (isDefault) {
      const remaining = addresses.filter((a) => a.id !== id);
      if (remaining.length > 0) {
        const mostRecent = remaining[0];
        await supabase.from("addresses").update({ is_default: true }).eq("id", mostRecent.id);
      }
    }
    addToast({ type: "success", icon: "🗑️", title: "Dirección eliminada" });
  };

  const AddressCard = ({ addr, onlyOne }) => {
    const isEditing = editingId === addr.id;
    const rowBusy =
      defaultLoadingId === addr.id || savingEditId === addr.id || deletingId === addr.id;

    if (isEditing) {
      const disabled = savingEditId === addr.id;
      return (
        <li style={cardStyle} aria-busy={disabled}>
          <div style={headerRow}>
            <h4 style={cardTitle}>
              Dirección <span style={mutedLabel}>/ edición</span>
            </h4>
          </div>

          <Grid two>
            <Field name="label" label={labels.label} value={editForm.label} onChange={(e) => handleInput(e, true)} error={editErrors.label} disabled={disabled} autoComplete="shipping address-line2" />
            <Field name="street" label={labels.street} value={editForm.street} onChange={(e) => handleInput(e, true)} error={editErrors.street} disabled={disabled} autoComplete="shipping address-line1" />
            <Field name="city" label={labels.city} value={editForm.city} onChange={(e) => handleInput(e, true)} error={editErrors.city} disabled={disabled} autoComplete="shipping address-level2" />
            <Field name="state" label={labels.state} value={editForm.state} onChange={(e) => handleInput(e, true)} error={editErrors.state} disabled={disabled} autoComplete="shipping address-level1" />
            <Field name="zip" label={labels.zip} value={editForm.zip} onChange={(e) => handleInput(e, true)} error={editErrors.zip} disabled={disabled} autoComplete="shipping postal-code" inputMode="numeric" maxLength={5} pattern="[0-9]*" />
            <CountrySelect value={editForm.country} onChange={(e) => handleInput(e, true)} disabled={disabled} error={editErrors.country} />
          </Grid>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              onClick={() => saveEdit(addr.id)}
              disabled={disabled}
              style={{ ...btnPrimary, minWidth: 140, opacity: disabled ? 0.7 : 1 }}
              className="buy-button"
            >
              {disabled ? "Guardando..." : "Guardar cambios"}
            </button>
            <button onClick={cancelEdit} disabled={disabled} style={{ ...btnGhost, minWidth: 120 }}>
              Cancelar
            </button>
          </div>
        </li>
      );
    }

    const cardBoxStyle = addr.is_default
      ? { ...cardStyle, boxShadow: "0 0 0 2px rgba(40,167,69,.35)" }
      : cardStyle;

    return (
      <li style={cardBoxStyle} aria-busy={rowBusy}>
        {/* Cabecera */}
        <div style={headerRow}>
          <h4 style={cardTitle}>
            Dirección{" "}
            {addr.is_default && <span style={badgeDefault}>Predeterminada</span>}
          </h4>

          <div style={actionsRow}>
            {!addr.is_default && (
              <button
                onClick={() => setAsDefault(addr.id)}
                disabled={defaultLoadingId === addr.id}
                style={{ ...btnGhost, minWidth: 140 }}
                title="Usar como predeterminada"
              >
                {defaultLoadingId === addr.id ? "Aplicando..." : "Predeterminada"}
              </button>
            )}
            <button
              onClick={() => startEdit(addr)}
              disabled={rowBusy}
              style={{ ...btnGhost, minWidth: 110 }}
              title="Editar dirección"
            >
              Editar
            </button>
            <button
              onClick={() => askDelete(addr)}
              disabled={deletingId === addr.id || onlyOne}
              title={onlyOne ? "Debes tener al menos una dirección" : "Eliminar dirección"}
              style={{ ...btnDanger, minWidth: 110, opacity: deletingId === addr.id ? 0.7 : 1 }}
            >
              {deletingId === addr.id ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>

        {/* Contenido */}
        <p style={{ margin: "6px 0 0", color: "#ccc", lineHeight: 1.6 }}>
          <strong style={{ color: "#eee" }}>{addr.label || "—"}</strong> ·{" "}
          {addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
        </p>
      </li>
    );
  };

  const opBusy = Boolean(defaultLoadingId || savingEditId || deletingId);

  return (
    <div aria-live="polite">
      <h2 style={{ marginBottom: 20, color: "white" }}>🏠 Mis direcciones</h2>

      {loading ? (
        <SkeletonList />
      ) : err ? (
        <div style={errorBox}>
          {err}{" "}
          <button onClick={fetchAddresses} style={retryBtn}>
            Reintentar
          </button>
        </div>
      ) : !hasAny ? (
        <p style={{ color: "#bbb" }}>Aún no has agregado direcciones.</p>
      ) : (
        <ul
          style={{ listStyle: "none", paddingLeft: 0, margin: 0, marginBottom: 20 }}
          aria-busy={opBusy}
        >
          {addresses.map((addr) => (
            <AddressCard key={addr.id} addr={addr} onlyOne={addresses.length === 1} />
          ))}
        </ul>
      )}

      {/* Alta de nueva dirección */}
      <form onSubmit={handleAddAddress} style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 12, color: "white" }}>Agregar nueva dirección</h3>
        <Grid two>
          <Field name="label" label={labels.label} value={form.label} onChange={handleInput} error={newErrors.label} inputRef={labelRef} autoComplete="shipping address-line2" />
          <Field name="street" label={labels.street} value={form.street} onChange={handleInput} error={newErrors.street} autoComplete="shipping address-line1" />
          <Field name="city" label={labels.city} value={form.city} onChange={handleInput} error={newErrors.city} autoComplete="shipping address-level2" />
          <Field name="state" label={labels.state} value={form.state} onChange={handleInput} error={newErrors.state} autoComplete="shipping address-level1" />
          <Field name="zip" label={labels.zip} value={form.zip} onChange={handleInput} error={newErrors.zip} autoComplete="shipping postal-code" inputMode="numeric" maxLength={5} pattern="[0-9]*" />
          <CountrySelect value={form.country} onChange={handleInput} error={newErrors.country} />
        </Grid>
        <button
          type="submit"
          className="buy-button"
          disabled={savingNew}
          style={{ marginTop: 12, opacity: savingNew ? 0.7 : 1, minWidth: 180 }}
        >
          {savingNew ? "Guardando..." : "Guardar dirección"}
        </button>
      </form>

      {/* Modal de confirmación */}
      {confirmDlg.open && (
        <ConfirmDialog
          message={`¿Eliminar la dirección "${confirmDlg.addr?.label || ""}"?`}
          onCancel={() => setConfirmDlg({ open: false, addr: null })}
          onConfirm={async () => {
            const a = confirmDlg.addr;
            setConfirmDlg({ open: false, addr: null });
            if (a) await deleteAddress(a.id, a.is_default);
          }}
        />
      )}
    </div>
  );
}

/* ---------- Subcomponentes UI ---------- */

function Field({
  name,
  label,
  value,
  onChange,
  error,
  disabled,
  inputRef,
  autoComplete,
  inputMode,
  maxLength,
  pattern,
}) {
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <span style={{ display: "block", color: "#ccc", marginBottom: 6, fontSize: 13 }}>
        {label}
      </span>
      <input
        ref={inputRef}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        pattern={pattern}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          border: `1px solid ${error ? "#ff6b6b" : "#3b414c"}`,
          background: disabled ? "#21242b" : "#1e1f26",
          color: "white",
          fontSize: "14px",
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

function CountrySelect({ value, onChange, disabled, error }) {
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <span style={{ display: "block", color: "#ccc", marginBottom: 6, fontSize: 13 }}>
        {labels.country}
      </span>
      <select
        name="country"
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete="shipping country"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          border: `1px solid ${error ? "#ff6b6b" : "#3b414c"}`,
          background: disabled ? "#21242b" : "#1e1f26",
          color: "white",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
          appearance: "none",
        }}
        aria-invalid={!!error}
        aria-describedby={error ? "country-err" : undefined}
      >
        <option value="México">México</option>
        <option value="Estados Unidos">Estados Unidos</option>
        <option value="Canadá">Canadá</option>
        <option value="Otro">Otro</option>
      </select>
      {error && (
        <span id="country-err" style={{ color: "#ff6b6b", fontSize: 12 }}>
          {error}
        </span>
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
    <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} style={cardStyle}>
          <div style={{ height: 16, width: "30%", ...sk() }} />
          <div style={{ height: 10, width: "90%", marginTop: 10, ...sk() }} />
          <div style={{ height: 10, width: "65%", marginTop: 8, ...sk() }} />
        </li>
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </ul>
  );
}

function ConfirmDialog({ message, onCancel, onConfirm }) {
  return (
    <div style={modalBackdrop}>
      <div style={modalCard} role="dialog" aria-modal="true" aria-label="Confirmar acción">
        <p style={{ marginTop: 0, color: "white" }}>{message}</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
          <button onClick={onCancel} style={{ ...btnGhost, minWidth: 110 }}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={{ ...btnDanger, minWidth: 110 }}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Estilos reusables ---------- */
const cardStyle = {
  marginBottom: 16,
  padding: 16,
  backgroundColor: "#1e1f26",
  borderRadius: 12,
  border: "1px solid #333",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
};

const actionsRow = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const cardTitle = { margin: 0, fontWeight: 700, color: "white", letterSpacing: ".2px" };
const mutedLabel = { fontSize: 12, color: "#a8adb7" };

const badgeDefault = {
  marginLeft: 8,
  background: "#28a745",
  color: "white",
  padding: "2px 8px",
  fontSize: 12,
  borderRadius: 8,
};

const btnGhost = {
  background: "#353a43",
  border: "1px solid #4a4f57",
  color: "white",
  padding: "8px 12px",
  borderRadius: 12,
  cursor: "pointer",
  transition: "all .15s ease",
};

const btnDanger = {
  background: "#3b2426",
  border: "1px solid #dc3545",
  color: "#ffb3bd",
  padding: "8px 12px",
  borderRadius: 12,
  cursor: "pointer",
  transition: "all .15s ease",
};

const btnPrimary = {
  // este usa tu clase .buy-button para color; aquí solo por fallback
  background: "#ff3881",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: 20,
  cursor: "pointer",
};

const errorBox = {
  background: "#3a3f45",
  color: "#ffe1e1",
  padding: "10px 12px",
  borderRadius: 10,
  marginBottom: 16,
  fontSize: 14,
};

const retryBtn = {
  background: "transparent",
  border: "none",
  color: "#8fff8f",
  cursor: "pointer",
  fontWeight: 700,
  marginLeft: 6,
};

const sk = () => ({
  borderRadius: 8,
  background: "linear-gradient(90deg, #2d2e38 0%, #3a3b47 50%, #2d2e38 100%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.2s infinite",
});

const modalBackdrop = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "grid",
  placeItems: "center",
  zIndex: 9999,
};

const modalCard = {
  background: "#292d33",
  border: "1px solid #3a3f45",
  borderRadius: 12,
  padding: 16,
  width: "min(480px, 92vw)",
  boxShadow: "0 10px 30px rgba(0,0,0,.45)",
};

/* ---------- Etiquetas de campos ---------- */
const labels = {
  label: "Etiqueta (Casa, Oficina, etc.)",
  street: "Calle",
  city: "Ciudad",
  state: "Estado",
  zip: "Código Postal",
  country: "País",
};
