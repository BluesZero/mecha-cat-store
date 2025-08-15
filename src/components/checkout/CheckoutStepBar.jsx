// src/components/CheckoutStepBar.jsx
import React from "react";

const DEFAULT_STEPS = ["Resumen", "Envío", "Pago", "Confirmación"];

export default function CheckoutStepBar({
  current = 0,
  steps = DEFAULT_STEPS,
  onStepClick, // opcional: permite ir a pasos previos
}) {
  const accent = "#ff3881";
  const muted = "#8b8f99";
  const line = "#3a3f45";

  return (
    <nav
      aria-label="Progreso de compra"
      style={{
        maxWidth: 900,
        margin: "28px auto 10px",
        padding: "0 16px",
      }}
    >
      <p style={{ color: "#9aa0aa", fontSize: 12, margin: "0 0 10px" }}>
        Paso {current + 1} de {steps.length}
      </p>

      <ol
        role="list"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {steps.map((label, i) => {
          const isComplete = i < current;
          const isCurrent = i === current;
          const isActive = i <= current;

          const circleBg = isComplete ? accent : isCurrent ? accent : "#2a2f34";
          const circleBorder = isCurrent ? `2px solid ${accent}` : "1px solid #3a3f45";
          const textColor = isActive ? "white" : muted;

          const StepWrapper = onStepClick && i < current ? "button" : "div";
          const stepProps =
            onStepClick && i < current
              ? {
                  onClick: () => onStepClick(i),
                  title: `Ir a ${label}`,
                  style: { background: "transparent", border: "none", cursor: "pointer", padding: 0 },
                }
              : {};

          return (
            <React.Fragment key={label}>
              <li
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${label}${isCurrent ? " (actual)" : isComplete ? " (completado)" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}
              >
                <StepWrapper {...stepProps}>
                  <div
                    style={{
                      textAlign: "center",
                      color: textColor,
                      transform: isCurrent ? "scale(1.06)" : "scale(1)",
                      transition: "transform .25s ease, color .25s ease",
                      display: "grid",
                      justifyItems: "center",
                      minWidth: 64,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: circleBg,
                        border: circleBorder,
                        display: "grid",
                        placeItems: "center",
                        color: "white",
                        boxShadow: isCurrent ? "0 0 0 4px rgba(255,56,129,.12)" : "none",
                        transition: "box-shadow .25s ease, background .25s ease, border .25s ease",
                      }}
                    >
                      {isComplete ? "✓" : i + 1}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 13,
                        lineHeight: 1.1,
                        color: isActive ? "#e8e8e8" : "#a4a8b0",
                        maxWidth: 110,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={label}
                    >
                      {label}
                    </div>
                  </div>
                </StepWrapper>
              </li>

              {/* Conector */}
              {i < steps.length - 1 && (
                <li aria-hidden="true" style={{ flex: 1, minWidth: 24 }}>
                  <div
                    style={{
                      position: "relative",
                      height: 4,
                      borderRadius: 999,
                      background: line,
                      overflow: "hidden",
                    }}
                  >
                    {/* progreso del conector */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: isComplete ? "100%" : isCurrent ? "50%" : "0%",
                        background: accent,
                        transition: "width .35s ease",
                      }}
                    />
                  </div>
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>

      {/* Ayuda visual en móviles */}
      <style>{`
        @media (max-width: 560px) {
          nav[aria-label="Progreso de compra"] ol {
            gap: 8px;
          }
          nav[aria-label="Progreso de compra"] ol li div:nth-child(1) > div:last-child {
            font-size: 12px;
            max-width: 80px;
          }
        }
      `}</style>
    </nav>
  );
}
