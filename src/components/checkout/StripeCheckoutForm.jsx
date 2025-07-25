// src/components/checkout/StripeCheckoutForm.jsx
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function StripeCheckoutForm({ amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe no está listo aún.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(amount) }), // en centavos
      });

      const { clientSecret } = await res.json();

      if (!clientSecret) throw new Error("No se recibió clientSecret.");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        onSuccess();
      }
    } catch (err) {
      console.error("Error en Stripe Elements:", err.message);
      setError("Hubo un error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        style={{
          padding: "16px",
          border: "1px solid #555",
          borderRadius: "8px",
          backgroundColor: "#1e1f26",
        }}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#fff",
                "::placeholder": {
                  color: "#aaa",
                },
              },
              invalid: {
                color: "#ff6fa1",
              },
            },
          }}
        />
      </div>

      {error && <p style={{ color: "tomato", fontSize: "14px" }}>{error}</p>}

      <button type="submit" className="buy-button" disabled={!stripe || loading}>
        {loading ? "Procesando..." : "Pagar"}
      </button>
    </form>
  );
}
