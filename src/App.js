import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabase";

import { useSupabaseData } from "./hooks/useSupabaseData";

import Header from "./components/Header";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import ProductDetail from "./components/ProductDetail";
import CartPage from "./components/CartPage";
import Account from "./components/Account/Account";
import Auth from "./components/Auth";
import AddProduct from "./components/AddProduct";
import ProductGrid from "./components/ProductGrid";
import FranchiseSelector from "./components/FranchiseSelector";
import ProductTypeSelector from "./components/ProductTypeSelector";
import ExpansionSelector from "./components/ExpansionSelector";
import "./styles/styles.css";

function App() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);

  const { data: rawProducts = [], loading, refetch } = useSupabaseData("products");

  const normalizeProduct = (p) => ({
    ...p,
    price: Number(p.price),
    originalPrice: Number(p.original_price),
    productTypeId: p.product_type_id,
    expansionId: p.expansion_id,
    franchiseId: p.franchise_id,
    image: p.image,
    images: p.images || [],
  });

  const products = rawProducts.map(normalizeProduct);

  // Cargar sesión activa desde Supabase
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(buildUser(data.user));
      }
    });
  }, []);

  const buildUser = (rawUser) => {
    const meta = rawUser.user_metadata || {};
    return {
      id: rawUser.id,
      email: rawUser.email,
      username: meta.username || "",
      isAdmin: meta.isAdmin || false,
      name: meta.name || "Sin nombre",
      lastname: meta.lastname || "Sin apellido",
      phone: meta.phone || "",
      orders: meta.orders || [],
      favorites: meta.favorites || [],
      address: meta.address || {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
      },
      joinedAt: rawUser.created_at
    };
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + (product.quantity || 1) }
            : p
        );
      } else {
        return [...prev, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const handleAddToFavorites = (product) => {
    if (!favorites.some((p) => p.id === product.id)) {
      setFavorites((prev) => [...prev, product]);
    }
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleLoginSuccess = (rawUser) => {
    setUser(buildUser(rawUser));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleProfileUpdate = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      setUser(buildUser(data.user));
    }
  };

  return (
    <Router>
      <div className="app">
        <div className="top-banner">
          <a href="/">¡Journey Together ya está aquí!</a>
        </div>

        <Header
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredProducts={filteredProducts}
        />

        <NavBar />

        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <p style={{ color: 'white', textAlign: 'center', padding: '60px' }}>
                  Cargando productos...
                </p>
              ) : (
                <HomePage
                  destinedRivals={products.filter((p) => p.expansionId === "destined-rivals")}
                  journeyTogether={products.filter((p) => p.expansionId === "journey-together")}
                  newArrivals={products.filter((p) => p.type === "newArrivals")}
                  specialOffers={products.filter((p) => p.discount === true)}
                  onAddToCart={handleAddToCart}
                  onAddToFavorites={handleAddToFavorites}
                  onProductClick={() => {}}
                />
              )
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProductDetail
                onAddToCart={handleAddToCart}
                onAddToFavorites={handleAddToFavorites}
              />
            }
          />

          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                onRemove={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            }
          />

          <Route
            path="/account"
            element={
              user ? (
                <Account
                  user={user}
                  onLogout={handleLogout}
                  onShowAddProduct={() => {}}
                  onProfileUpdate={handleProfileUpdate}
                />
              ) : (
                <Auth onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          <Route
            path="/admin/add"
            element={
              user?.isAdmin ? (
                <AddProduct onProductAdd={refetch} />
              ) : (
                <p style={{ color: "white", textAlign: "center", padding: "60px" }}>
                  No tienes acceso
                </p>
              )
            }
          />

          <Route
            path="/franchise/:franchiseId/expansions/:expansionId/products"
            element={<ProductGrid onAddToCart={handleAddToCart} />}
          />

          <Route
            path="/franchise/:franchiseId/product-types/:typeId/products"
            element={<ProductGrid onAddToCart={handleAddToCart} />}
          />

          <Route path="/explore" element={<FranchiseSelector />} />

          <Route
            path="/franchise/:franchiseId/product-types"
            element={<ProductTypeSelector />}
          />

          <Route
            path="/franchise/:franchiseId/expansions"
            element={<ExpansionSelector />}
          />

          <Route
            path="/account/addproduct"
            element={
              user ? (
                showAddProduct ? (
                  <AddProduct
                    onProductAdd={() => {
                      refetch();
                      setShowAddProduct(false);
                    }}
                  />
                ) : (
                  <Account
                    user={user}
                    onLogout={handleLogout}
                    onShowAddProduct={() => setShowAddProduct(true)}
                    onProfileUpdate={handleProfileUpdate}
                  />
                )
              ) : (
                <Auth onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
