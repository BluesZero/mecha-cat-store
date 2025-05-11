// components/Account/ProfileTab.jsx
import React, { useState } from "react";

export default function ProfileTab({ user }) {
  const [editableUser, setEditableUser] = useState({ ...user });
  const [editing, setEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setEditableUser({
        ...editableUser,
        address: {
          ...editableUser.address,
          [key]: value,
        },
      });
    } else {
      setEditableUser({ ...editableUser, [name]: value });
    }
  };

  const validate = () => {
    const errors = {};
    if (!editableUser.name?.trim()) errors.name = "El nombre es obligatorio";
    if (!editableUser.lastname?.trim()) errors.lastname = "El apellido es obligatorio";
    if (!editableUser.email?.trim()) errors.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editableUser.email)) errors.email = "Correo no válido";
    return errors;
  };

  const handleSave = () => {
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    localStorage.setItem("mechacat_user", JSON.stringify(editableUser));
    setEditing(false);
    window.location.reload();
  };

  return (
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
              {formErrors.name && <span style={errorStyle}>{formErrors.name}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <label>Apellido</label>
              <input name="lastname" value={editableUser.lastname} onChange={handleChange} style={inputStyle} />
              {formErrors.lastname && <span style={errorStyle}>{formErrors.lastname}</span>}
            </div>
          </div>

          <div>
            <label>Correo electrónico</label>
            <input name="email" value={editableUser.email} onChange={handleChange} style={inputStyle} />
            {formErrors.email && <span style={errorStyle}>{formErrors.email}</span>}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button className="buy-button" onClick={handleSave}>Guardar cambios</button>
            <button onClick={() => setEditing(false)} style={{ background: 'transparent', border: '1px solid #888', borderRadius: '8px', padding: '8px 12px', color: 'white', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}
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

const errorStyle = {
  color: 'tomato',
  fontSize: '13px',
  marginTop: '6px',
  display: 'block'
};
