// components/Auth.jsx
import React, { useState, useEffect } from "react";
import usersData from "../data/users.json";

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("mechacat_user"));
    if (user) onLoginSuccess(user);
    if (!localStorage.getItem("mechacat_users")) {
      localStorage.setItem("mechacat_users", JSON.stringify(usersData));
    }
  }, []);

  const getUsers = () => {
    return JSON.parse(localStorage.getItem("mechacat_users")) || [];
  };

  const saveUser = (user) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem("mechacat_users", JSON.stringify(users));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !email || !password) return setError("Completa todos los campos");
    const users = getUsers();
    if (users.find((u) => u.email === email)) return setError("Ese email ya está registrado");
    const newUser = { id: Date.now(), username, email, password, isAdmin: false };
    saveUser(newUser);
    localStorage.setItem("mechacat_user", JSON.stringify(newUser));
    onLoginSuccess(newUser);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return setError("Credenciales incorrectas");
    localStorage.setItem("mechacat_user", JSON.stringify(user));
    onLoginSuccess(user);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #1e1f26, #2a2f34)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#2a2f34', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', animation: 'fadeIn 0.4s ease-out', margin: '0 auto' }}>
        <h2 style={{ color: 'white', marginBottom: '25px', textAlign: 'center', fontSize: '26px', lineHeight: 1.2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <span role="img" aria-label="login">👤</span> {isLogin ? "Inicia sesión" : "Crea tu cuenta"}
        </h2>

        {error && <p style={{ color: 'tomato', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" className="buy-button" style={{ width: '100%', marginTop: '20px', fontSize: '16px', padding: '12px 16px' }}>
            {isLogin ? "Ingresar" : "Registrarse"}
          </button>
        </form>

        <p style={{ color: '#ccc', marginTop: '25px', textAlign: 'center' }}>
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#ff3881', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}>
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
        </div>
      <style>{`
        @keyframes fadeIn {
                          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '16px',
  borderRadius: '10px',
  border: '1px solid #444',
  backgroundColor: '#1e1f26',
  color: 'white',
  fontSize: '15px',
  outline: 'none',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box'
};
