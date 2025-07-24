import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function OrdersTab({ orders = [] }) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  const toggleDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    setExpandedOrder(orderId);

    if (!orderDetails[orderId]) {
      setLoadingOrderId(orderId);

      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select("id, quantity, price, product_id")
        .eq("order_id", orderId);

      if (itemsError || !items) {
        console.error("Error al cargar items:", itemsError?.message);
        setOrderDetails((prev) => ({ ...prev, [orderId]: [] }));
        setLoadingOrderId(null);
        return;
      }

      const productIds = items.map((item) => item.product_id);

      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name, image")
        .in("id", productIds);

      if (productsError || !products) {
        console.error("Error al cargar productos:", productsError?.message);
        setOrderDetails((prev) => ({ ...prev, [orderId]: [] }));
        setLoadingOrderId(null);
        return;
      }

      const detailedItems = items.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return {
          id: item.id,
          name: product?.name || "Producto no disponible",
          image: product?.image || "",
          quantity: item.quantity,
          price: item.price
        };
      });

      setOrderDetails((prev) => ({ ...prev, [orderId]: detailedItems }));
      setLoadingOrderId(null);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>📦 Mis pedidos</h2>

      {orders.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <div style={{ border: "1px solid #444", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto",
            padding: "12px 20px",
            backgroundColor: "#2a2f34",
            fontWeight: "bold",
            borderBottom: "1px solid #444",
            color: "#ccc"
          }}>
            <span>ID</span>
            <span>Fecha</span>
            <span>Total</span>
            <span>Estado</span>
            <span></span>
          </div>

          {orders.map((order) => {
            const fullId = order.id || order.orderId;
            const shortId = fullId?.slice(-6).toUpperCase();
            const isExpanded = expandedOrder === fullId;
            const products = orderDetails[fullId];

            return (
              <div key={fullId} style={{ borderBottom: "1px solid #333" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto",
                  padding: "14px 20px",
                  alignItems: "center",
                  backgroundColor: "#1e1f26",
                  color: "white"
                }}>
                  <div title={fullId}><strong>#{shortId}</strong></div>
                  <div>{new Date(order.created_at).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}</div>
                  <div>${order.total.toFixed(2)}</div>
                  <div>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      backgroundColor:
                        order.status === "Enviado" ? "#28a745" :
                        order.status === "Pendiente" ? "#ffc107" :
                        "#007bff"
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleDetails(fullId)}
                    style={{
                      background: "transparent",
                      color: "#ff3881",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    {isExpanded ? "Ocultar" : "Ver detalles"}
                  </button>
                </div>

                {isExpanded && (
                  <div style={{ padding: "16px 30px", backgroundColor: "#262a30" }}>
                    <p style={{ marginBottom: "10px", fontWeight: "bold" }}>Productos:</p>
                    {loadingOrderId === fullId ? (
                      <p style={{ color: "#ccc" }}>Cargando productos...</p>
                    ) : products && products.length > 0 ? (
                      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                        {products.map((p) => (
                          <li key={p.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px", marginRight: "12px" }}
                            />
                            <div>
                              <p style={{ margin: 0, fontWeight: "bold" }}>{p.name}</p>
                              <p style={{ margin: 0, fontSize: "14px", color: "#ccc" }}>
                                Cantidad: {p.quantity} | Precio: ${p.price.toFixed(2)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: "#ccc" }}>No hay productos disponibles para este pedido.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
