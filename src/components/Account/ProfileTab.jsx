// components/Account/ProfileTab.jsx
import React from "react";

export default function ProfileTab({ user }) {
  const recentOrders = [...(user.orders || [])].slice(-3).reverse();

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>👤 Datos de cuenta</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
        {/* Información personal */}
        <div style={infoBox}>
          <h3 style={sectionTitle}>{user.name} {user.lastname}</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Teléfono:</strong> {user.phone || "No registrado"}</p>
          <p><strong>Miembro desde:</strong> {new Date(user.joinedAt).toLocaleDateString()}</p>
          <button className="buy-button" style={{ marginTop: '20px', width: '100%' }}>
            Editar datos
          </button>
        </div>

        {/* Dirección */}
        <div style={infoBox}>
          <h3 style={sectionTitle}>📦 Dirección principal</h3>
          {user.address ? (
            <>
              <p>{user.address.street}</p>
              <p>{user.address.city}, {user.address.state}</p>
              <p>{user.address.zip}, {user.address.country}</p>
              <button className="buy-button" style={{ marginTop: '20px', width: '100%' }}>
                Editar dirección
              </button>
            </>
          ) : (
            <p>No has registrado dirección.</p>
          )}
        </div>
      </div>

      {/* Últimos pedidos */}
      <h2 style={{ marginBottom: "20px" }}>🕒 Últimos pedidos</h2>
      <div style={{ border: "1px solid #444", borderRadius: "10px", overflow: "hidden" }}>
        {recentOrders.length === 0 ? (
          <p style={{ padding: '20px' }}>No tienes pedidos registrados.</p>
        ) : (
          recentOrders.map(order => (
            <div
              key={order.orderId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 20px",
                background: "#1e1f26",
                borderBottom: "1px solid #333",
                alignItems: "center"
              }}
            >
              <div>
                <strong>#{order.orderId}</strong><br />
                <small>{new Date(order.date).toLocaleDateString()}</small>
              </div>
              <div><strong>${order.total.toFixed(2)}</strong></div>
              <div>
                <span style={{
                  backgroundColor:
                    order.status === "Enviado" ? "#28a745" :
                    order.status === "Pendiente" ? "#ffc107" : "#007bff",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "13px"
                }}>{order.status}</span>
              </div>
              <button style={{
                background: "transparent",
                border: "none",
                color: "#ff3881",
                cursor: "pointer",
                fontSize: "14px"
              }}>
                Ver detalles
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Estilos base
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
