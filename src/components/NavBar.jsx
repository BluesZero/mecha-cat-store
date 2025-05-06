import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="main-nav">
      <Link to="/">Inicio</Link>
      <Link to="/franchise/pokemon/expansions/journey-together/products">Journey Together</Link>
      <Link to="/franchise/pokemon/product-types">Productos Pokémon</Link>
      <Link to="/franchise/pokemon/expansions">Expansiones Pokémon</Link>
      <Link to="/explore">Otros TCG</Link> {/* Puedes actualizar cuando tengas data de Digimon, etc. */}
      <Link to="/franchise/pokemon/product-types/preorder/products">Preventas</Link>  {/* Puedes implementar filtro por "preorder": true */}
      <Link to="/franchise/pokemon/product-types/sale/products">Ofertas</Link>    {/* Puedes usar tags o campo "discount": true */}
      <Link to="#">Mis pedidos</Link> {/* Ruta privada futura */}
    </nav>
  );
}
