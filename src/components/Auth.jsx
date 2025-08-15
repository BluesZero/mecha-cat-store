// components/Auth.jsx
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useToast } from "./ui/useToast";

export default function Auth({ onLoginSuccess }) {
  // UI state
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const { addToast } = useToast();

  // Si ya está logueado, trae perfil y finaliza
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
  }, [onLoginSuccess]);

  /* ---------------- helpers ---------------- */
  const emailOk = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase().trim());
  const phoneOk = (v) => /^[0-9 +()-]{7,20}$/.test(v.trim());

  const pwdScore = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4); // 0..4
  }, [password]);

  const pwdStrengthLabel = ["Débil", "Básica", "Aceptable", "Fuerte", "Robusta"][pwdScore];

  /* ---------------- actions ---------------- */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    try {
      if (!username || !email || !password || !name || !lastname || !phone) {
        throw new Error("Completa todos los campos.");
      }
      if (!emailOk(email)) throw new Error("Correo inválido.");
      if (!phoneOk(phone)) throw new Error("Teléfono inválido.");
      if (password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres.");

      // username único
      const { data: existingUsername } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username.trim())
        .maybeSingle();

      if (existingUsername) throw new Error("Ese nombre de usuario ya está en uso.");

      // Registro en Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          // si usas verificación de email, puedes redirigir:
          emailRedirectTo: `${window.location.origin}/account`,
        },
      });
      if (signUpError) {
        if (signUpError.message?.includes("registered")) {
          throw new Error("Ese correo ya está registrado.");
        }
        throw new Error(signUpError.message || "No se pudo registrar.");
      }

      const user = data?.user;
      // Cuando hay verificación por email habilitada, `data.session` suele ser null
      const needsEmailConfirm = !data?.session;

      if (!user) throw new Error("No se obtuvo el usuario tras el registro.");

      // Guarda perfil
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        username: username.trim(),
        name: name.trim(),
        lastname: lastname.trim(),
        phone: phone.trim(),
        is_admin: false,
        created_at: new Date().toISOString(),
      });
      if (profileError) throw new Error("Error al guardar el perfil.");

      if (needsEmailConfirm) {
        addToast({
          type: "success",
          icon: "✉️",
          title: "Revisa tu correo",
          description:
            "Te enviamos un enlace para confirmar tu cuenta y completar el acceso.",
        });
        // No podemos obtener sesión todavía; no llamamos onLoginSuccess
        setIsLogin(true);
      } else {
        // Sesión activa: traer perfil completo y loguear
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        onLoginSuccess({ ...user, ...profile });
      }
    } catch (err) {
      setError(err.message || "Error durante el registro.");
      addToast({
        type: "error",
        title: "No se pudo registrar",
        description: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    try {
      if (!email || !password) throw new Error("Ingresa correo y contraseña.");
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (loginError) throw new Error("Credenciales incorrectas.");

      const user = data?.user;
      if (!user) throw new Error("No se pudo iniciar sesión.");

      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileErr || !profile) throw new Error("No se encontró el perfil de usuario.");

      addToast({ type: "success", icon: "👋", title: "Bienvenido", description: profile.username || user.email });
      onLoginSuccess({ ...user, ...profile });
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión.");
      addToast({ type: "error", title: "Error al iniciar sesión", description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!emailOk(email)) {
      setError("Escribe tu correo para enviarte el enlace de recuperación.");
      return;
    }
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/account`,
    });
    if (resetErr) {
      setError("No se pudo enviar el enlace de recuperación.");
      addToast({ type: "error", title: "Ups", description: resetErr.message });
      return;
    }
    addToast({
      type: "success",
      icon: "✉️",
      title: "Revisa tu correo",
      description: "Te enviamos un enlace para restablecer tu contraseña.",
    });
  };

  const handleGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/account` },
      });
    } catch (e) {
      addToast({ type: "error", title: "Google Sign-In", description: e.message });
    }
  };

  /* ---------------- render ---------------- */
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e1f26, #2a2f34)",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#2a2f34",
          padding: 36,
          borderRadius: 16,
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          animation: "fadeIn 0.4s ease-out",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            color: "white",
            marginBottom: 8,
            textAlign: "center",
            fontSize: 28,
            lineHeight: 1.2,
            fontFamily: "var(--font-app, 'Orbitron', system-ui, sans-serif)",
          }}
        >
          {isLogin ? "Inicia sesión" : "Crea tu cuenta"}
        </h2>
        <p style={{ color: "#9aa0aa", textAlign: "center", marginBottom: 22, fontSize: 14 }}>
          {isLogin
            ? "Ingresa con tu correo y contraseña."
            : "Completa tus datos para registrarte."}
        </p>

        {error && (
          <p
            role="alert"
            style={{
              color: "#ffb3bd",
              background: "#3a2830",
              border: "1px solid #5a3642",
              padding: "8px 12px",
              borderRadius: 10,
              marginBottom: 14,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister} noValidate>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                style={inputStyle}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="given-name"
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  autoComplete="family-name"
                  style={inputStyle}
                />
              </div>
              <input
                type="tel"
                placeholder="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                style={inputStyle}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={inputStyle}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
              style={{ ...inputStyle, paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              style={{
                position: "absolute",
                right: 10,
                top: 8,
                background: "none",
                border: "none",
                color: "#ccc",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {!isLogin && (
            <div style={{ marginTop: -6, marginBottom: 12 }}>
              <div
                aria-hidden
                style={{
                  height: 8,
                  borderRadius: 8,
                  background: "#1b1d23",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(pwdScore / 4) * 100}%`,
                    height: "100%",
                    transition: "width .25s ease",
                    background:
                      pwdScore < 2
                        ? "#ff6fa1"
                        : pwdScore < 3
                        ? "#f59e0b"
                        : "#8fff8f",
                  }}
                />
              </div>
              <small style={{ color: "#9aa0aa" }}>Fortaleza: {pwdStrengthLabel}</small>
            </div>
          )}

          <button
            type="submit"
            className="buy-button"
            disabled={submitting}
            style={{
              width: "100%",
              marginTop: 14,
              fontSize: 16,
              padding: "12px 16px",
              fontFamily: "var(--font-app, 'Orbitron', system-ui, sans-serif)",
              opacity: submitting ? 0.8 : 1,
            }}
          >
            {submitting ? "Procesando..." : isLogin ? "Ingresar" : "Registrarse"}
          </button>
        </form>

        {/* Aux / OAuth */}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 10 }}>
          <button
            type="button"
            onClick={handleForgotPassword}
            style={{
              background: "none",
              border: "none",
              color: "#ff3881",
              cursor: "pointer",
              fontWeight: 700,
              padding: 8,
            }}
          >
            ¿Olvidaste tu contraseña?
          </button>

          <button
            type="button"
            onClick={handleGoogle}
            style={{
              background: "#1e1f26",
              border: "1px solid #3b414c",
              color: "white",
              padding: "8px 12px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 700,
            }}
            title="Continuar con Google (si está habilitado)"
          >
            Continuar con Google
          </button>
        </div>

        <p style={{ color: "#ccc", marginTop: 18, textAlign: "center" }}>
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#ff3881",
              cursor: "pointer",
              marginLeft: 6,
              fontWeight: 700,
            }}
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #444",
  backgroundColor: "#1e1f26",
  color: "white",
  fontSize: "15px",
  outline: "none",
  transition: "all 0.2s ease",
  boxSizing: "border-box",
};
