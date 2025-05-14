// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import ProductSlider from './ProductSlider';
import PromoCard from './PromoCard'; // Asegúrate de importarlo

import Footer from './Footer';
import '../styles/styles.css';

export default function HomePage({
  destinedRivals,
  journeyTogether,
  newArrivals,
  onAddToCart,
  onAddToFavorites,
  onProductClick
}) {
  return (
    <main>
      {/* Sección principal con imagen de fondo o banner visual */}
      
      <Hero/>
      {/* Slider: Productos destacados - Destined Rivals */}
      <section className="home-section" style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", marginBottom: "40px",  }}>
        <PromoCard image="/img/BBPC.png" alt="Explora Journey Together" link="/franchise/pokemon/expansions/journey-together/products" />
        <PromoCard image="/img/WFPC.png" alt="Explora Prismatic Evolutions" link="/franchise/pokemon/expansions/prismatic-evolutions/products" />
        <PromoCard image="/img/DRPC.png" alt="Ofertas especiales" link="/franchise/pokemon/product-types/sale/products" />
      </section>
      
      <section className="home-section ">
        <h2 className="section-title">| Destined Rivals |</h2>
        <ProductSlider
          products={destinedRivals}
          onAddToCart={onAddToCart}
          onAddToFavorites={onAddToFavorites}
          onProductClick={onProductClick}
        />
      </section>

      {/* Slider: Productos destacados - Journey Together */}
      <section className="home-section">
        <h2 className="section-title">| Journey Together |</h2>
        <ProductSlider
          products={journeyTogether}
          onAddToCart={onAddToCart}
          onAddToFavorites={onAddToFavorites}
          onProductClick={onProductClick}
        />
      </section>
      <Footer/>

    </main>
  );
}
