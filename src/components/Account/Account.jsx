// components/Account/Account.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import AddressesTab from "./AddressesTab";
import "../../styles/loader.css";

export default function Account({ onLogout }) {
  const navigate = useNavigate();

  // Persistimos el tab activo entre visitas
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("account_tab") || "profile"
  );
  useEffect(() => localStorage.setItem("account_tab", activeTab), [activeTab]);

  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    onLogout?.();
  }, [onLogout]);

  const loadUserData = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      const authUser = authData?.user;
      if (!authUser) {
        await handleLogout();
        return;
      }

      const [profileRes, addrRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", authUser.id).single(),
        supabase
          .from("addresses")
          .select("*")
          .eq("user_id", authUser.id)
          .eq("is_default", true)
          .single(),
        supabase
          .from("orders")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false }),
      ]);

      if (profileRes.error) throw profileRes.error;
      if (ordersRes.error) throw ordersRes.error;
      // addrRes puede venir sin registro; no lo tratamos como error
      setUser({ ...authUser, ...profileRes.data });
      setAddress(addrRes.data || null);
      setOrders(ordersRes.data || []);
    } catch (e) {
      console.error(e);
      setErr("No se pudo cargar tu cuenta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Refreshes granulares para usar desde tabs
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    const [{ data: profile }, { data: addr }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_default", true)
        .single(),
    ]);
    setUser((prev) => ({ ...prev, ...(profile || {}) }));
    setAddress(addr || null);
  }, [user?.id]);

  const refreshOrders = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setOrders(data || []);
  }, [user?.id]);

  // Realtime: si cambian perfiles/direcciones/pedidos del usuario, refrescamos
  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase
      .channel("account-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
        refreshProfile
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "addresses", filter: `user_id=eq.${user.id}` },
        refreshProfile
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` },
        refreshOrders
      )
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, [user?.id, refreshProfile, refreshOrders]);

  const NavButton = ({ label, tab, icon }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className="account-nav-btn"
        aria-current={isActive ? "page" : undefined}
        style={{
          background: isActive ? "#ff3881" : "transparent",
          border: "1px solid " + (isActive ? "#ff3881" : "#3a3f45"),
          color: "white",
          padding: "12px 16px",
          textAlign: "left",
          width: "100%",
          borderRadius: "10px",
          fontWeight: 700,
          cursor: "pointer",
          transition: "all .2s ease",
        }}
      >
        <span style={{ marginRight: 8 }}>{icon}</span>
        {label}
      </button>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #1e1f26, #2a2f34)",
        }}
      >
        <div className="loader" />
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg, #1e1f26, #2a2f34)",
          color: "white",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ marginBottom: 12 }}>{err || "Sesión no disponible."}</p>
          <button className="buy-button" onClick={() => navigate("/auth")}>
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="account-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e1f26, #2a2f34)",
        color: "white",
        padding: "36px 20px",
      }}
    >
      <div
        className="account-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "28px",
          maxWidth: 1200,
          width: "100%",
        }}
      >
        {/* Sidebar */}
        <aside
          className="account-sidebar"
          style={{
            background: "#292d33",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            height: "fit-content",
            position: "sticky",
            top: 20,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>
              {user.name} {user.lastname}
            </h3>
            <p style={{ fontSize: 13, color: "#ccc", marginTop: 6 }}>{user.email}</p>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <NavButton label="Mi perfil" tab="profile" icon="👤" />
            <NavButton label="Favoritos" tab="favorites" icon="❤️" />
            <NavButton label="Pedidos" tab="orders" icon="📦" />
            <NavButton label="Direcciones" tab="addresses" icon="🏠" />
            <NavButton label="Configuración" tab="settings" icon="⚙️" />
            <hr style={{ borderColor: "#444", margin: "12px 0" }} />
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "tomato",
                fontWeight: 700,
                cursor: "pointer",
                padding: "10px 0",
                textAlign: "left",
              }}
            >
              🚪 Cerrar sesión
            </button>
          </nav>

          {(user?.is_admin || user?.isAdmin) && (
            <button
              onClick={() => navigate("/admin/add")}
              style={{
                marginTop: 18,
                background: "#ff3881",
                border: "none",
                color: "white",
                padding: "10px 16px",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 700,
                width: "100%",
              }}
            >
              ➕ Registrar producto
            </button>
          )}
        </aside>

        {/* Main */}
        <main
          className="account-main"
          style={{
            background: "#292d33",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            minHeight: 420,
          }}
        >
          {err && (
            <div
              style={{
                background: "#3a3f45",
                color: "#ffe1e1",
                padding: "10px 12px",
                borderRadius: 10,
                marginBottom: 16,
                fontSize: 14,
              }}
            >
              {err}{" "}
              <button
                onClick={loadUserData}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#8fff8f",
                  cursor: "pointer",
                  fontWeight: 700,
                  marginLeft: 6,
                }}
              >
                Reintentar
              </button>
            </div>
          )}

          {activeTab === "profile" && (
            <ProfileTab user={user} address={address} onProfileUpdate={refreshProfile} />
          )}
          {activeTab === "orders" && <OrdersTab orders={orders} onRefresh={refreshOrders} />}
          {activeTab === "addresses" && <AddressesTab userId={user.id} onChange={refreshProfile} />}
          {activeTab === "favorites" && (
            <p style={{ color: "#ccc" }}>Pronto podrás ver y gestionar tus favoritos aquí.</p>
          )}
          {activeTab === "settings" && (
            <p style={{ color: "#ccc" }}>
              Configuración de cuenta en construcción. ¿Qué te gustaría ajustar primero?
            </p>
          )}
        </main>
      </div>

      {/* Responsive helpers */}
      <style>{`
        @media (max-width: 980px) {
          .account-layout { grid-template-columns: 1fr; }
          .account-sidebar { position: static; order: 2; }
          .account-main { order: 1; }
        }
      `}</style>
    </div>
  );
}
