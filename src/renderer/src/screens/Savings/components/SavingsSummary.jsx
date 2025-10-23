/* eslint-disable react/prop-types */
// components/SavingsPage/SavingsSummary.jsx

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

export const SavingsSummary = ({ averageNetBalance, remainingSavingsBalance }) => (
  <div className="average-net-balance">
    <p>
      <strong>Balance Neto Promedio:</strong>{" "}
      {formatCurrency(averageNetBalance)}
    </p>
    <p>
      <strong>Balance Restante para Ahorros:</strong>{" "}
      {formatCurrency(remainingSavingsBalance)}
    </p>
  </div>
);