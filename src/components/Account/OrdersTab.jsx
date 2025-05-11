// components/Account/OrdersTab.jsx
import React from "react";

export default function OrdersTab({ orders = [] }) {
  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>📦 Mis pedidos</h2>

      {orders.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => (
            <div
              key={order.orderId}
              style={{
                border: "1px solid #444",
                borderRadius: "10px",
                padding: "16px",
                backgroundColor: "#1e1f26",
                color: "white"
              }}
            >
              <h4 style={{ marginBottom: "8px" }}>Pedido #{order.orderId}</h4>
              <p><strong>Fecha:</strong> {new Date(order.date).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
              <p><strong>Estado:</strong> {order.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
