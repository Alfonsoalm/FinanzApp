import { Link } from 'react-router-dom';
import '../styles/navbar.css'; // Ruta actualizada

export const Navbar = () => {

  return (
    <nav className="navbar">

      {/* Enlaces de navegación */}
      <div className="navbar-links">
        <Link to="/incomes" className="navbar-link">Ingresos</Link>
        <Link to="/expenses" className="navbar-link">Gastos</Link>
        <Link to="/savings" className="navbar-link">Ahorros</Link>
        <Link to="/summary" className="navbar-link">Resumen</Link>
        <Link to="/projection" className="navbar-link">Proyección</Link>
      </div>
    </nav>
  );
};
