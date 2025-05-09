// components/AddProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import franchises from "../data/franchises.json";
import collections from "../data/collections.json";
import expansions from "../data/expansions.json";
import productTypes from "../data/productTypes.json";

export default function AddProduct({ onProductAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    franchiseId: "",
    collectionId: "",
    expansionId: "",
    productTypeId: "",
    name: "",
    price: "",
    image: "",
    description: "",
    stock: 0,
    limitPerCustomer: 1,
    preorder: false,
    releaseDate: "",
    available: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const generateId = () => {
    return `${form.franchiseId}-${form.productTypeId}-${form.expansionId}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: generateId(),
      franchiseId: form.franchiseId,
      collectionId: form.collectionId,
      expansionId: form.expansionId,
      productTypeId: form.productTypeId,
      name: form.name,
      price: parseFloat(form.price),
      images: [form.image],
      description: form.description,
      stock: parseInt(form.stock),
      limitPerCustomer: parseInt(form.limitPerCustomer),
      preorder: form.preorder,
      available: form.available,
      releaseDate: form.releaseDate,
      tags: [form.name, form.productTypeId, form.expansionId]
    };
    console.log("Producto agregado:", newProduct);
    onProductAdd?.(newProduct);
    navigate("/account");
  };

  const filteredCollections = collections.filter(col => col.franchiseId === form.franchiseId);
  const filteredExpansions = expansions.filter(exp => exp.collectionId === form.collectionId);
  const filteredProductTypes = productTypes.filter(type => type.franchiseId === form.franchiseId);

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "600px", background: "#2a2f34", padding: "24px", borderRadius: "12px" }}>
        <button
          onClick={() => navigate("/account")}
          style={{
            marginBottom: "20px",
            backgroundColor: "#3b3e47",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            transition: "background-color 0.3s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4b4f5c"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3b3e47"}
        >
          ← Volver a cuenta
        </button>

        <h2 style={{ color: "white", marginBottom: "20px", textAlign: "center" }}>Registrar nuevo producto</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <select name="franchiseId" value={form.franchiseId} onChange={handleChange} style={inputStyle}>
            <option value="">Seleccionar franquicia</option>
            {franchises.map(fr => <option key={fr.id} value={fr.id}>{fr.name}</option>)}
          </select>

          <select name="collectionId" value={form.collectionId} onChange={handleChange} style={inputStyle}>
            <option value="">Seleccionar colección</option>
            {filteredCollections.map(col => <option key={col.id} value={col.id}>{col.name}</option>)}
          </select>

          <select name="expansionId" value={form.expansionId} onChange={handleChange} style={inputStyle}>
            <option value="">Seleccionar expansión</option>
            {filteredExpansions.map(exp => <option key={exp.id} value={exp.id}>{exp.name}</option>)}
          </select>

          <select name="productTypeId" value={form.productTypeId} onChange={handleChange} style={inputStyle}>
            <option value="">Seleccionar tipo de producto</option>
            {filteredProductTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
          </select>

          <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} style={inputStyle} />
          <input name="price" type="number" placeholder="Precio" value={form.price} onChange={handleChange} style={inputStyle} />
          <input name="image" placeholder="Nombre de imagen (ej: producto.webp)" value={form.image} onChange={handleChange} style={inputStyle} />
          <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} rows="3" style={inputStyle} />

          <div style={{ marginTop: "8px" }}>
            <label style={{ color: "#bbb", fontSize: "14px", marginBottom: "6px", display: "block" }}>
              Inventario y límites
            </label>
            <input name="stock" type="number" placeholder="Stock disponible" value={form.stock} onChange={handleChange} style={inputStyle} />
            <input name="limitPerCustomer" type="number" placeholder="Límite por cliente" value={form.limitPerCustomer} onChange={handleChange} style={inputStyle} />
          </div>

          <input name="releaseDate" type="date" placeholder="Fecha de lanzamiento" value={form.releaseDate} onChange={handleChange} style={inputStyle} />

          <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "white", marginBottom: "8px", fontWeight: "500", fontSize: "15px" }}>
            <input type="checkbox" name="preorder" checked={form.preorder} onChange={handleChange} style={{ transform: "scale(1.2)", accentColor: "#ff3881" }} />
            Preventa
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "white", marginBottom: "20px", fontWeight: "500", fontSize: "15px" }}>
            <input type="checkbox" name="available" checked={form.available} onChange={handleChange} style={{ transform: "scale(1.2)", accentColor: "#ff3881" }} />
            Disponible
          </label>

          <button type="submit" className="buy-button" style={{ width: "100%", padding: "12px" }}>
            Agregar producto
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#1e1f26",
  color: "white",
  fontSize: "15px",
  marginBottom: "0px",
  outline: "none",
  transition: "border 0.3s, box-shadow 0.3s"
};
