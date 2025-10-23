// components/SummaryPage/SummaryPage.jsx
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from "chart.js";
import { useFinanceSummary } from "./hooks/useFinanceSummary";
import { ExportControls } from "./components/ExportControls";
import { SummaryCards } from "./components/SummaryCards";
import { PieChart } from "./components/PieChart";
import { LineChart } from "./components/LineChart";
import "./styles/summaryPage.css";

// Registro de ChartJS (mantener aquí o en el punto de entrada de la aplicación)
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
  // 1. Usar el Custom Hook para obtener toda la lógica y datos
  const {
    range, setRange,
    selectedYear, setSelectedYear,
    selectedMonthOnly, setSelectedMonthOnly,
    totalIncome, totalExpense, netBalance,
    yearlyIncomeTotal, yearlyExpenseTotal, yearlySavingsTotal, yearlyNetBalance,
    incomes, expenses, savings,
    pieData, lineData,
  } = useFinanceSummary();

  // 2. Agrupar los datos necesarios para la exportación
  const exportData = {
    incomes,
    expenses,
    savings,
    yearlyIncomeTotal,
    yearlyExpenseTotal,
    yearlySavingsTotal,
    yearlyNetBalance,
  };

  // 3. Renderizar solo los componentes de presentación
  return (
    <div className="summary-page">
      <h2>Resumen</h2>

      <div className="summary-container">
        {/* Columna izquierda: Filtros y tarjetas */}
        <div className="left-column">
          {/* Componente para filtros y exportación */}
          <ExportControls
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonthOnly={selectedMonthOnly}
            setSelectedMonthOnly={setSelectedMonthOnly}
            exportData={exportData}
          />
          
          {/* Componente para las tarjetas de resumen mensual */}
          <SummaryCards
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            netBalance={netBalance}
          />
        </div>

        {/* Columna derecha: Gráfico circular */}
        <PieChart data={pieData} />
      </div>

      {/* Gráfico de líneas con su filtro de rango integrado */}
      <LineChart data={lineData} range={range} setRange={setRange} />
    </div>
  );
};