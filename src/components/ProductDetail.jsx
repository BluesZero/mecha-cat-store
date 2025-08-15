// src/components/ProductDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSupabaseData } from "../hooks/useSupabaseData";
import { useToast } from "./ui/useToast";
import "../styles/styles.css";

export default function ProductDetail({ onAddToCart, onAddToFavorites }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: products = [], loading } = useSupabaseData("products");

  // Producto y datos derivados
  const product = products.find((p) => p.id === id);
  const price = Number(product?.price ?? 0);
  const originalPrice = Number(product?.originalPrice ?? product?.original_price ?? 0);
  const hasDiscount = Boolean(product?.discount && originalPrice > price);
  const isPreorder = Boolean(product?.preorder);
  const stock = typeof product?.stock === "number" ? product.stock : undefined;
  const isSoldOut = stock === 0;

  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length) return product.images;
    return product.image ? [product.image] : [];
  }, [product]);

  // Estado UI
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  // Sync imagen principal
  useEffect(() => {
    if (images.length) {
      setMainImage(images[0]);
      setSliderIndex(0);
    } else {
      setMainImage(null);
    }
  }, [images]);

  // Formateo MXN
  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 2,
      }),
    []
  );

  // Handlers
  const handleAdd = () => {
    if (!product) return;
    const qty = Math.max(1, Math.min(quantity, stock ?? quantity));
    onAddToCart?.({ ...product, quantity: qty });

    addToast({
      type: "success",
      icon: "🛒",
      title: "Agregado al carrito",
      description: `${product.name} · x${qty}`,
      actionLabel: "Ver carrito",
      onAction: () => navigate("/checkout/summary"),
      duration: 2600,
    });
  };

  const openSlider = (index) => {
    setSliderIndex(index);
    setShowSlider(true);
  };
  const closeSlider = () => setShowSlider(false);
  const nextSlide = () => setSliderIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setSliderIndex((prev) => (prev - 1 + images.length) % images.length);

  /* -------------------- Loading / Not found -------------------- */
  if (loading) {
    return (
      <section style={{ padding: "60px 20px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            background: "#1e1f26",
            border: "1px solid #2c3139",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div className="pd-skel-header skeleton-line" />
          <div className="pd-skel-row">
            <div className="skeleton-block" />
            <div className="pd-skel-right">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          </div>
        </div>

        {/* Skeleton CSS local para 3 líneas */}
        <style>{`
          .skeleton-line{
            height: 16px;
            border-radius: 8px;
            background: linear-gradient(90deg, #2a2f34 25%, #343a44 37%, #2a2f34 63%);
            background-size: 400% 100%;
            animation: skel 1.2s ease-in-out infinite;
            margin-bottom: 12px;
          }
          .pd-skel-header{ width: 40%; max-width: 300px; }
          .pd-skel-row{
            display: grid;
            grid-template-columns: 520px 1fr;
            gap: 28px;
            margin-top: 22px;
          }
          .skeleton-block{
            width: 100%;
            height: 420px;
            border-radius: 14px;
            background: linear-gradient(90deg, #2a2f34 25%, #343a44 37%, #2a2f34 63%);
            background-size: 400% 100%;
            animation: skel 1.2s ease-in-out infinite;
          }
          .pd-skel-right .skeleton-line:nth-child(1){ width: 80%; height: 24px; }
          .pd-skel-right .skeleton-line:nth-child(2){ width: 60%; height: 18px; }
          .pd-skel-right .skeleton-line:nth-child(3){ width: 90%; height: 18px; }
          @keyframes skel{ 0%{background-position: 100% 0} 100%{background-position: 0 0} }
          @media (max-width: 980px){
            .pd-skel-row{ grid-template-columns: 1fr; }
            .skeleton-block{ height: 300px; }
          }
        `}</style>
      </section>
    );
  }

  if (!product) {
    return <p style={{ color: "#ccc", padding: "40px" }}>Producto no encontrado</p>;
  }

  /* -------------------- UI principal -------------------- */
  return (
    <div className="container" style={{ padding: "60px 20px", maxWidth: "1300px" }}>
      {/* Overlay del slider */}
      {showSlider && images.length > 0 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            flexDirection: "column",
          }}
        >
          <button
            onClick={closeSlider}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "none",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
            }}
            aria-label="Cerrar galería"
          >
            ✕
          </button>
          <img
            src={images[sliderIndex]}
            alt="Vista de producto"
            style={{ maxWidth: "90%", maxHeight: "80vh", borderRadius: "10px" }}
          />
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={prevSlide}
              style={{ marginRight: "20px", fontSize: "18px", padding: "10px", cursor: "pointer" }}
              aria-label="Imagen anterior"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              style={{ fontSize: "18px", padding: "10px", cursor: "pointer" }}
              aria-label="Imagen siguiente"
            >
              →
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Breadcrumb simple */}
        <div style={{ flexBasis: "100%", marginBottom: "30px" }}>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              display: "inline-block",
              fontSize: "14px",
              color: "#ccc",
              backgroundColor: "#1e1f26",
            }}
          >
            Inicio &gt; Pokémon &gt; Colección &gt;{" "}
            <strong style={{ color: "white" }}>{product.name}</strong>
          </div>
        </div>

        {/* Galería */}
        <div style={{ display: "flex", gap: "20px", flex: "0 0 600px", maxWidth: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Miniatura ${i + 1}`}
                onClick={() => setMainImage(img)}
                style={{
                  width: "75px",
                  height: "75px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: mainImage === img ? "3px solid #ff3881" : "2px solid #555",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            {isPreorder && !isSoldOut && (
              <span
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  zIndex: 3,
                }}
              >
                Preventa
              </span>
            )}

            {mainImage && (
              <img
                src={mainImage}
                alt={product.name}
                onClick={() => openSlider(images.indexOf(mainImage))}
                style={{
                  width: "100%",
                  maxWidth: "450px",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "16px",
                  cursor: "zoom-in",
                }}
              />
            )}
          </div>
        </div>

        {/* Detalle */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h1 className="product-name" style={{ fontSize: "clamp(22px,2.8vw,32px)", marginBottom: "10px" }}>
            {product.name}
          </h1>

          <div style={{ fontSize: "22px", marginBottom: "12px", color: "#8fff8f", display: "flex", gap: 10, alignItems: "baseline" }}>
            {hasDiscount && (
              <span style={{ textDecoration: "line-through", color: "#888" }}>
                {fmt.format(originalPrice)}
              </span>
            )}
            <strong style={{ color: "#8fff8f" }}>{fmt.format(price)}</strong>
            {typeof stock === "number" && (
              <span style={{ color: isSoldOut ? "#ffb3bd" : "#aab2bd", fontSize: 14 }}>
                {isSoldOut ? "Agotado" : `Stock: ${stock}`}
              </span>
            )}
          </div>

          <div
            style={{
              background: "#2a2f34",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <p style={{ color: "#ccc", marginBottom: "8px" }}>
              Lanzamiento estimado: <strong style={{ color: "white" }}>30 de mayo de 2025</strong>
            </p>
            <p style={{ color: "#ccc", margin: 0 }}>Recibe puntos de recompensa con esta compra.</p>
          </div>

          {/* Controles de compra */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "30px", flexWrap: "wrap" }}>
            <div
              aria-label="Selector de cantidad"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#2a2f34",
                borderRadius: "8px",
                padding: "6px 12px",
              }}
            >
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                style={{
                  background: "none",
                  border: "none",
                  color: "#8fff8f",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span style={{ color: "white", fontSize: "16px", minWidth: "20px", textAlign: "center" }}>
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((prev) => {
                    const next = prev + 1;
                    return typeof stock === "number" ? Math.min(next, stock) : next;
                  })
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "#8fff8f",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
                aria-label="Aumentar cantidad"
              >
                ＋
              </button>
            </div>

            <button
              className="buy-button"
              onClick={handleAdd}
              disabled={isSoldOut}
              style={{
                padding: "12px 20px",
                fontSize: "16px",
                backgroundColor: isSoldOut ? "#777" : "#ff3881",
                cursor: isSoldOut ? "not-allowed" : "pointer",
                fontWeight: "700",
                fontFamily: "var(--font-app, 'Orbitron', system-ui, sans-serif)",
              }}
            >
              {isSoldOut ? "Producto agotado" : "Agregar al carrito"}
            </button>

            <button
              className="buy-button"
              onClick={() => onAddToFavorites?.(product)}
              style={{
                padding: "12px 20px",
                fontSize: "16px",
                background: "#313640",
                fontFamily: "var(--font-app, 'Orbitron', system-ui, sans-serif)",
              }}
              aria-label="Agregar a favoritos"
            >
              ❤
            </button>
          </div>

          {/* Métodos de pago */}
          <div style={{ background: "#1e1f26", padding: "16px", borderRadius: "10px" }}>
            <h4 style={{ color: "white", marginBottom: "10px" }}>Métodos de Pago</h4>
            <p style={{ color: "#ccc", marginBottom: "12px" }}>
              Aceptamos pagos con tarjeta, transferencia y más.
            </p>
            <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
              <img src="/img/mastercard.svg" alt="Mastercard" style={{ height: "30px" }} />
              <img src="/img/visa.svg" alt="Visa" style={{ height: "30px" }} />
              <img src="/img/amex.svg" alt="American Express" style={{ height: "30px" }} />
              <img src="/img/paypal.svg" alt="PayPal" style={{ height: "30px" }} />
            </div>
          </div>

          {/* Descripción */}
          <div style={{ marginTop: "60px" }}>
            <h3 style={{ color: "white", marginBottom: "15px", fontSize: "22px" }}>Descripción</h3>
            <p style={{ color: "#ccc", fontSize: "16px", lineHeight: 1.6 }}>
              La caja de colección incluye cartas especiales como Garchomp ex de Cynthia, Ho-Oh ex de Ethan,
              Metagross ex de Steven, y Mewtwo ex del Team Rocket. Cada booster contiene múltiples cartas
              para enriquecer tu colección y estrategia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
