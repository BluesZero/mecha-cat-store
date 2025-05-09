// components/Account.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Account({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [editableUser, setEditableUser] = useState({ ...user });
  const [editing, setEditing] = useState(false);

  const navButton = (label, tab, icon) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        background: activeTab === tab ? "#ff3881" : "transparent",
        border: "none",
        color: "white",
        padding: "12px 20px",
        textAlign: "left",
        width: "100%",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}
    >
      {icon} {label}
    </button>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setEditableUser({
        ...editableUser,
        address: {
          ...editableUser.address,
          [key]: value
        }
      });
    } else {
      setEditableUser({ ...editableUser, [name]: value });
    }
  };

  const handleSave = () => {
    localStorage.setItem("mechacat_user", JSON.stringify(editableUser));
    setEditing(false);
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1e1f26, #2a2f34)",
      color: "white",
      padding: "40px 20px"
    }}>
      <div style={{ display: "flex", gap: "40px", maxWidth: "1200px", width: "100%" }}>
        {/* Sidebar */}
        <aside style={{
          width: "260px",
          background: "#292d33",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)"
        }}>
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ marginBottom: "6px" }}>{user.name} {user.lastname}</h3>
            <p style={{ fontSize: "13px", color: "#ccc" }}>{user.email}</p>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {navButton("Mi perfil", "profile", "👤")}
            {navButton("Favoritos", "favorites", "❤️")}
            {navButton("Pedidos", "orders", "📦")}
            {navButton("Configuración", "settings", "⚙️")}
            <hr style={{ borderColor: "#444", margin: "12px 0" }} />
            <button
              onClick={onLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "tomato",
                fontWeight: "bold",
                cursor: "pointer",
                padding: "10px 0"
              }}
            >
              🚪 Cerrar sesión
            </button>
          </nav>

          {user?.isAdmin && (
            <button
              onClick={() => navigate("/admin/add")}
              style={{
                marginTop: "20px",
                background: "#ff3881",
                border: "none",
                color: "white",
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              ➕ Registrar producto
            </button>
          )}
        </aside>

        {/* Main content */}
        <main style={{
          flex: 1,
          background: "#292d33",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)"
        }}>
          {activeTab === "profile" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>🧾 Mi perfil</h2>

              {!editing ? (
                <>
                  <p><strong>Nombre completo:</strong> {editableUser.name} {editableUser.lastname}</p>
                  <p><strong>Email:</strong> {editableUser.email}</p>
                  <p><strong>Teléfono:</strong> {editableUser.phone || "No registrado"}</p>
                  <p style={{ marginTop: "20px" }}><strong>Dirección:</strong><br />
                    {editableUser.address?.street}<br />
                    {editableUser.address?.city}, {editableUser.address?.state}<br />
                    {editableUser.address?.zip}, {editableUser.address?.country}
                  </p>
                  <p style={{ marginTop: "20px" }}><strong>Miembro desde:</strong> {new Date(editableUser.joinedAt).toLocaleDateString()}</p>
                  <button onClick={() => setEditing(true)} style={{ marginTop: "20px" }} className="buy-button">Editar perfil</button>
                </>
              ) : (
                <div style={{ maxWidth: "600px", display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ marginBottom: '10px' }}>✏️ Editar datos personales</h3>

                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Nombre</label>
                      <input name="name" value={editableUser.name} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Apellido</label>
                      <input name="lastname" value={editableUser.lastname} onChange={handleChange} style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label>Correo electrónico</label>
                    <input name="email" value={editableUser.email} onChange={handleChange} style={inputStyle} />
                  </div>

                  <div>
                    <label>Teléfono</label>
                    <input name="phone" value={editableUser.phone} onChange={handleChange} style={inputStyle} />
                  </div>

                  <h4 style={{ marginTop: '20px' }}>📍 Dirección</h4>

                  <div>
                    <label>Calle</label>
                    <input name="address.street" value={editableUser.address?.street || ""} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Ciudad</label>
                      <input name="address.city" value={editableUser.address?.city || ""} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Estado</label>
                      <input name="address.state" value={editableUser.address?.state || ""} onChange={handleChange} style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Código postal</label>
                      <input name="address.zip" value={editableUser.address?.zip || ""} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>País</label>
                      <input name="address.country" value={editableUser.address?.country || ""} onChange={handleChange} style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button className="buy-button" onClick={handleSave}>Guardar cambios</button>
                    <button onClick={() => setEditing(false)} style={{ background: 'transparent', border: '1px solid #888', borderRadius: '8px', padding: '8px 12px', color: 'white', cursor: 'pointer' }}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>❤️ Productos favoritos</h2>
              {user.favorites.length === 0 ? (
                <p>No tienes productos en favoritos.</p>
              ) : (
                <ul style={{ paddingLeft: "20px" }}>{user.favorites.map(f => <li key={f}>{f}</li>)}</ul>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>📦 Mis pedidos</h2>
              {user.orders.length === 0 ? (
                <p>No tienes pedidos aún.</p>
              ) : (
                <ul style={{ paddingLeft: "20px" }}>{user.orders.map(o => <li key={o.orderId}>Pedido #{o.orderId}</li>)}</ul>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>⚙️ Configuración</h2>
              <p>Próximamente: edición de perfil, cambio de contraseña, notificaciones…</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #555',
  backgroundColor: '#1e1f26',
  color: 'white',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
};
