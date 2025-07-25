// src/components/checkout/PaymentStep.jsx
import React from "react";
import StripeCheckoutForm from "./StripeCheckoutForm";

export default function PaymentStep({ cart, user, orderId, onSuccess }) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div style={{ color: "white", maxWidth: "600px", margin: "0 auto", padding: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>Pagar con tarjeta</h2>

      <div style={{
        background: "#2a2f34",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
        marginBottom: "20px"
      }}>
        <p>Total a pagar: <strong>${subtotal.toFixed(2)} MXN</strong></p>
        <p>Introduce los datos de tu tarjeta para completar el pago.</p>
      </div>

      <StripeCheckoutForm
        amount={subtotal * 100} // en centavos
        onSuccess={onSuccess}
      />
    </div>
  );
}
