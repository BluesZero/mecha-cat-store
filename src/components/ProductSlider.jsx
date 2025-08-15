// src/components/ProductSlider.jsx
import React, { useMemo } from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import "../styles/styles.css";

// Para accesibilidad (texto solo para lectores de pantalla)
const srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

// Flecha izquierda personalizada
const CustomPrevArrow = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="slick-arrow slick-prev"
    aria-label="Anterior"
    style={{
      left: 6,
      zIndex: 5,
      background: "transparent",
      border: "none",
      fontSize: 44,
      color: "#F0F8FF",
      position: "absolute",
      top: "45%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      lineHeight: 1,
      padding: 8,
    }}
  >
    ‹<span style={srOnly}>Anterior</span>
  </button>
);

// Flecha derecha personalizada
const CustomNextArrow = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="slick-arrow slick-next"
    aria-label="Siguiente"
    style={{
      right: 6,
      zIndex: 5,
      background: "transparent",
      border: "none",
      fontSize: 44,
      color: "#F0F8FF",
      position: "absolute",
      top: "45%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      lineHeight: 1,
      padding: 8,
    }}
  >
    ›<span style={srOnly}>Siguiente</span>
  </button>
);

export default function ProductSlider({
  products = [],
  onAddToCart,
  onAddToFavorites,
  onProductClick,
}) {
  const slidesBase = 5;

  const settings = useMemo(
    () => ({
      dots: false,
      infinite: products.length > slidesBase,
      speed: 450,
      cssEase: "ease-in-out",
      slidesToShow: slidesBase,
      slidesToScroll: 1,
      arrows: true,
      swipeToSlide: true,
      draggable: true,
      touchThreshold: 12,
      edgeFriction: 0.18,
      pauseOnHover: true,
      accessibility: true,
      lazyLoad: "ondemand",
      prevArrow: <CustomPrevArrow />,
      nextArrow: <CustomNextArrow />,
      responsive: [
        { breakpoint: 1536, settings: { slidesToShow: 5 } },
        { breakpoint: 1280, settings: { slidesToShow: 4 } },
        { breakpoint: 1024, settings: { slidesToShow: 3 } },
        { breakpoint: 768, settings: { slidesToShow: 2 } },
        { breakpoint: 520, settings: { slidesToShow: 1 } },
      ],
    }),
    [products.length]
  );

  if (!products || products.length === 0) {
    return (
      <div
        className="slider-viewport"
        style={{ padding: "20px 0", textAlign: "center", color: "#ccc" }}
        aria-live="polite"
      >
        No hay productos para mostrar.
      </div>
    );
  }

  const handleCaptureClick = (product) => {
    onProductClick && onProductClick(product);
  };

  return (
    <div
      className="slider-viewport"
      style={{ padding: "20px 0", position: "relative" }}
      aria-live="polite"
    >
      <div className="slider-wrapper">
        {/* Máscara: recorta bordes izq/der para ocultar clones,
            pero deja aire vertical para el hover */}
        <div
          className="slider-mask"
          style={{
            overflow: "hidden",          // recorte horizontal
            paddingTop: 18,              // aire superior para el lift
            paddingBottom: 26,           // aire inferior para sombras/botones
            position: "relative",
            // Desvanecimiento sutil en bordes (si el navegador lo soporta)
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, #000 24px, #000 calc(100% - 24px), transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0, #000 24px, #000 calc(100% - 24px), transparent 100%)",
          }}
        >
          <div className="product-slider">
            <Slider {...settings}>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="slider-slide"
                  onClickCapture={() => handleCaptureClick(product)}
                >
                  <div className="slider-inner">
                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart}
                      onAddToFavorites={onAddToFavorites}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}
