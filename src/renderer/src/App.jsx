import { HashRouter as Router } from "react-router-dom";
import { Navbar } from "./layout/Navbar";
import { Routing } from "./router/Routing";
import { Header } from "./layout/Header";
import { FinanceManagerProvider } from "./context/FinanceManagerContext";
import "./styles/styles.css";
import "./styles/navbar.css";
import "./styles/pages/errorPage.css";
import "./styles/pages/incomesPage.css";
import "./styles/pages/expensesPage.css";
import "./styles/pages/projectionPage.css";

function App() {
  return (
    <FinanceManagerProvider>
      {/* Envuelve la aplicación con el contexto */}
      <Router>
        <div className="app">
          <Header className="header" />
          <Navbar className="navbar" />
          <div className="main">
            <Routing />
          </div>
        </div>
      </Router>
    </FinanceManagerProvider>
  );
}

export default App;
