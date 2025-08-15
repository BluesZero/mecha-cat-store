// src/components/Footer.jsx
import React, { useState } from "react";

export default function Footer({ onNewsletterSubmit }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMsg("");
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) return setMsg("Ingresa un correo válido.");
    try {
      // Si te pasamos un handler externo, úsalo (p.ej. Supabase)
      if (onNewsletterSubmit) await onNewsletterSubmit(email);
      setMsg("¡Gracias! Te avisaremos de lanzamientos y ofertas.");
      setEmail("");
    } catch {
      setMsg("No pudimos suscribirte. Intenta más tarde.");
    }
  };

  return (
    <footer role="contentinfo" style={footerStyle}>
      <div style={containerStyle}>
        {/* Columna 1 - Logo / descripción + newsletter */}
        <div style={sectionStyle}>
          <h4 style={logoTitle}>MEKA CAT STORE</h4>
          <p style={textStyle}>
            Trading Card Game Store especializada en productos Pokémon y más.
            Encuentra expansiones, cajas y coleccionables de edición limitada.
          </p>

          <form onSubmit={handleSubscribe} aria-label="Suscripción a newsletter" style={{ marginTop: 12 }}>
            <label htmlFor="nl" style={srOnly}>Correo electrónico</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center", maxWidth: 420 }}>
              <input
                id="nl"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo para preventas y ofertas"
                className="footer-input"
                style={inputStyle}
              />
              <button type="submit" className="footer-btn" style={buttonStyle}>
                Suscribirme
              </button>
            </div>
            {msg && <div style={{ marginTop: 8, fontSize: 13, color: "#9bd3a7" }}>{msg}</div>}
          </form>

          {/* Métodos de pago */}
          <div style={{ marginTop: 18 }}>
            <p style={{ ...textStyle, marginBottom: 10 }}>Métodos de pago</p>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <img src="/img/mastercard.svg" alt="Mastercard" height="22" />
              <img src="/img/visa.svg" alt="Visa" height="22" />
              <img src="/img/amex.svg" alt="American Express" height="22" />
              <img src="/img/paypal.svg" alt="PayPal" height="22" />
            </div>
          </div>
        </div>

        {/* Columna 2 - Secciones */}
        <nav style={sectionStyle} aria-label="Secciones">
          <h4 style={titleStyle}>Secciones</h4>
          <ul style={listStyle}>
            <li><a href="/franchise/pokemon/product-types" className="footer-link">Productos</a></li>
            <li><a href="/franchise/pokemon/expansions" className="footer-link">Expansiones</a></li>
            <li><a href="/franchise/pokemon/product-types/preorder/products" className="footer-link">Preventas</a></li>
            <li><a href="/franchise/pokemon/product-types/sale/products" className="footer-link">Ofertas</a></li>
            <li><a href="/account" className="footer-link">Mi cuenta</a></li>
          </ul>
        </nav>

        {/* Columna 3 - Ayuda / Políticas */}
        <nav style={sectionStyle} aria-label="Ayuda">
          <h4 style={titleStyle}>Ayuda</h4>
          <ul style={listStyle}>
            <li><a href="/faq" className="footer-link">Preguntas frecuentes</a></li>
            <li><a href="/envios" className="footer-link">Envíos y tiempos</a></li>
            <li><a href="/devoluciones" className="footer-link">Cambios y devoluciones</a></li>
            <li><a href="/pagos" className="footer-link">Métodos de pago</a></li>
            <li><a href="/privacidad" className="footer-link">Aviso de privacidad</a></li>
            <li><a href="/terminos" className="footer-link">Términos y condiciones</a></li>
          </ul>
        </nav>

        {/* Columna 4 - Contacto / Social */}
        <div style={sectionStyle}>
          <h4 style={titleStyle}>Contacto</h4>
          <p style={textStyle}>📧 <a href="mailto:contacto@mekacatstore.com" className="footer-link">contacto@mekacatstore.com</a></p>
          <p style={textStyle}>📍 Nuevo León, México</p>

          <div style={socialContainer} aria-label="Redes sociales">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/facebook--v1.png" alt="" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/instagram-new--v1.png" alt="" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok">
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/tiktok--v1.png" alt="" />
            </a>
          </div>

          {/* Mini FAQ inline opcional */}
          <div style={{ marginTop: 14 }}>
            <details>
              <summary style={{ cursor: "pointer", color: "#bbb", fontSize: 14 }}>¿Cómo funcionan las preventas?</summary>
              <p style={{ ...textStyle, marginTop: 6 }}>
                Asegura tu producto antes del lanzamiento. Enviamos cuando la expansión llega al almacén.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div style={bottomBar}>
        <p style={{ margin: 0, fontSize: 13, color: "#777" }}>
          © {new Date().getFullYear()} Meka Cat Store — Todos los derechos reservados
        </p>
        <div style={{ marginTop: 8, fontSize: 12 }}>
          <a href="/privacidad" className="footer-link">Privacidad</a> ·{" "}
          <a href="/terminos" className="footer-link">Términos</a> ·{" "}
          <a href="/contacto" className="footer-link">Contacto</a>
        </div>
      </div>

      {/* Estilos locales para hover/focus */}
      <style>{`
        .footer-link {
          text-decoration: none;
          color: #bbb;
          transition: color .2s ease;
        }
        .footer-link:hover, .footer-link:focus-visible { color: #ff3881; outline: none; }
        .social-icon {
          display: inline-flex; justify-content: center; align-items: center;
          width: 36px; height: 36px; border-radius: 50%; background: #2d2e38;
          transition: background .2s ease, transform .2s ease;
        }
        .social-icon:hover, .social-icon:focus-visible { background: #ff3881; transform: translateY(-2px); outline: none; }
        .footer-input { width: 100%; }
        .footer-btn:hover, .footer-btn:focus-visible { filter: brightness(1.06); outline: none; }
        @media (max-width: 760px) {
          .footer-input { min-width: 0; }
        }
      `}</style>
    </footer>
  );
}

/* ------- Estilos ------- */
const footerStyle = {
  background: "#1e1f26",
  color: "white",
  borderTop: "1px solid #333",
  marginTop: "60px",
  paddingTop: "40px",
};

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-around",
  maxWidth: "1500px",
  margin: "0 auto",
  padding: "0 20px",
  gap: "30px",
};

const sectionStyle = {
  flex: "1 1 350px",
  minWidth: "220px",
};

const logoTitle = {
  fontSize: "20px",
  letterSpacing: "1px",
  color: "#ff3881",
  fontWeight: "bold",
  marginBottom: "14px",
};

const titleStyle = {
  marginBottom: "14px",
  color: "#ff3881",
  fontWeight: "bold",
  fontSize: "16px",
};

const textStyle = {
  fontSize: "14px",
  color: "#bbb",
  marginBottom: "8px",
  lineHeight: 1.6,
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #444",
  background: "#1e1f26",
  color: "white",
  fontSize: "14px",
  outline: "none",
  flex: 1,
};

const buttonStyle = {
  background: "#ff3881",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  fontWeight: 700,
  cursor: "pointer",
};

const socialContainer = {
  marginTop: "14px",
  display: "flex",
  gap: "12px",
};

const bottomBar = {
  marginTop: "30px",
  padding: "16px 20px",
  borderTop: "1px solid #333",
  textAlign: "center",
};

const srOnly = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};
