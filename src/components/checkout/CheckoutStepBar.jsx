// src/components/CheckoutStepBar.jsx
import React from "react";

const steps = ["Resumen", "Envío", "Pago", "Confirmación"];

export default function CheckoutStepBar({ current }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "30px auto",
      maxWidth: "800px",
      padding: "0 20px"
    }}>
      {steps.map((label, i) => {
        const isActive = i <= current;
        const isCurrent = i === current;

        return (
          <React.Fragment key={i}>
            <div
              style={{
                textAlign: "center",
                color: isActive ? "#ff3881" : "#999",
                fontSize: "14px",
                flexShrink: 0,
                transform: isCurrent ? "scale(1.1)" : "scale(1)",
                transition: "color 0.3s ease, transform 0.3s ease",
                opacity: isCurrent ? 1 : 0.8
              }}
            >
              <div style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: isActive ? "#ff3881" : "#ccc",
                margin: "0 auto 6px",
                transition: "background-color 0.4s ease"
              }} />
              {label}
            </div>

            {i < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: "2px",
                backgroundColor: i < current ? "#ff3881" : "#ccc",
                margin: "0 12px",
                position: "relative",
                overflow: "hidden"
              }}>
                <div
                  style={{
                    width: i < current ? "100%" : "0%",
                    height: "100%",
                    backgroundColor: "#ff3881",
                    transition: "width 0.4s ease"
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
