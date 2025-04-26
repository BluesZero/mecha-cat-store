// App.jsx
import React, { useState, useEffect } from "react";
import productsData from "./data/products.json";
import ProductList from "./components/ProductList";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import CartPage from "./components/CartPage";
import ProductDetail from "./components/ProductDetail";
import Auth from "./components/Auth";
import Account from "./components/Account";
import AddProduct from "./components/AddProduct";
import "./styles/styles.css";

function App() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [showAccount, setShowAccount] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(productsData);
  const [showAddProduct, setShowAddProduct] = useState(false);


  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("mechacat_user"));
    if (savedUser) setUser(savedUser);
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + (product.quantity || 1) } : p
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

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowCart(false);
    setShowAccount(false);
    setShowLogin(false);
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("mechacat_user");
    setUser(null);
    setShowAccount(false);
  };

  const resetView = () => {
    setShowCart(false);
    setShowAccount(false);
    setShowLogin(false);
    setSelectedProduct(null);
    setShowAddProduct(false);
  };

  const handleCartClick = () => {
    resetView();
    setShowCart(true);
  };
  
  const handleAccountClick = () => {
    resetView();
    user ? setShowAccount(true) : setShowLogin(true);
  };

  const handleHomeClick = () => {
    resetView();
  };
  
  return (
    <div className="app">
      <div className="top-banner">
        <a href="#" onClick={handleHomeClick}>¡Journey Together ya está aquí!</a>
      </div>
      <Header
        onCartClick={handleCartClick}
        onAccountClick={handleAccountClick}
        onHomeClick={handleHomeClick}
        cartCount={totalItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredProducts={filteredProducts}
        handleProductClick={handleProductClick}
      />

      <NavBar onHomeClick={handleHomeClick} />

      {showAddProduct ? (
        <AddProduct
          onProductAdd={(newProduct) => setProducts(prev => [...prev, newProduct])}
        />
      ) : showLogin ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : showCart ? (
        <CartPage cart={cart} onRemove={handleRemoveFromCart} />
      ) : showAccount ? (
        <Account user={user} onLogout={handleLogout} onShowAddProduct={() => {
          setShowAddProduct(true);
          setShowAccount(false);
        }} />
        
      ) : selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          onAddToFavorites={handleAddToFavorites}
        />
      ) : (
        <>
          <Hero />
          <h2 className="section-title">| Recien Llegados |</h2>
          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleAddToFavorites}
            onProductClick={handleProductClick}
          />
        </>
      )}

      <footer>
        <p>&copy; 2025 Mecha Cat Store. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;