/* eslint-disable react/prop-types */
// components/SummaryPage/SummaryCards.jsx
import { FaArrowUp, FaArrowDown, FaBalanceScale } from "react-icons/fa";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

export const SummaryCards = ({ totalIncome, totalExpense, netBalance }) => (
  <div className="data-container">
    <div className="card">
      <div className="card-header" style={{ color: "#2e7d32" }}>
        <FaArrowUp /> <h3>Ingresos totales este mes</h3>
      </div>
      <span className="total">{formatCurrency(totalIncome)}</span>
    </div>

    <div className="card">
      <div className="card-header" style={{ color: "#f44336" }}>
        <FaArrowDown /> <h3>Gastos totales este mes</h3>
      </div>
      <span className="total">{formatCurrency(totalExpense)}</span>
    </div>

    <div className="card">
      <div className="card-header" style={{ color: "#2196f3" }}>
        <FaBalanceScale /> <h3>Balance neto este mes</h3>
      </div>
      <span className="total">{formatCurrency(netBalance)}</span>
    </div>
  </div>
);