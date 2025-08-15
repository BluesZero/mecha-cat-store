// src/components/checkout/StripeCheckoutForm.jsx
import React, { useState, useEffect } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function StripeCheckoutForm({
  amount,                // centavos MXN
  onSuccess,
  orderId,
  email,
  showMethodTabs = true, // 👈 nuevo: oculta tabs internos si es false
  method = "card",       // 👈 nuevo: 'card' | 'gpay' | 'paypal' cuando showMethodTabs=false
}) {
  const stripe = useStripe();
  const elements = useElements();

  // cuando showMethodTabs=false, tomamos el método desde props
  const [activeTab, setActiveTab] = useState(showMethodTabs ? "card" : method);
  useEffect(() => {
    if (!showMethodTabs) setActiveTab(method);
  }, [showMethodTabs, method]);

  const [paymentRequest, setPaymentRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (!stripe) return;
    const pr = stripe.paymentRequest({
      country: "MX",
      currency: "mxn",
      total: { label: "Total", amount: Math.round(amount || 0) },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });
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
      const base = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(amount || 0) }),
      });

      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("No se recibió clientSecret.");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message || "Error al procesar el pago.");
      } else if (result.paymentIntent?.status === "succeeded") {
        onSuccess?.();
      }
    } catch (err) {
      console.error("Error en Stripe Elements:", err);
      setError("Hubo un error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Orbitron', sans-serif" }}>
      {/* Tabs internos SOLO si showMethodTabs === true */}
      {showMethodTabs && (
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
      )}

      {/* TARJETA */}
      {activeTab === "card" && (
        <form
          onSubmit={handleCardSubmit}
          autoComplete="on"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <label style={{ fontSize: "0.9rem", color: "#ccc" }}>Número de tarjeta</label>
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
              cursor: !stripe || loading ? "not-allowed" : "pointer",
              fontSize: "1rem",
            }}
          >
            {loading ? "Procesando..." : "Pagar ahora"}
          </button>
        </form>
      )}

      {/* PAYPAL */}
      {activeTab === "paypal" && (
        <>
          {paypalClientId ? (
            <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "MXN" }}>
              <div style={{ padding: "16px", border: "1px solid #666", borderRadius: "12px" }}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "silver", shape: "pill", label: "paypal" }}
                  createOrder={(data, actions) =>
                    actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: ((amount || 0) / 100).toFixed(2), // de centavos a MXN
                            currency_code: "MXN",
                          },
                        },
                      ],
                    })
                  }
                  onApprove={async (data, actions) => {
                    await actions.order.capture();
                    onSuccess?.();
                  }}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    setError("Hubo un error con PayPal.");
                  }}
                />
              </div>
            </PayPalScriptProvider>
          ) : (
            <p style={{ color: "#aaa" }}>PayPal no está configurado.</p>
          )}
        </>
      )}

      {/* GOOGLE / APPLE PAY */}
      {activeTab === "gpay" && (
        <>
          {paymentRequest ? (
            <PaymentRequestButtonElement
              options={{ paymentRequest }}
              style={{ paymentRequestButton: { theme: "dark", height: "44px" } }}
            />
          ) : (
            <p style={{ color: "#aaa", marginTop: "10px" }}>
              Google Pay o Apple Pay no están disponibles en este dispositivo.
            </p>
          )}
        </>
      )}
    </div>
  );
}
