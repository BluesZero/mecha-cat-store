// components/Account/OrdersTab.jsx
import React, { useState } from "react";

export default function OrdersTab({ orders = [] }) {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>📦 Mis pedidos</h2>

      {orders.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <div style={{ border: "1px solid #444", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto",
            padding: "12px 20px",
            backgroundColor: "#2a2f34",
            fontWeight: "bold",
            borderBottom: "1px solid #444",
            color: "#ccc"
          }}>
            <span>ID</span>
            <span>Fecha</span>
            <span>Total</span>
            <span>Estado</span>
            <span></span>
          </div>

          {orders.map((order) => (
            <div key={order.orderId} style={{ borderBottom: "1px solid #333" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto",
                padding: "14px 20px",
                alignItems: "center",
                backgroundColor: "#1e1f26",
                color: "white"
              }}>
                <div><strong>#{order.orderId}</strong></div>
                <div>{new Date(order.date).toLocaleDateString()}</div>
                <div>${order.total.toFixed(2)}</div>
                <div>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    backgroundColor:
                      order.status === "Enviado" ? "#28a745" :
                      order.status === "Pendiente" ? "#ffc107" :
                      "#007bff"
                  }}>
                    {order.status}
                  </span>
                </div>
                <button
                  onClick={() => toggleDetails(order.orderId)}
                  style={{
                    background: "transparent",
                    color: "#ff3881",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  {expandedOrder === order.orderId ? "Ocultar" : "Ver detalles"}
                </button>
              </div>

              {expandedOrder === order.orderId && (
                <div style={{ padding: "16px 30px", backgroundColor: "#262a30" }}>
                  <p style={{ marginBottom: "10px", fontWeight: "bold" }}>Productos:</p>
                  <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                    {order.products.map((p) => (
                      <li key={p.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px", marginRight: "12px" }}
                        />
                        <div>
                          <p style={{ margin: 0, fontWeight: "bold" }}>{p.name}</p>
                          <p style={{ margin: 0, fontSize: "14px", color: "#ccc" }}>
                            Cantidad: {p.quantity} | Precio: ${p.price.toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
