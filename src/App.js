// Importación de dependencias principales
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Carga de datos iniciales
import productsData from "./data/products.json";

// Importación de componentes principales de UI y páginas
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
import ExpansionSelector from "./components/ExpansionSelector";
import "./styles/styles.css";

function App() {
  // Estado del carrito, favoritos, usuario, búsqueda y productos

  const [cart, setCart] = useState([]);                   // Lista de productos en el carrito de compras
  const [favorites, setFavorites] = useState([]);         // Lista de productos marcados como favoritos
  const [user, setUser] = useState(null);                 // Usuario autenticado (null si no ha iniciado sesión)
  const [searchQuery, setSearchQuery] = useState("");     // Texto actual del campo de búsqueda
  const [products, setProducts] = useState(productsData); // Lista de productos cargados desde el JSON
  

  // Recupera sesión guardada del usuario al montar el componente
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("mechacat_user"));
    if (savedUser) setUser(savedUser);
  }, []);

  // Filtra productos por nombre según el valor del input de búsqueda
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Agrega productos al carrito, acumulando cantidades si ya existen
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

  // Agrega producto a favoritos si aún no está incluido
  const handleAddToFavorites = (product) => {
    if (!favorites.some((p) => p.id === product.id)) {
      setFavorites((prev) => [...prev, product]);
    }
  };

  // Elimina un producto del carrito según su ID
  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  // Maneja inicio de sesión exitoso
  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
  };

  // Cierra sesión y limpia datos del usuario en localStorage
  const handleLogout = () => {
    localStorage.removeItem("mechacat_user");
    setUser(null);
  };

  // Componente principal envuelto en Router para habilitar navegación por rutas
  return (
    <Router>
      <div className="app">
        {/* Banner superior de anuncio */}
        <div className="top-banner">
          <a href="/">¡Journey Together ya está aquí!</a>
        </div>

        {/* Cabecera con buscador y contador de carrito */}
        <Header
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredProducts={filteredProducts}
        />

        {/* Barra de navegación principal */}
        <NavBar />

        {/* Rutas de la aplicación */}
        <Routes>

          {/* Página principal con sliders por expansión */}
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

          {/* Detalle de producto individual */}
          <Route
            path="/product/:id"
            element={
              <ProductDetail
                onAddToCart={handleAddToCart}
                onAddToFavorites={handleAddToFavorites}
              />
            }
          />

          {/* Página de carrito */}
          <Route
            path="/cart"
            element={
              <CartPage cart={cart} onRemove={handleRemoveFromCart} />
            }
          />

          {/* Página de cuenta o login según estado de sesión */}
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

          {/* Página para agregar productos (acceso administrativo) */}
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

          {/* Grid de productos filtrado por expansión */}
          <Route
            path="/franchise/:franchiseId/expansions/:expansionId/products"
            element={<ProductGrid onAddToCart={handleAddToCart} />}
          />

          {/* Grid de productos filtrado por tipo */}
          <Route
            path="/franchise/:franchiseId/product-types/:typeId/products"
            element={<ProductGrid onAddToCart={handleAddToCart} />}
          />

          {/* Explorador general de franquicias */}
          <Route
            path="/explore"
            element={<FranchiseSelector />}
          />

          {/* Selector de tipos de producto dentro de una franquicia */}
          <Route
            path="/franchise/:franchiseId/product-types"
            element={<ProductTypeSelector />}
          />

          <Route
            path="/franchise/:franchiseId/expansions"
            element={<ExpansionSelector />}
          />

        </Routes>


      </div>
    </Router>
  );
}

export default App;
