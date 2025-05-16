// src/components/HomePage.jsx
import React from 'react';
import Hero from './Hero';
import ProductSlider from './ProductSlider';
import PromoCard from './PromoCard';
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
  // Filtro para ofertas
  const saleProducts = newArrivals.filter(p => p.discount === true);

  return (
    <main className="page-fade">
      {/* Hero con banners */}
      <Hero />

      {/* Promocionales destacados */}
      <h2 className="section-title">| Ultimas Expansiones |</h2>
      <section
        className="home-section"
        style={{
          display: "flex",
          gap: "24px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "40px"
        }}
      >
        
        <PromoCard
          image="/img/DRPC.png"
          alt="Ofertas especiales"
          link="/franchise/pokemon/product-types/sale/products"
        />
        <PromoCard
          image="/img/JTPC.png"
          alt="Explora Journey Together"
          link="/franchise/pokemon/expansions/journey-together/products"
        />
        <PromoCard
          image="/img/PEPC.png"
          alt="Explora Prismatic Evolutions"
          link="/franchise/pokemon/expansions/prismatic-evolutions/products"
        />

      </section>

      {/* Slider: Ofertas */}
      {saleProducts.length > 0 && (
        <section className="home-section">
          <h2 className="section-title">| Ofertas Especiales |</h2>
          <ProductSlider
            products={saleProducts}
            onAddToCart={onAddToCart}
            onAddToFavorites={onAddToFavorites}
            onProductClick={onProductClick}
          />
        </section>
      )}

      {/* Slider: Destined Rivals */}
      <section className="home-section">
        <h2 className="section-title">| Destined Rivals |</h2>
        <ProductSlider
          products={destinedRivals}
          onAddToCart={onAddToCart}
          onAddToFavorites={onAddToFavorites}
          onProductClick={onProductClick}
        />
      </section>

      {/* Slider: Journey Together */}
      <section className="home-section">
        <h2 className="section-title">| Journey Together |</h2>
        <ProductSlider
          products={journeyTogether}
          onAddToCart={onAddToCart}
          onAddToFavorites={onAddToFavorites}
          onProductClick={onProductClick}
        />
      </section>

      <Footer />
    </main>
  );
}
