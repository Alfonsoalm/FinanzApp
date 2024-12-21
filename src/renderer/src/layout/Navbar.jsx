import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css'; // Ruta actualizada

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar">
      {/* Botón para ir atrás */}
      {location.pathname !== '/' && (
        <button className="navbar-back-button" onClick={() => navigate(-1)}>
          Atrás
        </button>
      )}

      {/* Enlaces de navegación */}
      <div className="navbar-links">
        <Link to="/incomes" className="navbar-link">Ingresos</Link>
        <Link to="/expenses" className="navbar-link">Gastos</Link>
        <Link to="/savings" className="navbar-link">Ahorros</Link>
        <Link to="/projection" className="navbar-link">Proyección</Link>
      </div>
    </nav>
  );
};
