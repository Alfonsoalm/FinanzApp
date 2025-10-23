import { Link } from 'react-router-dom';
import "./styles/errorPage.css";

export const ErrorPage = () => {
  return (
    <div className="error-container">
      <h1 className="error-title">404</h1>
      <p className="error-message">Page not found</p>
      <Link to="/" className="error-link">
        Go back to Home
      </Link>
    </div>
  );
};
