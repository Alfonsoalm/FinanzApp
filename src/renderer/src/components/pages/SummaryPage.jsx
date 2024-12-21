import { useContext, useEffect, useState } from "react";
import "../../styles/pages/summaryPage.css";
import { FinanceManagerContext } from "../../context/FinanceManagerContext";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

export const SummaryPage = () => {
  const { incomes, expenses, savings, getIncomes, getExpenses, getSavings } =
    useContext(FinanceManagerContext);
  const [range, setRange] = useState(3); // Estado para controlar el rango temporal (últimos meses)
  const [selectedMonth, setSelectedMonth] = useState("2024-12");

  useEffect(() => {
    getIncomes();
    getExpenses();
    getSavings();
  }, [getIncomes, getExpenses, getSavings]);

  // Helper to calculate totals for each month
  const calculateTotals = (data) => {
    const monthlyData = {};

    data.forEach((item) => {
      const startDate = new Date(item.date);
      const startMonthKey = startDate.toISOString().slice(0, 7);

      if (item.type === "recurrent") {
        // Populate all months from startMonthKey onward
        const currentDate = new Date();
        let tempDate = new Date(startDate);
        while (tempDate <= currentDate) {
          const monthKey = tempDate.toISOString().slice(0, 7);
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = 0;
          }
          monthlyData[monthKey] += parseFloat(item.amount);
          tempDate.setMonth(tempDate.getMonth() + 1);
        }
      } else if (item.type === "one-time") {
        // Only populate the specific month
        if (!monthlyData[startMonthKey]) {
          monthlyData[startMonthKey] = 0;
        }
        monthlyData[startMonthKey] += parseFloat(item.amount);
      }
    });

    return monthlyData;
  };

  const calculateSavingsWithInterest = (savings) => {
    const savingsWithInterest = {};
    const currentDate = new Date();

    savings.forEach((saving) => {
      const startDate = new Date(saving.date);
      const startMonthKey = startDate.toISOString().slice(0, 7);
      let accumulatedAmount = parseFloat(saving.amount);

      let tempDate = new Date(startDate);
      while (tempDate <= currentDate) {
        const monthKey = tempDate.toISOString().slice(0, 7);
        if (!savingsWithInterest[monthKey]) {
          savingsWithInterest[monthKey] = 0;
        }

        // Add the accumulated amount to the current month
        savingsWithInterest[monthKey] += accumulatedAmount;

        // Apply interest for the next month
        const monthlyInterestRate = (saving.interest_rate || 0) / 100 / 12;
        accumulatedAmount += accumulatedAmount * monthlyInterestRate;

        tempDate.setMonth(tempDate.getMonth() + 1);
      }
    });

    return savingsWithInterest;
  };

  const incomesByMonth = calculateTotals(incomes);
  const expensesByMonth = calculateTotals(expenses);
  const savingsWithInterest = calculateSavingsWithInterest(savings);

  const totalSavings = Object.values(savingsWithInterest).reduce((sum, value) => sum + value, 0);

  // Combine data for all months
  const months = Array.from(
    new Set([...Object.keys(incomesByMonth), ...Object.keys(expensesByMonth), ...Object.keys(savingsWithInterest)])
  ).sort();

  // Filter months based on the selected range
  const filteredMonths = months.slice(-range);

  const monthlyData = filteredMonths.map((month) => {
    const income = incomesByMonth[month] || 0;
    const expense = expensesByMonth[month] || 0;
    const saving = savingsWithInterest[month] || 0;

    return {
      month,
      income,
      expense,
      saving,
      net: income - expense, // Net balance: incomes - expenses
    };
  });

  // Pie chart data (specific to the selected month)
  const pieData = {
    labels: ["Ingresos", "Gastos"],
    datasets: [
      {
        data: [
          incomesByMonth[selectedMonth] || 0,
          expensesByMonth[selectedMonth] || 0,
        ],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  // Line chart data
  const lineData = {
    labels: monthlyData.map((data) => data.month),
    datasets: [
      {
        label: "Ingresos (€)",
        data: monthlyData.map((data) => data.income),
        borderColor: "#4caf50",
        backgroundColor: "#4caf5050",
        fill: true,
      },
      {
        label: "Gastos (€)",
        data: monthlyData.map((data) => data.expense),
        borderColor: "#f44336",
        backgroundColor: "#f4433650",
        fill: true,
      },
      {
        label: "Ahorros (€)",
        data: monthlyData.map((data) => data.saving),
        borderColor: "#ff9800",
        backgroundColor: "#ff980050",
        fill: true,
      },
      {
        label: "Balance (€)",
        data: monthlyData.map((data) => data.net),
        borderColor: "#2196f3",
        backgroundColor: "#2196f350",
        fill: true,
      },
    ],
  };

  return (
    <div className="summary-page">
      <h2>Resumen</h2>

      {/* Filtro de mes */}
      <div className="month-filter">
        <label htmlFor="month">Seleccionar mes:</label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="summary-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="data-container" style={{ width: '60%' }}>
          <div className="savings-card">
            <h3>Ingresos totales este mes</h3>
            <p>{new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(incomesByMonth[selectedMonth] || 0)}</p>
          </div>
          <div className="savings-card">
            <h3>Gastos totales este mes</h3>
            <p>{new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(expensesByMonth[selectedMonth] || 0)}</p>
          </div>
          <div className="savings-card">
            <h3>Balance neto este mes</h3>
            <p>{new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format((incomesByMonth[selectedMonth] || 0) - (expensesByMonth[selectedMonth] || 0))}</p>
          </div>
        </div>
        <div className="chart-container" style={{ width: '35%' }}>
          <Pie data={pieData} options={{ animation: false }} />
        </div>
      </div>

      <div className="savings-total-container" style={{ marginTop: '20px', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
        <h3>Ahorros totales históricos</h3>
        <p>{new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(totalSavings)}</p>
      </div>

      {/* Range Filter Buttons */}
      <div className="filter-buttons">
        <button onClick={() => setRange(3)} className={range === 3 ? "active" : ""}>
          Últimos 3 Meses
        </button>
        <button onClick={() => setRange(5)} className={range === 5 ? "active" : ""}>
          Últimos 5 Meses
        </button>
        <button onClick={() => setRange(12)} className={range === 12 ? "active" : ""}>
          Últimos 12 Meses
        </button>
      </div>

      {/* Line Chart */}
      <div className="line-chart-container">
        <h3>Temporal Trends</h3>
        <Line data={lineData} options={{ animation: false }} />
      </div>
    </div>
  );
};
