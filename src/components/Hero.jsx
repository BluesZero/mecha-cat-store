// src/components/Hero.jsx
import React from "react";
import Slider from "react-slick";
import "../styles/styles.css";

const banners = [
  {
    image: "/img/bak2.png",
    alt: "Destined Rivals ya disponible",
    link: "/franchise/pokemon/expansions/destined-rivals/products",
  },
  {
    image: "/img/JT.png",
    alt: "Explora todos los productos Pokémon",
    link: "/franchise/pokemon/product-types",
  },
  {
    image: "/img/PE.png",
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
  };

  return (
    <section className="hero-slider">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <a key={index} href={banner.link}>
            <img
              src={banner.image}
              alt={banner.alt}
              style={{
                width: "100%",
                maxHeight: "600px",
                objectFit: "cover",
              }}
            />
          </a>
        ))}
      </Slider>
    </section>
  );
}
