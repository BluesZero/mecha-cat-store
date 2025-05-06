// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import ProductSlider from './ProductSlider';
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
      <Hero />

      {/* Slider: Productos destacados - Destined Rivals */}
      <section className="home-section">
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

      {/* Botones de navegación para explorar otras secciones 
      <section className="home-section">
        <h2 className="section-title">| Explorar |</h2>
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            to="/franchise/pokemon/expansions/destined-rivals/products"
            className="explore-button"
          >
            Ver productos de Destined Rivals
          </Link>

          <Link
            to="/franchise/pokemon/product-types/etb/products"
            className="explore-button"
          >
            Ver Elite Trainer Boxes
          </Link>
        </div>
      </section>*/}

      {/* Slider: Productos nuevos o recientemente añadidos */}
      <section className="home-section">
        <h2 className="section-title">| Recién Llegados |</h2>
        <ProductSlider
          products={newArrivals}
          onAddToCart={onAddToCart}
          onAddToFavorites={onAddToFavorites}
          onProductClick={onProductClick}
        />
      </section>
    </main>
  );
}
