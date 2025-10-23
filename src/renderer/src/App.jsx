import { HashRouter as Router } from "react-router-dom";
import { Navbar } from "./layout/components/Navbar";
import { Header } from "./layout/components/Header";
import { Routing } from "./router/Routing";
import { FinanceManagerProvider } from "./context/FinanceManagerContext";
import "./styles.css";

function App() {
  return (
    <FinanceManagerProvider>
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
