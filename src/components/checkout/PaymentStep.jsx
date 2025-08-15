// src/components/checkout/PaymentStep.jsx
import React, { useMemo, useState } from "react";
import StripeCheckoutForm from "./StripeCheckoutForm";

export default function PaymentStep({ cart = [], user, orderId, onSuccess }) {
  const fmt = useMemo(
    () => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }),
    []
  );

  const subtotal = useMemo(
    () => cart.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0),
    [cart]
  );
  const shipping = 0;
  const fees = 0;
  const total = Math.max(0, subtotal + shipping + fees);

  const [showSummary, setShowSummary] = useState(false);

  if (!cart?.length) {
    return (
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
        <h2 style={{ fontSize: "1.6rem", marginBottom: 12 }}>Confirmar tu pago</h2>
        <div style={{ background: "#2d2e38", border: "1px solid #3a3f45", borderRadius: 12, padding: 16 }}>
          Tu carrito está vacío.
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Paso de pago" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
      {/* Encabezado */}
      <header style={{ marginBottom: 18, backgroundColor: "#1e1f26"}}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "1.9rem", margin: 0 }}>Confirmar tu pago</h2>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, background: "#2a2f34", border: "1px solid #3a3f45", color: "#cfd2d8", borderRadius: 999, padding: "6px 10px" }}>
            <span role="img" aria-label="seguro">🔒</span> Proceso seguro con Stripe
          </span>
        </div>
        <p style={{ color: "#9aa0aa", margin: "8px 0 0" }}>
          Revisa el resumen y elige tu método de pago. No almacenamos tu información bancaria.
        </p>
      </header>

      {/* Layout 2 columnas */}
      <div className="pay-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24 }}>
        {/* Izquierda: el formulario (con sus propios tabs internos) */}
        <div style={{ background: "#1e1f26", border: "1px solid #3a3f45", borderRadius: 14, padding: 20 }}>
          <StripeCheckoutForm
            amount={Math.round(total * 100)}   // centavos
            orderId={orderId}
            email={user?.email}
            onSuccess={onSuccess}
            // mostramos los tabs internos del form (default: true)
            showMethodTabs={true}
          />
          <div style={{ display: "flex", gap: 12, marginTop: 12, opacity: 0.9 }}>
            <img src="/img/visa.svg" alt="Visa" height="18" />
            <img src="/img/mastercard.svg" alt="Mastercard" height="18" />
            <img src="/img/amex.svg" alt="American Express" height="18" />
          </div>
        </div>

        {/* Derecha: resumen (sticky) */}
        <aside
          style={{
            position: "sticky", top: 80, alignSelf: "start",
            background: "#2d2e38", border: "1px solid #3a3f45", borderRadius: 14, padding: 20
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Resumen</h3>
            <button
              type="button"
              onClick={() => setShowSummary((s) => !s)}
              aria-expanded={showSummary}
              aria-controls="order-summary"
              style={{ background: "transparent", border: "none", color: "#ff6b9e", cursor: "pointer", fontWeight: 700 }}
            >
              {showSummary ? "Ocultar" : `Ver (${cart.reduce((a, it) => a + (it.quantity || 1), 0)} artículos)`}
            </button>
          </div>

          <div style={{ display: "grid", gap: 8, marginTop: 12, color: "#cfd2d8" }}>
            <Row label="Subtotal" value={fmt.format(subtotal)} />
            <Row label="Envío" value={shipping === 0 ? "Gratis" : fmt.format(shipping)} />
            <hr style={{ borderColor: "#3a3f45", margin: "8px 0" }} />
            <Row
              label={<strong style={{ color: "#e9ecf1" }}>Total</strong>}
              value={<strong style={{ color: "#8fff8f" }}>{fmt.format(total)}</strong>}
            />
          </div>

          {showSummary && (
            <div id="order-summary" style={{ marginTop: 10 }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, padding: "8px 0", borderTop: "1px dashed #3a3f45" }}>
                  <div style={{ color: "#ddd" }}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>{" "}
                    <span style={{ color: "#a7acb6" }}>· x{item.quantity}</span>
                  </div>
                  <div style={{ textAlign: "right", color: "#cfd2d8" }}>
                    {fmt.format((item.price || 0) * (item.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .pay-grid { grid-template-columns: 1fr; }
          aside { position: static !important; }
        }
      `}</style>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
