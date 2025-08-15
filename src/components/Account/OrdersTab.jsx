// src/components/Account/OrdersTab.jsx
import React, { useCallback, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function OrdersTab({ orders = [] }) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({}); // { [orderId]: { items:[], error:null } }
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  // Paginación ligera (no modifica tus queries)
  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, page]);

  const fmtDate = useMemo(
    () =>
      new Intl.DateTimeFormat("es-MX", { year: "numeric", month: "short", day: "numeric" }),
    []
  );
  const fmtMoney = useMemo(
    () => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }),
    []
  );

  const statusStyle = (status) => {
    const base = {
      padding: "2px 8px",
      borderRadius: "6px",
      fontSize: "13px",
      color: "white",
      display: "inline-block",
    };
    switch ((status || "").toLowerCase()) {
      case "enviado":
      case "completado":
        return { ...base, backgroundColor: "#28a745" };
      case "pendiente":
      case "procesando":
        return { ...base, backgroundColor: "#ffc107", color: "#1e1f26" };
      case "cancelado":
      case "fallido":
        return { ...base, backgroundColor: "#dc3545" };
      default:
        return { ...base, backgroundColor: "#007bff" };
    }
  };

  const fetchOrderDetails = useCallback(
    async (orderId) => {
      // evita refetch si ya existe
      if (orderDetails[orderId]?.items || loadingOrderId === orderId) return;

      setLoadingOrderId(orderId);
      try {
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select("id, quantity, price, product_id")
          .eq("order_id", orderId);

        if (itemsError || !items?.length) {
          setOrderDetails((prev) => ({
            ...prev,
            [orderId]: { items: [], error: itemsError ? itemsError.message : null },
          }));
          setLoadingOrderId(null);
          return;
        }

        const productIds = items.map((i) => i.product_id).filter(Boolean);
        let products = [];
        if (productIds.length > 0) {
          const { data: prods, error: productsError } = await supabase
            .from("products")
            .select("id, name, image")
            .in("id", productIds);

          if (productsError) {
            setOrderDetails((prev) => ({
              ...prev,
              [orderId]: { items: [], error: productsError.message },
            }));
            setLoadingOrderId(null);
            return;
          }
          products = prods || [];
        }

        const detailedItems = items.map((item) => {
          const product = products.find((p) => p.id === item.product_id);
          return {
            id: item.id,
            name: product?.name || "Producto no disponible",
            image: product?.image || "",
            quantity: item.quantity,
            price: item.price,
          };
        });

        setOrderDetails((prev) => ({ ...prev, [orderId]: { items: detailedItems, error: null } }));
      } catch (e) {
        setOrderDetails((prev) => ({
          ...prev,
          [orderId]: { items: [], error: "Error al cargar productos" },
        }));
      } finally {
        setLoadingOrderId(null);
      }
    },
    [orderDetails, loadingOrderId]
  );

  const toggleDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }
    setExpandedOrder(orderId);
    await fetchOrderDetails(orderId);
  };

  // Prefetch en hover para que el click sea instantáneo
  const prefetchDetails = (orderId) => {
    if (!orderDetails[orderId]?.items && loadingOrderId !== orderId) {
      fetchOrderDetails(orderId);
    }
  };

  return (
    <div aria-live="polite">
      <h2 style={{ marginBottom: "20px" }}>📦 Mis pedidos</h2>

      {orders.length === 0 ? (
        <p style={{ color: "#bbb" }}>No tienes pedidos aún.</p>
      ) : (
        <div style={{ border: "1px solid #444", borderRadius: "10px", overflow: "hidden" }}>
          {/* Header tabla */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto",
              padding: "12px 20px",
              backgroundColor: "#2a2f34",
              fontWeight: "bold",
              borderBottom: "1px solid #444",
              color: "#ccc",
            }}
          >
            <span>ID</span>
            <span>Fecha</span>
            <span>Total</span>
            <span>Estado</span>
            <span></span>
          </div>

          {/* Filas */}
          {paginated.map((order) => {
            const fullId = order.id || order.orderId;
            const shortId = fullId?.slice(-6)?.toUpperCase() || "—";
            const isExpanded = expandedOrder === fullId;
            const details = orderDetails[fullId];
            const isLoading = loadingOrderId === fullId;

            return (
              <div key={fullId} style={{ borderBottom: "1px solid #333" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto",
                    padding: "14px 20px",
                    alignItems: "center",
                    backgroundColor: "#1e1f26",
                    color: "white",
                    gap: 8,
                  }}
                >
                  <div title={fullId}>
                    <strong>#{shortId}</strong>
                  </div>
                  <div>{order.created_at ? fmtDate.format(new Date(order.created_at)) : "—"}</div>
                  <div>{Number.isFinite(order.total) ? fmtMoney.format(order.total) : "—"}</div>
                  <div>
                    <span style={statusStyle(order.status)}>{order.status || "—"}</span>
                  </div>

                  <button
                    onClick={() => toggleDetails(fullId)}
                    onMouseEnter={() => prefetchDetails(fullId)}
                    aria-expanded={isExpanded}
                    aria-controls={`order-items-${fullId}`}
                    style={{
                      background: "transparent",
                      color: "#ff3881",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      textAlign: "right",
                    }}
                  >
                    {isExpanded ? "Ocultar" : "Ver detalles"}
                  </button>
                </div>

                {/* Detalles */}
                {isExpanded && (
                  <div
                    id={`order-items-${fullId}`}
                    style={{ padding: "16px 30px", backgroundColor: "#262a30" }}
                  >
                    <p style={{ marginBottom: "10px", fontWeight: "bold", color: "white" }}>
                      Productos
                    </p>

                    {/* Estado de carga / error / lista */}
                    {isLoading ? (
                      <DetailsSkeleton />
                    ) : details?.error ? (
                      <p style={{ color: "#ff9aa2" }}>
                        No se pudieron cargar los productos. Intenta de nuevo.
                      </p>
                    ) : details?.items?.length > 0 ? (
                      <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                        {details.items.map((p) => (
                          <li
                            key={p.id}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "56px 1fr auto",
                              alignItems: "center",
                              gap: 12,
                              padding: "8px 0",
                              borderBottom: "1px solid #32363d",
                            }}
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 8,
                                background: "#1e1f26",
                              }}
                            />
                            <div>
                              <p style={{ margin: 0, fontWeight: "bold", color: "white" }}>
                                {p.name}
                              </p>
                              <p style={{ margin: 0, fontSize: 14, color: "#ccc" }}>
                                Cantidad: {p.quantity}
                              </p>
                            </div>
                            <div style={{ color: "#8fff8f", fontWeight: 700 }}>
                              {fmtMoney.format(p.price)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: "#ccc" }}>
                        No hay productos disponibles para este pedido.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Paginación */}
          {orders.length > PAGE_SIZE && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#1e1f26",
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={pagerBtn(page === 1)}
              >
                ← Anteriores
              </button>
              <span style={{ color: "#bbb", fontSize: 13 }}>
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={pagerBtn(page === totalPages)}
              >
                Siguientes →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* --------- Subcomponentes --------- */

function DetailsSkeleton() {
  return (
    <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <li
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "56px 1fr auto",
            alignItems: "center",
            gap: 12,
            padding: "8px 0",
            borderBottom: "1px solid #32363d",
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              background:
                "linear-gradient(90deg, #2d2e38 0%, #3a3b47 50%, #2d2e38 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.2s infinite",
            }}
          />
          <div style={{ width: "100%" }}>
            <div style={skLine(14, "60%")} />
            <div style={{ height: 6 }} />
            <div style={skLine(12, "35%")} />
          </div>
          <div style={skLine(14, 70)} />
        </li>
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </ul>
  );
}

const skLine = (h, w) => ({
  height: h,
  width: typeof w === "number" ? `${w}px` : w,
  borderRadius: 8,
  background: "linear-gradient(90deg, #2d2e38 0%, #3a3b47 50%, #2d2e38 100%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.2s infinite",
});

const pagerBtn = (disabled) => ({
  background: disabled ? "#2a2f34" : "#ff3881",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "10px",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: 700,
  opacity: disabled ? 0.6 : 1,
});
