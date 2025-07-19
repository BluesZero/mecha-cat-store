// components/Auth.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const authUser = data?.user;
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profile) onLoginSuccess({ ...authUser, ...profile });
      }
    });
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !name || !lastname || !phone) {
      return setError("Completa todos los campos");
    }

    // Registrar usuario en Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) return setError("Auth error: " + signUpError.message);

    const user = data.user;
    if (!user) return setError("No se obtuvo el usuario tras el registro");

    // Insertar perfil en tabla `profiles`
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      username,
      name,
      lastname,
      phone,
      is_admin: false,
      created_at: new Date().toISOString()
    });

    if (profileError) {
      console.error(profileError);
      return setError("Database error saving new user");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    onLoginSuccess({ ...user, ...profile });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) return setError("Credenciales incorrectas");

    const user = data?.user;
    if (!user) return setError("No se pudo iniciar sesión");

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) return setError("No se encontró perfil del usuario");

    onLoginSuccess({ ...user, ...profile });
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #1e1f26, #2a2f34)",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "#2a2f34",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        animation: "fadeIn 0.4s ease-out",
        margin: "0 auto"
      }}>
        <h2 style={{
          color: "white",
          marginBottom: "25px",
          textAlign: "center",
          fontSize: "26px",
          lineHeight: 1.2
        }}>
          {isLogin ? "Inicia sesión" : "Crea tu cuenta"}
        </h2>

        {error && (
          <p style={{ color: "tomato", marginBottom: "15px", textAlign: "center", fontWeight: "bold" }}>
            {error}
          </p>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Apellido"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
            </>
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
          <button
            type="submit"
            className="buy-button"
            style={{ width: "100%", marginTop: "20px", fontSize: "16px", padding: "12px 16px" }}
          >
            {isLogin ? "Ingresar" : "Registrarse"}
          </button>
        </form>

        <p style={{ color: "#ccc", marginTop: "25px", textAlign: "center" }}>
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: "none",
              border: "none",
              color: "#ff3881",
              cursor: "pointer",
              marginLeft: "5px",
              fontWeight: "bold"
            }}
          >
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
  width: "100%",
  padding: "12px",
  marginBottom: "16px",
  borderRadius: "10px",
  border: "1px solid #444",
  backgroundColor: "#1e1f26",
  color: "white",
  fontSize: "15px",
  outline: "none",
  transition: "all 0.2s ease",
  boxSizing: "border-box"
};
