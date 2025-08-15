// src/components/checkout/CartSummary.jsx
import React, { useMemo, useState } from "react";

export default function CartSummary({
  cart = [],
  onRemove,
  onUpdateQuantity,
  onContinue,
}) {
  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 2,
      }),
    []
  );

  const FREE_THRESHOLD = 2999; // MXN para envío gratis (ajústalo si quieres)

  // Totales
  const subtotal = useMemo(
    () =>
      cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0),
    [cart]
  );

  // Cupón local (opcional, UX)
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null); // {code, type:'percent'|'shipping', value}
  const [couponMsg, setCouponMsg] = useState("");

  const discount =
    applied?.type === "percent" ? subtotal * (applied.value / 100) : 0;

  const shippingBase = subtotal >= FREE_THRESHOLD ? 0 : 99;
  const shipping = applied?.type === "shipping" ? 0 : shippingBase;

  const total = Math.max(0, subtotal - discount + shipping);

  // Progreso a envío gratis
  const remainingForFree = Math.max(0, FREE_THRESHOLD - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_THRESHOLD) * 100));

  const tryApplyCoupon = (e) => {
    e.preventDefault();
    const code = coupon.trim().toUpperCase();
    if (!code) return;

    if (code === "MEKACAT10") {
      setApplied({ code, type: "percent", value: 10 });
      setCouponMsg("🎉 Cupón aplicado: 10% de descuento.");
    } else if (code === "ENVIOGRATIS") {
      setApplied({ code, type: "shipping", value: 100 });
      setCouponMsg("🚚 Envío gratis aplicado.");
    } else {
      setApplied(null);
      setCouponMsg("⚠️ Cupón no válido.");
    }
  };

  const mainImage = (it) =>
    (Array.isArray(it.images) && it.images[0]) || it.image || "/img/placeholder.webp";

  const decQty = (it) =>
    onUpdateQuantity?.(it.id, Math.max(1, (it.quantity || 1) - 1));
  const incQty = (it) =>
    onUpdateQuantity?.(
      it.id,
      Math.min(
        it.stock ?? Infinity, // si no hay stock, no limitamos por arriba
        (it.quantity || 1) + 1
      )
    );

  return (
    <div style={{ padding: "40px 20px", color: "white", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 className="section-title">Resumen del carrito</h2>

      {/* Envío gratis banner */}
      <div
        style={{
          background: "#24272f",
          border: "1px solid #363b45",
          borderRadius: 12,
          padding: "12px 16px",
          marginBottom: 20,
        }}
        aria-live="polite"
      >
        {subtotal >= FREE_THRESHOLD ? (
          <p style={{ margin: 0, color: "#8fff8f" }}>
            ⭐ ¡Tienes envío gratis! (superaste {fmt.format(FREE_THRESHOLD)})
          </p>
        ) : (
          <>
            <p style={{ margin: "0 0 8px", color: "#ccc" }}>
              Te faltan <strong style={{ color: "white" }}>{fmt.format(remainingForFree)}</strong> para envío gratis.
            </p>
            <div
              style={{
                height: 8,
                width: "100%",
                background: "#1b1d23",
                borderRadius: 8,
                overflow: "hidden",
              }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg,#4ade80,#22d3ee)",
                }}
              />
            </div>
          </>
        )}
      </div>

      {cart.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#aaa",
            padding: "40px 16px",
            background: "#1e1f26",
            borderRadius: 12,
            border: "1px solid #333",
          }}
        >
          <p style={{ marginBottom: 12 }}>Tu carrito está vacío.</p>
          <a
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              background: "#ff3881",
              padding: "10px 16px",
              borderRadius: 20,
              display: "inline-block",
              fontWeight: "bold",
            }}
          >
            Seguir comprando
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "space-between" }}>
          {/* Tabla de productos */}
          <div style={{ flex: "1 1 700px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #363b45" }}>
                  <th style={{ textAlign: "left", padding: "12px" }}>Producto</th>
                  <th style={{ textAlign: "center", padding: "12px" }}>Cantidad</th>
                  <th style={{ textAlign: "right", padding: "12px", minWidth: 110 }}>Importe</th>
                  <th style={{ padding: "12px" }} />
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const atMax = typeof item.stock === "number" && item.quantity >= item.stock;
                  return (
                    <tr key={item.id} style={{ borderBottom: "1px solid #2e323a" }}>
                      <td style={{ padding: "12px", display: "flex", gap: "12px", alignItems: "center" }}>
                        <img
                          src={mainImage(item)}
                          alt={item.name}
                          style={{
                            width: "64px",
                            height: "64px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            background: "#15171c",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          <div style={{ color: "#9aa0aa", fontSize: 13 }}>
                            {fmt.format(item.price)} {item.stock ? `• Stock: ${item.stock}` : ""}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            backgroundColor: "#2a2f34",
                            borderRadius: "8px",
                            padding: "4px 10px",
                          }}
                        >
                          <button
                            aria-label="Disminuir cantidad"
                            onClick={() => decQty(item)}
                            disabled={item.quantity <= 1}
                            style={{
                              background: "none",
                              border: "none",
                              color: item.quantity <= 1 ? "#666" : "#ff6b9e",
                              fontSize: "18px",
                              cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                            }}
                          >
                            −
                          </button>
                          <span style={{ minWidth: "24px" }}>{item.quantity}</span>
                          <button
                            aria-label="Aumentar cantidad"
                            onClick={() => incQty(item)}
                            disabled={atMax}
                            style={{
                              background: "none",
                              border: "none",
                              color: atMax ? "#666" : "#8fff8f",
                              fontSize: "18px",
                              cursor: atMax ? "not-allowed" : "pointer",
                            }}
                          >
                            ＋
                          </button>
                        </div>
                        {atMax && (
                          <div style={{ color: "#ffb3bd", fontSize: 12, marginTop: 6 }}>
                            Máximo disponible en stock.
                          </div>
                        )}
                      </td>

                      <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>
                        {fmt.format((item.price || 0) * (item.quantity || 1))}
                      </td>

                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() => onRemove?.(item.id)}
                          style={{
                            background: "none",
                            border: "1px solid #dc3545",
                            color: "#ffb3bd",
                            fontSize: "14px",
                            cursor: "pointer",
                            padding: "6px 10px",
                            borderRadius: 10,
                          }}
                          title="Eliminar"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Nota móvil */}
            <style>{`
              @media (max-width: 720px) {
                table thead { display: none; }
                table, tbody, tr, td { display: block; width: 100%; }
                tr { border-bottom: 1px solid #2e323a; padding-bottom: 12px; margin-bottom: 12px; }
                td { text-align: left !important; }
              }
            `}</style>
          </div>

          {/* Resumen fijo */}
          <aside
            style={{
              flex: "0 1 320px",
              backgroundColor: "#2a2f34",
              borderRadius: "12px",
              padding: "24px",
              height: "fit-content",
              position: "sticky",
              top: 80,
              alignSelf: "flex-start",
              border: "1px solid #363b45",
            }}
          >
            <h3 style={{ marginBottom: "16px", fontSize: "20px", color: "white" }}>
              Resumen ({cart.reduce((a, it) => a + (it.quantity || 1), 0)} artículos)
            </h3>

            {/* Cupón */}
            <form onSubmit={tryApplyCoupon} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 6 }}>
                Cupón de descuento
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="MEKACAT10 / ENVIOGRATIS"
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "1px solid #3b414c",
                    background: "#1e1f26",
                    color: "white",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "#353a43",
                    border: "1px solid #4a4f57",
                    color: "white",
                    padding: "10px 12px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Aplicar
                </button>
              </div>
              {couponMsg && (
                <div style={{ color: applied ? "#8fff8f" : "#ffb3bd", fontSize: 12, marginTop: 6 }}>
                  {couponMsg}
                </div>
              )}
              {applied && (
                <div style={{ color: "#9aa0aa", fontSize: 12, marginTop: 6 }}>
                  Cupón activo: <strong>{applied.code}</strong>{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setApplied(null);
                      setCouponMsg("");
                      setCoupon("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff6b9e",
                      cursor: "pointer",
                      padding: 0,
                      marginLeft: 6,
                    }}
                  >
                    Quitar
                  </button>
                </div>
              )}
            </form>

            <div style={{ display: "grid", gap: 8, color: "#ccc" }}>
              <Row label="Subtotal" value={fmt.format(subtotal)} />
              {discount > 0 && (
                <Row label="Descuento" value={`- ${fmt.format(discount)}`} />
              )}
              <Row
                label="Envío"
                value={shipping === 0 ? "Gratis" : fmt.format(shipping)}
              />
            </div>

            <hr style={{ margin: "16px 0", borderColor: "#3a3f45" }} />

            <Row
              label={<strong style={{ color: "white" }}>Total</strong>}
              value={<strong style={{ color: "white" }}>{fmt.format(total)}</strong>}
            />

            <button
              className="buy-button"
              style={{ marginTop: 20, width: "100%" }}
              onClick={onContinue}
            >
              Continuar con el envío
            </button>

            <p style={{ color: "#9aa0aa", fontSize: 12, marginTop: 10 }}>
              Impuestos calculados en el siguiente paso si aplican.
            </p>
          </aside>
        </div>
      )}
    </div>
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
