// src/components/Hero.jsx
import React from "react";
import Slider from "react-slick";
import "../styles/styles.css";

const banners = [
  {
    image: "/img/bna.png",
    alt: "Destined Rivals ya disponible",
    link: "/franchise/pokemon/expansions/destined-rivals/products",
  },
  {
    image: "/img/bna.png",
    alt: "Explora todos los productos Pokémon",
    link: "/franchise/pokemon/expansions/journey-together/products",
  },
  {
    image: "/img/bna.png",
    alt: "Booster Box de Journey Together",
    link: "/product/pk-boosterbox-journey-together",
  },
];

export default function Hero() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    pauseOnHover: false,
  };

  return (
    <section className="hero-slider" style={{ position: "relative", overflow: "hidden" }}>
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index} style={{ position: "relative" }}>
            <a href={banner.link} style={{ display: "block", position: "relative" }}>
              <img
                src={banner.image}
                alt={banner.alt}
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  objectFit: "cover",
                  filter: "brightness(0.9)",
                }}
              />
              <div style={{
                position: "absolute",
                bottom: "30px",
                left: "30px",
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "12px 20px",
                borderRadius: "10px",
                maxWidth: "60%",
                fontSize: "18px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
              }}>
                {banner.alt}
              </div>
            </a>
          </div>
        ))}
      </Slider>

    </section>
  );
}
