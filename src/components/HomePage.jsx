// src/components/HomePage.jsx
import React from 'react';
import Hero from './Hero';
import ProductSlider from './ProductSlider';
import '../styles/styles.css';
import { Link } from 'react-router-dom';

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
      {/* Banner visual */}
      <Hero />

      {/* Slider: Productos de la expansión Destined Rivals */}
      <section className="home-section">
        <h2 className="section-title">| Destined Rivals |</h2>
        <ProductSlider
          products={destinedRivals}
          onAddToCart={onAddToCart}
          onAddToFavorites={onAddToFavorites}
          onProductClick={onProductClick}
        />
      </section>

            {/* Slider: Productos de la expansión Destined Rivals */}
      <section className="home-section">
        <h2 className="section-title">| Journey Together |</h2>
        <ProductSlider
          products={journeyTogether}
          onAddToCart={onAddToCart}
          onAddToFavorites={onAddToFavorites}
          onProductClick={onProductClick}
        />
      </section>
      <section className="home-section">
        <h2 className="section-title">| Explorar |</h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to={`/franchise/pokemon/expansions/destined-rivals/products`}
            style={{ background: '#2d2e38', color: 'white', padding: '12px 20px', borderRadius: '10px', textDecoration: 'none' }}
          >
            Ver productos de Destined Rivals
          </Link>

          <Link
            to={`/franchise/pokemon/product-types/etb/products`}
            style={{ background: '#2d2e38', color: 'white', padding: '12px 20px', borderRadius: '10px', textDecoration: 'none' }}
          >
            Ver Elite Trainer Boxes
          </Link>
        </div>
      </section>

      {/* Slider: Recién llegados */}
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
