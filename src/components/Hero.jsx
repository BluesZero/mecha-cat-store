// src/components/Hero.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "../styles/styles.css";

const banners = [
  {
    image: "/img/bna.png",
    alt: "Destined Rivals ya disponible",
    link: "/franchise/pokemon/expansions/destined-rivals/products",
    headline: "Destined Rivals",
    sub: "Consigue la expansión más esperada",
    cta: "Ver expansión",
  },
  {
    image: "/img/bna2.png",
    alt: "White Flare y Black Bolt a la vuelta",
    link: "/franchise/pokemon/expansions/journey-together/products",
    headline: "White Flare • Black Bolt",
    sub: "Prepara tu mazo para lo que viene",
    cta: "Explorar productos",
  },
  {
    image: "/img/bna.png",
    alt: "Booster Box de Journey Together",
    link: "/product/pk-boosterbox-journey-together",
    headline: "Journey Together",
    sub: "Booster Box disponible",
    cta: "Comprar ahora",
  },
];

export default function Hero() {
  const settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: false,
      fade: true,
      pauseOnHover: true,
      pauseOnDotsHover: true,
      accessibility: true,
      lazyLoad: "ondemand",
      cssEase: "ease-in-out",
      dotsClass: "slick-dots slick-dots-hero",
    }),
    []
  );

  return (
    <section
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Promociones principales"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Slider {...settings}>
        {banners.map((b, i) => (
          <div key={i} style={{ position: "relative" }}>
            <Link to={b.link} style={{ display: "block", position: "relative" }} aria-label={b.alt}>
              {/* Imagen */}
              <img
                src={b.image}
                alt={b.alt}
                loading={i === 0 ? "eager" : "lazy"}
                style={{
                  width: "100%",
                  height: "min(60vw, 600px)",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Gradiente para legibilidad */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.65) 100%)",
                }}
              />

              {/* Copy + CTA */}
              <div
                style={{
                  position: "absolute",
                  left: "clamp(16px, 4vw, 40px)",
                  bottom: "clamp(16px, 4vw, 40px)",
                  color: "white",
                  maxWidth: "min(90%, 820px)",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "clamp(22px, 5vw, 40px)",
                    lineHeight: 1.1,
                    letterSpacing: ".2px",
                    textShadow: "0 2px 12px rgba(0,0,0,.5)",
                  }}
                >
                  {b.headline || b.alt}
                </h2>
                {(b.sub || "").length > 0 && (
                  <p
                    style={{
                      margin: "8px 0 14px",
                      fontSize: "clamp(14px, 2.6vw, 18px)",
                      color: "rgba(255,255,255,.92)",
                      textShadow: "0 2px 10px rgba(0,0,0,.45)",
                    }}
                  >
                    {b.sub}
                  </p>
                )}
                <span
                  className="hero-cta"
                  style={{
                    display: "inline-block",
                    background: "#ff3881",
                    color: "white",
                    padding: "10px 16px",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: "clamp(13px, 2.2vw, 15px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,.35)",
                  }}
                >
                  {b.cta || "Ver más"}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </Slider>

      {/* Estilos de puntos y accesibilidad de foco */}
      <style>{`
        .slick-dots-hero {
          bottom: 12px;
        }
        .slick-dots-hero li button:before {
          color: #fff;
          opacity: .5;
          font-size: 10px;
        }
        .slick-dots-hero li.slick-active button:before {
          opacity: 1;
          color: #ff3881;
        }
        .hero-cta:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 3px;
        }
        @media (max-width: 640px) {
          .slick-dots-hero { bottom: 6px; }
        }
      `}</style>
    </section>
  );
}
