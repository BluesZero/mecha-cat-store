import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function ConfirmationStep({ user, shippingAddress }) {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("id", orderId)
        .single();

      if (error) {
        console.error("Error cargando el pedido:", error.message);
      } else {
        const formatted = {
          ...data,
          products: data.order_items.map((item) => ({
            id: item.products?.id,
            name: item.products?.name,
            image: item.products?.image,
            price: item.price,
            quantity: item.quantity,
          })),
        };
        setOrder(formatted);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (loading || !order)
    return <p style={{ color: "white", padding: "40px" }}>Cargando confirmación...</p>;

  return (
    <div style={{ color: "white", maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>🎉 ¡Gracias por tu compra!</h2>

      <div style={cardStyle}>
        <h3 style={sectionTitle}>Detalles del pedido</h3>
        <p><strong>ID del pedido:</strong> #{order.id.slice(-6).toUpperCase()}</p>
        <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
        <p><strong>Correo:</strong> {user?.email}</p>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitle}>Dirección de envío</h3>
        {shippingAddress ? (
          <>
            <p>{shippingAddress.street}</p>
            <p>{shippingAddress.city}, {shippingAddress.state}</p>
            <p>{shippingAddress.zip}, {shippingAddress.country}</p>
          </>
        ) : (
          <p style={{ color: "#aaa" }}>No se especificó una dirección de envío.</p>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitle}>Productos adquiridos</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {order.products.map((item) => (
            <li key={item.id} style={productItemStyle}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "64px", height: "64px", borderRadius: "8px", objectFit: "cover" }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>{item.name}</p>
                <p style={{ margin: 0, fontSize: "14px", color: "#ccc" }}>
                  x{item.quantity} – ${item.price.toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p style={{ marginTop: "30px", fontSize: "16px", color: "#8fff8f" }}>
        📧 Recibirás un correo con los detalles de tu compra.
      </p>
    </div>
  );
}

const cardStyle = {
  background: "#2a2f34",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
  marginBottom: "30px"
};

const sectionTitle = {
  marginBottom: "14px",
  fontSize: "18px",
  color: "#fff",
  borderBottom: "1px solid #444",
  paddingBottom: "6px"
};

const productItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "12px 0",
  borderBottom: "1px solid #333"
};
