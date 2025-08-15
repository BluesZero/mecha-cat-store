// src/components/HomePage.jsx
import React, { useMemo } from 'react';
import Hero from './Hero';
import ProductSlider from './ProductSlider';
import PromoCard from './PromoCard';
import Footer from './Footer';
import '../styles/styles.css';

export default function HomePage({
  destinedRivals = [],
  journeyTogether = [],
  newArrivals = [],
  onAddToCart,
  onAddToFavorites,
  onProductClick
}) {
  // Filtro para ofertas (memoizado)
  const saleProducts = useMemo(
    () => newArrivals.filter((p) => p?.discount === true),
    [newArrivals]
  );

  return (
    <main className="page-fade " aria-live="polite">
      {/* Hero con banners */}
      <Hero />

      {/* Promocionales destacados */}
      <h2 id="home-expansions" className="section-title">| Últimas Expansiones |</h2>
      <section
        className="home-section"
        aria-labelledby="home-expansions"
        style={{
          display: "flex",
          gap: "24px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "40px"
        }}
      >
        <PromoCard
          image="/img/MEEV.png"
          alt="Ofertas especiales"
          link="/franchise/pokemon/product-types/sale/products"
        />
        <PromoCard
          image="/img/BBWF.png"
          alt="Explora Journey Together"
          link="/franchise/pokemon/expansions/journey-together/products"
        />
        <PromoCard
          image="/img/DERI.png"
          alt="Explora Prismatic Evolutions"
          link="/franchise/pokemon/expansions/prismatic-evolutions/products"
        />
      </section>

      {/* Slider: Ofertas */}
      {saleProducts.length > 0 && (
        <section className="home-section" aria-labelledby="home-sales">
          <h2 id="home-sales" className="section-title">| Ofertas Especiales |</h2>
          <ProductSlider
            products={saleProducts}
            onAddToCart={onAddToCart}
            onAddToFavorites={onAddToFavorites}
            onProductClick={onProductClick}
          />
        </section>
      )}

      {/* Slider: Destined Rivals */}
      {destinedRivals.length > 0 && (
        <section className="home-section" aria-labelledby="home-destined">
          <h2 id="home-destined" className="section-title">| Destined Rivals |</h2>
          <ProductSlider
            products={destinedRivals}
            onAddToCart={onAddToCart}
            onAddToFavorites={onAddToFavorites}
            onProductClick={onProductClick}
          />
        </section>
      )}

      {/* Slider: Journey Together */}
      {journeyTogether.length > 0 && (
        <section className="home-section" aria-labelledby="home-journey">
          <h2 id="home-journey" className="section-title">| Journey Together |</h2>
          <ProductSlider
            products={journeyTogether}
            onAddToCart={onAddToCart}
            onAddToFavorites={onAddToFavorites}
            onProductClick={onProductClick}
          />
        </section>
      )}

      <Footer />
    </main>
  );
}
