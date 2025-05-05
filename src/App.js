import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import productsData from "./data/products.json";

import Header from "./components/Header";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import ProductDetail from "./components/ProductDetail";
import CartPage from "./components/CartPage";
import Account from "./components/Account";
import Auth from "./components/Auth";
import AddProduct from "./components/AddProduct";
import ProductGrid from "./components/ProductGrid";
import FranchiseSelector from "./components/FranchiseSelector";
import ProductTypeSelector from "./components/ProductTypeSelector";
import "./styles/styles.css";

function App() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(productsData);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("mechacat_user"));
    if (savedUser) setUser(savedUser);
  }, []);

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

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("mechacat_user");
    setUser(null);
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
              <HomePage
                destinedRivals={products.filter((p) => p.expansionId === "destined-rivals")}
                journeyTogether={products.filter((p) => p.expansionId === "journey-together")}
                newArrivals={products.filter((p) => p.type === "newArrivals")}
                onAddToCart={handleAddToCart}
                onAddToFavorites={handleAddToFavorites}
                onProductClick={() => {}}
              />
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
              <CartPage cart={cart} onRemove={handleRemoveFromCart} />
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
                />
              ) : (
                <Auth onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          <Route
            path="/admin/add"
            element={
              <AddProduct
                onProductAdd={(newProduct) =>
                  setProducts((prev) => [...prev, newProduct])
                }
              />
            }
          />

          {/* NUEVAS RUTAS DE GRID */}
          <Route
            path="/franchise/:franchiseId/expansions/:expansionId/products"
            element={<ProductGrid onAddToCart={handleAddToCart} />}
          />
          <Route
            path="/franchise/:franchiseId/product-types/:typeId/products"
            element={<ProductGrid onAddToCart={handleAddToCart} />}
          />

          {/* NUEVO SELECTOR DE FRANQUICIAS */}
          <Route
            path="/explore"
            element={<FranchiseSelector />}
          />

          {/* NUEVO SELECTOR DE TIPOS DE PRODUCTO */}
          <Route
            path="/franchise/:franchiseId/product-types"
            element={<ProductTypeSelector />}
          />
        </Routes>

        <footer>
          <p>&copy; 2025 Meka Cat Store. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
