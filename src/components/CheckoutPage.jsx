import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/styles.css"; // Asegúrate de tener tus variables de color aquí

export default function CheckoutPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const authUser = authData?.user;
      setUser(authUser);

      const { data: orderData, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("id", orderId)
        .single();

      if (error) {
        console.error("Error cargando pedido:", error.message);
        return;
      }

      const formatted = {
        ...orderData,
        products: orderData.order_items.map((item) => ({
          id: item.products?.id,
          name: item.products?.name,
          image: item.products?.image,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      setOrder(formatted);
      setLoading(false);
    };

    fetchData();
  }, [orderId]);

  const handleStripeCheckout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          items: order.products,
          email: user?.email,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe error:", data);
        alert("Error al crear sesión de pago");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("No se pudo conectar con el servidor de pagos");
    }
  };

  if (loading || !order) {
    return (
      <div className="checkout-container">
        <p className="loading-text">Cargando pedido...</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Confirmación de pedido</h2>
      <p><strong>ID del pedido:</strong> #{order.id.slice(-6).toUpperCase()}</p>
      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>

      <h3 className="checkout-subtitle">Productos:</h3>
      <ul className="checkout-product-list">
        {order.products.map((item) => (
          <li key={item.id} className="checkout-product-item">
            <strong>{item.name}</strong> x{item.quantity} – ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>

      <button className="buy-button" onClick={handleStripeCheckout}>
        Pagar ahora con Stripe
      </button>
    </div>
  );
}
