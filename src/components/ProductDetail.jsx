// components/ProductDetail.jsx
import React, { useState } from "react";
import "../styles/styles.css";

export default function ProductDetail({ product, onAddToCart, onAddToFavorites }) {
  const images = product?.images || [product?.image];
  const [mainImage, setMainImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart({ ...product, quantity });
  };

  const openSlider = (index) => {
    setSliderIndex(index);
    setShowSlider(true);
  };

  const closeSlider = () => setShowSlider(false);

  const nextSlide = () => setSliderIndex((sliderIndex + 1) % images.length);
  const prevSlide = () => setSliderIndex((sliderIndex - 1 + images.length) % images.length);

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '1300px' }}>
      {showSlider && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          flexDirection: 'column'
        }}>
          <button onClick={closeSlider} style={{ position: 'absolute', top: 20, right: 20, background: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>✕</button>
          <img src={images[sliderIndex]} alt="slider" style={{ maxWidth: '90%', maxHeight: '80vh', borderRadius: '10px' }} />
          <div style={{ marginTop: '20px' }}>
            <button onClick={prevSlide} style={{ marginRight: '20px', fontSize: '18px', padding: '10px', cursor: 'pointer' }}>←</button>
            <button onClick={nextSlide} style={{ fontSize: '18px', padding: '10px', cursor: 'pointer' }}>→</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Breadcrumb en fila completa */}
        <div style={{ flexBasis: '100%', marginBottom: '30px' }}>
          <div style={{padding: '10px 14px', borderRadius: '10px', display: 'inline-block', fontSize: '14px', color: '#ccc', backgroundColor: '#1e1f26' }}>
            Inicio &gt; Pokémon &gt; Colección &gt; Elite Trainer Box &gt; <strong style={{ color: 'white' }}>{product.name}</strong>
          </div>
        </div>

        {/* Thumbnails + Imagen principal */}
        <div style={{ display: 'flex', gap: '20px', flex: '0 0 600px', maxWidth: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`extra-${i}`}
                onClick={() => setMainImage(img)}
                style={{
                  width: '75px',
                  height: '75px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: mainImage === img ? '3px solid #ff3881' : '2px solid #555',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={mainImage}
              alt={product.name}
              onClick={() => openSlider(images.indexOf(mainImage))}
              style={{
                width: '100%',
                maxWidth: '450px',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                cursor: 'zoom-in'
              }}
            />
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 className="product-name" style={{ fontSize: '28px', marginBottom: '10px' }}>{product.name}</h2>
          <p className="product-price" style={{ fontSize: '22px', marginBottom: '12px', color: '#8fff8f' }}>${product.price} MXN</p>

          <div style={{ background: '#2a2f34', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <p style={{ color: '#ccc', marginBottom: '8px' }}>Lanzamiento estimado: <strong style={{ color: 'white' }}>30 de mayo de 2025</strong></p>
            <p style={{ color: '#ccc' }}>Recibe puntos de recompensa con esta compra.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
          {/* reemplaza el input + botones de cantidad en ProductDetail.jsx*/}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#2a2f34',
              borderRadius: '8px',
              padding: '6px 12px'
            }}>
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8fff8f',
                  fontSize: '22px',
                  cursor: 'pointer'
                }}
              >−</button>

              <span style={{ color: 'white', fontSize: '16px', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>

              <button
                onClick={() => setQuantity(prev => prev + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8fff8f',
                  fontSize: '22px',
                  cursor: 'pointer'
                }}
              >＋</button>
            </div>
            
            <button className="buy-button" onClick={handleAdd} style={{ padding: '12px 20px', fontSize: '16px' }}>Agregar al carrito</button>
            <button className="buy-button" onClick={() => onAddToFavorites(product)} style={{ padding: '12px 20px', fontSize: '16px' }}>❤</button>
          </div>

          <div style={{ background: '#1e1f26', padding: '16px', borderRadius: '10px' }}>
          <h4 style={{ color: 'white', marginBottom: '10px' }}>Métodos de Pago</h4>
          <p style={{ color: '#ccc', marginBottom: '12px' }}>Aceptamos pagos con tarjeta, transferencia y más.</p>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <img src="/img/mastercard.svg" alt="Mastercard" style={{ height: '30px' }} />
            <img src="/img/visa.svg" alt="Visa" style={{ height: '30px' }} />
            <img src="/img/amex.svg" alt="Amex" style={{ height: '30px' }} />
            <img src="/img/paypal.svg" alt="PayPal" style={{ height: '30px' }} />
          </div>

          </div>

          <div style={{ marginTop: '60px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '22px' }}>Descripción</h3>
            <p style={{ color: '#ccc', fontSize: '16px', lineHeight: 1.6 }}>
              La caja de colección incluye cartas especiales como Garchomp ex de Cynthia, Ho-Oh ex de Ethan,
              Metagross ex de Steven, y Mewtwo ex del Team Rocket. Cada booster contiene múltiples cartas para enriquecer tu colección y estrategia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}