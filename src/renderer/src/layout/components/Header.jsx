import '../styles/header.css'; // Ruta actualizada

export const Header = () => {
  return (
    <header className="header">
      {/* Nombre del proyecto */}
        <h1 className="header-title">
        FinanzApp
        </h1>
      {/* Botones de Login y Logout */}
        <div className="header-actions">
            <button className="header-button">Login</button>
            <button className="header-button">Logout</button>
        </div>
    </header>
  );
};
