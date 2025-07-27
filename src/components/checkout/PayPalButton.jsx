// src/components/checkout/PayPalButton.jsx
import React, { useEffect, useRef } from "react";

export default function PayPalButton({ amount, onSuccess }) {
  const paypalRef = useRef();

  useEffect(() => {
    if (!window.paypal) return;

    window.paypal.Buttons({
      style: {
        layout: "horizontal",
        color: "gold",
        shape: "rect",
        label: "paypal",
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toFixed(2), // 💰 monto como string con dos decimales
              currency_code: "MXN"
            },
          }],
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
          console.log("Pago aprobado:", details);
          onSuccess(); // ✅ acción luego de pago exitoso
        });
      },
      onError: (err) => {
        console.error("Error en PayPal:", err);
        alert("Hubo un error con PayPal.");
      }
    }).render(paypalRef.current);
  }, [amount, onSuccess]);

  return <div ref={paypalRef} />;
}
