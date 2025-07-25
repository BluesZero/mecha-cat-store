// src/components/checkout/CartSummary.jsx
import React from "react";

export default function CartSummary({ cart = [], onRemove, onUpdateQuantity, onContinue }) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div style={{ padding: "40px", color: "white", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 className="section-title">Resumen del carrito</h2>

      {cart.length === 0 ? (
        <p style={{ color: "#aaa", textAlign: "center", marginTop: "40px" }}>
          Tu carrito está vacío.
        </p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 700px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #888" }}>
                  <th style={{ textAlign: "left", padding: "12px" }}>Producto</th>
                  <th style={{ textAlign: "center", padding: "12px" }}>Cantidad</th>
                  <th style={{ textAlign: "left", padding: "12px" }}>Precio</th>
                  <th style={{ padding: "12px" }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #444" }}>
                    <td style={{ padding: "12px", display: "flex", gap: "12px", alignItems: "center" }}>
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.name}
                        style={{
                          width: "64px",
                          height: "64px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <span>{item.name}</span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        backgroundColor: "#2a2f34",
                        borderRadius: "8px",
                        padding: "4px 10px",
                      }}>
                        <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          style={{ background: "none", border: "none", color: "#ff3881", fontSize: "18px", cursor: "pointer" }}>
                          −
                        </button>
                        <span style={{ minWidth: "24px" }}>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={{ background: "none", border: "none", color: "#8fff8f", fontSize: "18px", cursor: "pointer" }}>
                          ＋
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>${(item.price * item.quantity).toFixed(2)}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        onClick={() => onRemove(item.id)}
                        style={{ background: "none", border: "none", color: "#ff3881", fontSize: "20px", cursor: "pointer" }}
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ flex: "0 1 280px", backgroundColor: "#2a2f34", borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "22px", color: "white" }}>Resumen</h3>
            <p style={{ color: "#ccc", marginBottom: "10px" }}>Subtotal: <strong>${subtotal.toFixed(2)}</strong></p>
            <p style={{ color: "#ccc", marginBottom: "10px" }}>Envío: <strong>${shipping.toFixed(2)}</strong></p>
            <hr style={{ margin: "20px 0", borderColor: "#444" }} />
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>Total: ${total.toFixed(2)}</p>
            <button className="buy-button" style={{ marginTop: "20px", width: "100%" }} onClick={onContinue}>
              Continuar con el envío
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
