import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/styles.css";
import "../styles/loader.css"; // Asegúrate de tener este archivo

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
      <div className="checkout-container" style={{ padding: "60px", textAlign: "center" }}>
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="checkout-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 20px" }}>
      <h2 className="checkout-title" style={{ fontSize: "28px", color: "white", marginBottom: "20px" }}>
        Confirmación de pedido
      </h2>
      <p style={{ color: "#ccc", marginBottom: "8px" }}>
        <strong>ID del pedido:</strong> #{order.id.slice(-6).toUpperCase()}
      </p>
      <p style={{ color: "#ccc", marginBottom: "20px" }}>
        <strong>Total:</strong> ${order.total.toFixed(2)}
      </p>

      <h3 className="checkout-subtitle" style={{ color: "white", marginTop: "30px", marginBottom: "10px" }}>
        Productos incluidos:
      </h3>
      <ul className="checkout-product-list" style={{ listStyle: "none", padding: 0 }}>
        {order.products.map((item) => (
          <li key={item.id} className="checkout-product-item" style={{ marginBottom: "12px", color: "#ccc" }}>
            <strong style={{ color: "white" }}>{item.name}</strong> ×{item.quantity} – ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>

      <button
        className="buy-button"
        onClick={handleStripeCheckout}
        style={{
          marginTop: "40px",
          padding: "14px 28px",
          fontSize: "16px",
          backgroundColor: "#ff3881",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        💳 Pagar ahora con Stripe
      </button>
    </div>
  );
}
