// src/components/ProductSlider.jsx
import React from 'react';
import Slider from 'react-slick';
import ProductCard from './ProductCard';
import '../styles/styles.css';

// Flecha izquierda personalizada
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="slick-arrow slick-prev"
    style={{
      left: '10px',
      zIndex: 2,
      background: 'transparent',
      border: 'none',
      fontSize: '50px',
      color: '#F0F8FF',
      position: 'absolute',
      top: '45%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
    }}
  >
    ‹
  </button>
);

// Flecha derecha personalizada
const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="slick-arrow slick-next"
    style={{
      right: '10px',
      zIndex: 2,
      background: 'transparent',
      border: 'none',
      fontSize: '50px',
      color: '#F0F8FF',
      position: 'absolute',
      top: '45%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
    }}
  >
    ›
  </button>
);

export default function ProductSlider({ products, onAddToCart, onAddToFavorites, onProductClick }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToScroll: 1,
    arrows: true,
    variableWidth: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className="slider-wrapper">
      <div className="product-slider" style={{ overflowX: 'hidden' }}>
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.id} className="slider-slide">
              <div className="slider-inner">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onAddToFavorites={onAddToFavorites}
                  onClick={() => onProductClick(product)}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
