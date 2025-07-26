// src/components/checkout/PaymentStep.jsx
import React from "react";
import StripeCheckoutForm from "./StripeCheckoutForm";

export default function PaymentStep({ cart, user, orderId, onSuccess }) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <section
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "48px 24px",
        color: "#fff",
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
      <h2 style={{ fontSize: "1.8rem", marginBottom: "30px", textAlign: "center" }}>
        Confirmar tu pago
      </h2>

      <div
        style={{
          backgroundColor: "#2d2e38",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
          marginBottom: "32px",
        }}
      >
        <p style={{ fontSize: "1rem", marginBottom: "10px" }}>
          <strong>Total:</strong>{" "}
          <span style={{ color: "#8fff8f", fontSize: "1.25rem" }}>
            ${subtotal.toFixed(2)} MXN
          </span>
        </p>
        <p style={{ fontSize: "0.95rem", color: "#ccc" }}>
          Ingresa los datos de tu tarjeta para completar el pago seguro.
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#1e1f26",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "inset 0 0 0 1px #444",
        }}
      >
        <StripeCheckoutForm
          amount={subtotal * 100} // en centavos
          orderId={orderId}
          email={user?.email}
          onSuccess={onSuccess}
        />
      </div>

      <p
        style={{
          marginTop: "20px",
          fontSize: "0.85rem",
          textAlign: "center",
          color: "#888",
        }}
      >
        Tus datos están protegidos con <strong>Stripe</strong>. No almacenamos información bancaria.
      </p>
    </section>
  );
}
