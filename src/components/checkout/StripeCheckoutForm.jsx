// src/components/checkout/StripeCheckoutForm.jsx
import React, { useState, useEffect } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";

export default function StripeCheckoutForm({ amount, onSuccess, orderId, email }) {
  const stripe = useStripe();
  const elements = useElements();
  const [activeTab, setActiveTab] = useState("card");
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "MX",
        currency: "mxn",
        total: { label: "Total", amount: Math.round(amount) },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, amount]);

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe no está listo aún.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(amount) }),
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
    <div style={{ fontFamily: "'Orbitron', sans-serif" }}>
      {/* 🔘 Tabs de métodos de pago */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        {["card", "gpay", "paypal"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #555",
              background: activeTab === tab ? "#ff3881" : "#1e1f26",
              color: activeTab === tab ? "#fff" : "#ccc",
              cursor: "pointer",
              flex: 1,
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {tab === "card" ? "Tarjeta" : tab === "gpay" ? "Google / Apple Pay" : "PayPal"}
          </button>
        ))}
      </div>

      {/* 💳 Tarjeta */}
      {activeTab === "card" && (
        <form
          onSubmit={handleCardSubmit}
          autoComplete="on"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <label style={{ fontSize: "0.9rem", color: "#ccc" }}>
            Número de tarjeta
          </label>
          <div
            style={{
              padding: "16px",
              border: "1px solid #555",
              borderRadius: "10px",
              backgroundColor: "#121318",
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#ffffff",
                    "::placeholder": { color: "#888" },
                  },
                  invalid: { color: "#ff6fa1" },
                },
              }}
            />
          </div>

          {error && <p style={{ color: "#ff6fa1", fontSize: "0.85rem" }}>{error}</p>}

          <button
            type="submit"
            className="buy-button"
            disabled={!stripe || loading}
            style={{
              backgroundColor: "#ff3881",
              padding: "14px",
              borderRadius: "25px",
              border: "none",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {loading ? "Procesando..." : "Pagar ahora"}
          </button>
        </form>
      )}

      {/* 🅖 Google Pay / Apple Pay */}
      {activeTab === "gpay" && (
        <>
          {paymentRequest ? (
            <PaymentRequestButtonElement
              options={{ paymentRequest }}
              style={{ paymentRequestButton: { theme: "dark", height: "44px" } }}
            />
          ) : (
            <p style={{ color: "#aaa", marginTop: "10px" }}>
              Google Pay o Apple Pay no están disponibles en este dispositivo o navegador.
            </p>
          )}
        </>
      )}

      {/* 🅿️ PayPal (estructura preparada) */}
      {activeTab === "paypal" && (
        <div
          style={{
            padding: "20px",
            border: "1px dashed #888",
            borderRadius: "12px",
            background: "#2a2f34",
            color: "#ccc",
            textAlign: "center",
          }}
        >
          PayPal será habilitado próximamente.
        </div>
      )}
    </div>
  );
}
