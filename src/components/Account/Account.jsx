// components/Account/Account.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import AddressesTab from "./AddressesTab";

export default function Account({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const authUser = authData?.user;

      if (!authUser) {
        onLogout?.();
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      const { data: addr } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", authUser.id)
        .eq("is_default", true)
        .single();

      const { data: userOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });

      setUser({ ...authUser, ...profile });
      setAddress(addr || null);
      setOrders(userOrders || []);
      setLoading(false);
    };

    loadUserData();
  }, []);

  const refreshProfile = async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: addr } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .single();

    setUser((prev) => ({ ...prev, ...profile }));
    setAddress(addr || null);
  };

  if (loading || !user) {
    return <p style={{ padding: "40px", color: "white" }}>Cargando cuenta...</p>;
  }

  const navButton = (label, tab, icon) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        background: activeTab === tab ? "#ff3881" : "transparent",
        border: "none",
        color: "white",
        padding: "12px 20px",
        textAlign: "left",
        width: "100%",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1e1f26, #2a2f34)",
      color: "white",
      padding: "40px 20px"
    }}>
      <div style={{ display: "flex", gap: "40px", maxWidth: "1200px", width: "100%" }}>
        {/* Sidebar */}
        <aside style={{
          width: "260px",
          background: "#292d33",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)"
        }}>
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ marginBottom: "6px" }}>{user.name} {user.lastname}</h3>
            <p style={{ fontSize: "13px", color: "#ccc" }}>{user.email}</p>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {navButton("Mi perfil", "profile", "👤")}
            {navButton("Favoritos", "favorites", "❤️")}
            {navButton("Pedidos", "orders", "📦")}
            {navButton("Direcciones", "addresses", "🏠")}
            {navButton("Configuración", "settings", "⚙️")}
            <hr style={{ borderColor: "#444", margin: "12px 0" }} />
            <button
              onClick={onLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "tomato",
                fontWeight: "bold",
                cursor: "pointer",
                padding: "10px 0"
              }}
            >
              🚪 Cerrar sesión
            </button>
          </nav>

          {user?.is_admin && (
            <button
              onClick={() => navigate("/admin/add")}
              style={{
                marginTop: "20px",
                background: "#ff3881",
                border: "none",
                color: "white",
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              ➕ Registrar producto
            </button>
          )}
        </aside>

        {/* Main content */}
        <main style={{
          flex: 1,
          background: "#292d33",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)"
        }}>
          {activeTab === "profile" && (
            <ProfileTab user={user} address={address} onProfileUpdate={refreshProfile} />
          )}
          {activeTab === "orders" && (
            <OrdersTab orders={orders} />
          )}
          {activeTab === "addresses" && (
            <AddressesTab userId={user.id} />
          )}
        </main>
      </div>
    </div>
  );
}
