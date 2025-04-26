// components/CartPage.jsx
import React from "react";
import "../styles/styles.css";

export default function CartPage({ cart, onRemove }) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 99;
  const total = subtotal + shipping;

  return (
    <div>
    <h2 className="section-title" >Resumen del pedido</h2>
    
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between' }}>
        {/* Tabla de productos */}
        <div style={{ flex: '1 1 700px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #888' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Producto</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Cantidad</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Precio</th>
                <th style={{ padding: '12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={item.image || item.images?.[0]} alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }} />
                    <span>{item.name}</span>
                  </td>
                  <td style={{ padding: '12px' }}>{item.quantity}</td>
                  <td style={{ padding: '12px' }}>${item.price * item.quantity}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button onClick={() => onRemove(item.id)} style={{ background: 'none', border: 'none', color: '#ff3881', fontSize: '20px', cursor: 'pointer' }} title="Eliminar">x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen */}
        <div style={{ flex: '0 1 280px', backgroundColor: '#2a2f34', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '22px', color: 'white' }}>Resumen del pedido</h3>
          <p style={{ color: '#ccc', marginBottom: '10px' }}>Subtotal: <strong>${subtotal.toFixed(2)}</strong></p>
          <p style={{ color: '#ccc', marginBottom: '10px' }}>Envío: <strong>${shipping.toFixed(2)}</strong></p>
          <hr style={{ margin: '20px 0', borderColor: '#444' }} />
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Total: ${total.toFixed(2)}</p>
          <button className="buy-button" style={{ marginTop: '20px', width: '100%' }}>Finalizar compra</button>
        </div>
      </div>
    </div>
    </div>
  );
}
