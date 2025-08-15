// components/Account/ProfileTab.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

/**
 * Props opcionales extra:
 * - onGoToAddresses?: () => void
 * - onChangePassword?: () => void
 * - onLogout?: () => void
 */
export default function ProfileTab({
  user,
  address,
  onProfileUpdate,
  onGoToAddresses,
  onChangePassword,
  onLogout,
}) {
  // ---------- Estado base (perfil + dirección) ----------
  const base = useMemo(
    () => ({
      username: user?.username || "",
      name: user?.name || "",
      lastname: user?.lastname || "",
      phone: user?.phone || "",
      address: {
        street: address?.street || "",
        city: address?.city || "",
        state: address?.state || "",
        zip: address?.zip || "",
        country: address?.country || "",
        id: address?.id || null,
      },
    }),
    [user, address]
  );

  const [form, setForm] = useState(base);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // mensajes UI
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});

  // ---------- Meta auth (verificación email / último acceso) ----------
  const [authMeta, setAuthMeta] = useState({
    emailConfirmedAt: null,
    lastSignInAt: null,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user;
      if (mounted && u) {
        setAuthMeta({
          emailConfirmedAt: u.email_confirmed_at ?? null,
          lastSignInAt: u.last_sign_in_at ?? null,
        });
      }
    })();
    return () => (mounted = false);
  }, []);

  // ---------- Summary: pedidos / puntos / cupones ----------
  const [summary, setSummary] = useState({
    totalOrders: 0,
    ordersLast30d: 0,
    points: 0,
    coupons: 0,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user?.id) return;
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: allOrders } = await supabase
          .from("orders")
          .select("id, created_at, total")
          .eq("user_id", user.id);

        const { data: lastOrders } = await supabase
          .from("orders")
          .select("id")
          .eq("user_id", user.id)
          .gte("created_at", thirtyDaysAgo.toISOString());

        // puntos/cupones: ajusta a tu modelo
        const { data: rewards } = await supabase
          .from("rewards")
          .select("points")
          .eq("user_id", user.id)
          .maybeSingle();

        const { data: coupons } = await supabase
          .from("coupons")
          .select("id")
          .eq("user_id", user.id);

        if (mounted) {
          setSummary({
            totalOrders: allOrders?.length || 0,
            ordersLast30d: lastOrders?.length || 0,
            points: rewards?.points || 0,
            coupons: coupons?.length || 0,
            loading: false,
          });
        }
      } catch {
        if (mounted) setSummary((s) => ({ ...s, loading: false }));
      }
    })();
    return () => (mounted = false);
  }, [user?.id]);

  // ---------- Métodos de pago (Stripe) ----------
  const [pmLoading, setPmLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [stripeCustomerId, setStripeCustomerId] = useState(null);
  const [pmStatus, setPmStatus] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user?.id) return;
      try {
        // obtenemos stripe_customer_id de profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("stripe_customer_id")
          .eq("id", user.id)
          .single();

        const customerId = profile?.stripe_customer_id || null;
        if (mounted) setStripeCustomerId(customerId);

        if (!customerId) {
          if (mounted) setPmLoading(false);
          return;
        }

        // Llama a tu backend para listar PaymentMethods
        const res = await fetch(
          `/api/stripe/payment-methods?customerId=${encodeURIComponent(
            customerId
          )}`
        );
        const json = await res.json();
        if (mounted) {
          setPaymentMethods(Array.isArray(json) ? json : []);
          setPmLoading(false);
        }
      } catch {
        if (mounted) setPmLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [user?.id]);

  const detachPM = async (pmId) => {
    if (!pmId) return;
    setPmStatus("Eliminando método...");
    try {
      await fetch(`/api/stripe/payment-methods/${pmId}/detach`, {
        method: "POST",
      });
      setPaymentMethods((prev) => prev.filter((p) => p.id !== pmId));
      setPmStatus("Método eliminado ✅");
      showTempToast();
    } catch {
      setPmStatus("No se pudo eliminar el método ❌");
    } finally {
      setTimeout(() => setPmStatus(""), 1800);
    }
  };

  const setDefaultPM = async (pmId) => {
    if (!pmId || !stripeCustomerId) return;
    setPmStatus("Estableciendo predeterminado...");
    try {
      await fetch(`/api/stripe/customers/${stripeCustomerId}/default-payment-method`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pmId }),
      });
      setPaymentMethods((prev) =>
        prev.map((p) => ({ ...p, is_default: p.id === pmId }))
      );
      setPmStatus("Predeterminado actualizado ✅");
      showTempToast("Predeterminado actualizado");
    } catch {
      setPmStatus("No se pudo actualizar ❌");
    } finally {
      setTimeout(() => setPmStatus(""), 1800);
    }
  };

  // ---------- Re-sincroniza formulario si cambian props ----------
  useEffect(() => setForm(base), [base]);

  // ---------- Validación & cambios ----------
  const isEmpty = (s) => !s || !String(s).trim();
  const validate = (f) => {
    const e = {};
    if (isEmpty(f.username)) e.username = "Username requerido";
    if (isEmpty(f.name)) e.name = "Nombre requerido";
    if (isEmpty(f.lastname)) e.lastname = "Apellido requerido";
    if (f.phone && !/^[\d\s()+-]{7,20}$/.test(f.phone)) e.phone = "Teléfono inválido";
    const touchedAddress =
      f.address.street || f.address.city || f.address.state || f.address.zip || f.address.country;
    if (touchedAddress) {
      if (isEmpty(f.address.street)) e["address.street"] = "Calle requerida";
      if (isEmpty(f.address.city)) e["address.city"] = "Ciudad requerida";
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatus("");
    setErrorMsg("");
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Dirty check
  const isDirtyRef = useRef(false);
  const isDirty =
    form.username !== base.username ||
    form.name !== base.name ||
    form.lastname !== base.lastname ||
    form.phone !== base.phone ||
    form.address.street !== base.address.street ||
    form.address.city !== base.address.city ||
    form.address.state !== base.address.state ||
    form.address.zip !== base.address.zip ||
    form.address.country !== base.address.country;

  useEffect(() => { isDirtyRef.current = isDirty; }, [isDirty]);

  const handleCancel = () => {
    setForm(base);
    setErrors({});
    setStatus("");
    setErrorMsg("");
    setEditing(false);
  };

  const showTempToast = (msg = "Cambios guardados") => {
    setStatus(`✅ ${msg}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2400);
  };

  const handleSave = async () => {
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) {
      setStatus("");
      setErrorMsg("Revisa los campos marcados.");
      return;
    }
    if (!isDirty) {
      setStatus("Sin cambios por guardar");
      return;
    }

    setSaving(true);
    setStatus("Guardando...");
    setErrorMsg("");

    try {
      // Username: validación de unicidad
      if (form.username !== base.username && form.username) {
        const { data: exists } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", form.username)
          .maybeSingle();
        if (exists && exists.id !== user.id) {
          throw new Error("El username ya está en uso");
        }
      }

      // Actualizar perfil
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          username: form.username || null,
          name: form.name,
          lastname: form.lastname,
          phone: form.phone || null,
        })
        .eq("id", user.id);
      if (profileError) throw profileError;

      // Upsert de dirección (si hay datos)
      const hasAnyAddressField =
        form.address.street || form.address.city || form.address.state || form.address.zip || form.address.country;

      if (hasAnyAddressField) {
        const payload = {
          id: form.address.id || undefined,
          user_id: user.id,
          street: form.address.street || null,
          city: form.address.city || null,
          state: form.address.state || null,
          zip: form.address.zip || null,
          country: form.address.country || null,
          is_default: true,
        };
        const { error: addrError } = await supabase
          .from("addresses")
          .upsert(payload, { onConflict: "id" });
        if (addrError) throw addrError;
      }

      await onProfileUpdate?.();
      setSaving(false);
      setEditing(false);
      showTempToast();
    } catch (err) {
      console.error(err);
      setSaving(false);
      setStatus("");
      setErrorMsg(err?.message || "❌ Error al guardar. Intenta de nuevo.");
    }
  };

  // ---------- Verificación email ----------
  const resendVerification = async () => {
    try {
      // Supabase envía de nuevo el correo (ajusta el redirectTo según tu app)
      const { data, error } = await supabase.auth.resend({
        type: "signup",
        email: user?.email,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      showTempToast("Correo de verificación reenviado");
    } catch (e) {
      setErrorMsg("No se pudo reenviar el correo.");
    }
  };

  return (
    <div aria-live="polite">
      <h2 style={{ marginBottom: 20, color: "white" }}>👤 Datos de cuenta</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* -------- Perfil -------- */}
        <div style={infoBox}>
          <h3 style={sectionTitle}>Perfil</h3>
          {editing ? (
            <>
              <LabeledInput
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="tu_alias_unico"
                error={errors.username}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <LabeledInput label="Nombre" name="name" value={form.name} onChange={handleChange} error={errors.name} />
                <LabeledInput label="Apellido" name="lastname" value={form.lastname} onChange={handleChange} error={errors.lastname} />
              </div>
              <LabeledInput
                label="Teléfono"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+52 55 0000 0000"
                error={errors.phone}
              />
            </>
          ) : (
            <div style={{ color: "#ddd", lineHeight: 1.7 }}>
              <p><strong>Username:</strong> {user?.username || "—"}</p>
              <p><strong>Nombre:</strong> {user?.name} {user?.lastname}</p>
              <p>
                <strong>Email:</strong> {user?.email}{" "}
                {authMeta.emailConfirmedAt ? (
                  <span style={pillOk}>Verificado</span>
                ) : (
                  <button onClick={resendVerification} style={pillWarn}>Reenviar verificación</button>
                )}
              </p>
              <p><strong>Teléfono:</strong> {user?.phone || "No registrado"}</p>
              <p><strong>Miembro desde:</strong> {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "-"}</p>
              <p><strong>Último acceso:</strong> {authMeta.lastSignInAt ? new Date(authMeta.lastSignInAt).toLocaleString() : "-"}</p>
            </div>
          )}
        </div>

        {/* -------- Resumen rápido -------- */}
        <div style={infoBox}>
          <h3 style={sectionTitle}>📊 Resumen rápido</h3>
          {summary.loading ? (
            <SkeletonLines lines={3} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, color: "#e7e9ef" }}>
              <Stat label="Pedidos totales" value={summary.totalOrders} />
              <Stat label="Últimos 30 días" value={summary.ordersLast30d} />
              <Stat label="Puntos" value={summary.points} />
              <Stat label="Cupones activos" value={summary.coupons} />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* -------- Dirección principal -------- */}
        <div style={infoBox}>
          <h3 style={sectionTitle}>📦 Dirección principal</h3>
          {editing ? (
            <>
              <LabeledInput label="Calle" name="address.street" value={form.address.street} onChange={handleChange} error={errors["address.street"]} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <LabeledInput label="Ciudad" name="address.city" value={form.address.city} onChange={handleChange} error={errors["address.city"]} />
                <LabeledInput label="Estado" name="address.state" value={form.address.state} onChange={handleChange} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <LabeledInput label="Código Postal" name="address.zip" value={form.address.zip} onChange={handleChange} />
                <LabeledInput label="País" name="address.country" value={form.address.country} onChange={handleChange} />
              </div>
            </>
          ) : address ? (
            <div style={{ color: "#ddd", lineHeight: 1.7 }}>
              <p>{address.street}</p>
              <p>{address.city}{address.state ? `, ${address.state}` : ""}</p>
              <p>{[address.zip, address.country].filter(Boolean).join(", ")}</p>
            </div>
          ) : (
            <p style={{ color: "#bbb" }}>No has registrado dirección.</p>
          )}

          <div style={{ marginTop: 10 }}>
            <button
              className="buy-button"
              onClick={() => (onGoToAddresses ? onGoToAddresses() : alert("Navega al tab de Direcciones"))}
              style={{ background: "#3a3f45" }}
            >
              Gestionar direcciones
            </button>
          </div>
        </div>

        {/* -------- Métodos de pago guardados (Stripe) -------- */}
        <div style={infoBox}>
          <h3 style={sectionTitle}>💳 Métodos de pago guardados</h3>
          {!stripeCustomerId ? (
            <p style={{ color: "#bbb" }}>Aún no tienes un cliente de Stripe asociado.</p>
          ) : pmLoading ? (
            <SkeletonLines lines={3} />
          ) : paymentMethods.length === 0 ? (
            <p style={{ color: "#bbb" }}>No tienes tarjetas guardadas.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
              {paymentMethods.map((pm) => (
                <li
                  key={pm.id}
                  style={{
                    background: "#232730",
                    border: "1px solid #343a45",
                    borderRadius: 10,
                    padding: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    color: "#e9ecf1",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {pm.card?.brand?.toUpperCase?.() || pm.type?.toUpperCase?.() || "CARD"} ···· {pm.card?.last4 || "••••"}
                      {pm.is_default && <span style={pillOk}>Predeterminada</span>}
                    </div>
                    <div style={{ color: "#aab1bd", fontSize: 13 }}>
                      Vence {pm.card?.exp_month?.toString().padStart(2, "0")}/{pm.card?.exp_year}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {!pm.is_default && (
                      <button className="buy-button" style={{ background: "#3a3f45" }} onClick={() => setDefaultPM(pm.id)}>
                        Predeterminar
                      </button>
                    )}
                    <button className="buy-button" style={{ background: "#7a2b2b" }} onClick={() => detachPM(pm.id)}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {pmStatus && <p style={{ marginTop: 8, color: "#cfd2d8" }}>{pmStatus}</p>}
        </div>
      </div>

      {/* -------- Acciones -------- */}
      {editing ? (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={handleSave} className="buy-button" disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button onClick={handleCancel} className="buy-button" style={{ background: "#666" }} disabled={saving}>
            Cancelar
          </button>
          {!isDirty && !saving && <span style={{ alignSelf: "center", color: "#9aa0a6" }}>Sin cambios</span>}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setEditing(true)} className="buy-button">Editar datos</button>
          <button
            onClick={() => (onChangePassword ? onChangePassword() : alert("Lanza tu flujo de cambio de contraseña"))}
            className="buy-button"
            style={{ background: "#3a3f45" }}
          >
            Cambiar contraseña
          </button>
          <button
            onClick={() => (onLogout ? onLogout() : alert("Cierra sesión aquí"))}
            className="buy-button"
            style={{ background: "#7a2b2b" }}
          >
            Cerrar sesión
          </button>
        </div>
      )}

      {/* Mensajes */}
      {(status || errorMsg) && (
        <p style={{ marginTop: 14, color: errorMsg ? "#ff6b6b" : "#8fff8f" }}>
          {errorMsg || status}
        </p>
      )}

      {/* Toast */}
      {showToast && (
        <div style={toastStyle}>
          {status || "Cambios guardados"}
        </div>
      )}
    </div>
  );
}

/* ---------- Subcomponentes & estilos ---------- */

function LabeledInput({ label, error, ...rest }) {
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <span style={{ display: "block", color: "#ccc", marginBottom: 6, fontSize: 13 }}>
        {label}
      </span>
      <input
        {...rest}
        style={{
          ...inputStyle,
          borderColor: error ? "#ff6b6b" : "#444",
        }}
        aria-invalid={!!error}
        aria-describedby={error ? `${rest.name}-err` : undefined}
      />
      {error && (
        <span id={`${rest.name}-err`} style={{ color: "#ff6b6b", fontSize: 12 }}>
          {error}
        </span>
      )}
    </label>
  );
}

function SkeletonLines({ lines = 3 }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 14,
            borderRadius: 6,
            background:
              "linear-gradient(90deg, #22262e 25%, #2a2f38 37%, #22262e 63%)",
            backgroundSize: "400% 100%",
            animation: "shine 1.1s ease-in-out infinite",
          }}
        />
      ))}
      <style>{`
        @keyframes shine {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        background: "#232730",
        border: "1px solid #343a45",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div style={{ color: "#aab1bd", fontSize: 12, marginBottom: 6 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 20 }}>{value}</div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#1e1f26",
  color: "white",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "Orbitron, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
};

const infoBox = {
  backgroundColor: "#1e1f26",
  borderRadius: "12px",
  padding: "20px",
  minWidth: "280px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
};

const sectionTitle = {
  marginBottom: "16px",
  color: "#ff3881",
  fontSize: "18px",
};

const pillOk = {
  marginLeft: 10,
  background: "#294a33",
  color: "#8fff8f",
  border: "1px solid #3e6b4d",
  padding: "2px 8px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};

const pillWarn = {
  marginLeft: 10,
  background: "transparent",
  color: "#ff9bbd",
  border: "1px solid #ff3881",
  padding: "2px 8px",
  borderRadius: 999,
  fontSize: 12,
  cursor: "pointer",
};

const toastStyle = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  backgroundColor: "#2d2e38",
  color: "#e9ecf1",
  padding: "14px 20px",
  borderRadius: "12px",
  fontWeight: "bold",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  zIndex: 9999,
  animation: "fadeInToast 0.25s ease-out",
  border: "1px solid #3a3f45",
};

