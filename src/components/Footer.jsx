// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={sectionStyle}>
        <h4 style={titleStyle}>Mecha Cat Store</h4>
        <p style={textStyle}>Trading Card Game Store especializada en productos Pokémon y más.</p>
      </div>

      <div style={sectionStyle}>
        <h4 style={titleStyle}>Secciones</h4>
        <ul style={listStyle}>
          <li><a href="/franchise/pokemon/product-types" style={linkStyle}>Productos</a></li>
          <li><a href="/franchise/pokemon/expansions" style={linkStyle}>Expansiones</a></li>
          <li><a href="/account" style={linkStyle}>Mi cuenta</a></li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h4 style={titleStyle}>Contacto</h4>
        <p style={textStyle}>📧 contacto@mechacat.com</p>
        <p style={textStyle}>📍 Nuevo Leon, México</p>
        <p style={textStyle}>© {new Date().getFullYear()} Mecha Cat</p>
        <div style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={socialIcon}>
            <img width="50" height="50" src="https://img.icons8.com/ios/50/FFFFFF/facebook--v1.png" alt="facebook--v1"/>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={socialIcon}>
            <img width="50" height="50" src="https://img.icons8.com/ios/50/FFFFFF/instagram-new--v1.png" alt="instagram-new--v1"/>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={socialIcon}>
            <img width="50" height="50" src="https://img.icons8.com/ios/50/FFFFFF/twitterx--v2.png" alt="twitterx--v2"/>
          </a>
        </div>
      </div>
    </footer>
  );
}

const footerStyle = {
  background: "#1e1f26",
  color: "white",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-around",
  padding: "40px 20px",
  borderTop: "1px solid #333",
  marginTop: "60px"
};

const sectionStyle = {
  flex: "1 1 200px",
  marginBottom: "20px"
};

const titleStyle = {
  marginBottom: "12px",
  color: "#ff3881"
};

const textStyle = {
  fontSize: "14px",
  color: "#ccc",
  marginBottom: "8px"
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0
};

const linkStyle = {
  textDecoration: "none",
  color: "#ccc",
  display: "block",
  marginBottom: "6px"
};

const socialIcon = {
  fontSize: "20px",
  textDecoration: "none",
  color: "#ff3881",
  transition: "color 0.3s"
};
