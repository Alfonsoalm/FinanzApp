import { useContext, useEffect, useState } from "react";
import "../../styles/pages/projectionPage.css";
import { FinanceManagerContext } from "../../context/FinanceManagerContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const ProjectionPage = () => {
  const { savings, getSavings } = useContext(FinanceManagerContext);
  const [selectedRange, setSelectedRange] = useState(1); // Rango seleccionado (en años)
  const [projections, setProjections] = useState([]);

  useEffect(() => {
    getSavings();
  }, [getSavings]);

  useEffect(() => {
    calculateProjections(selectedRange);
  }, [savings, selectedRange]);

  const calculateProjections = (range) => {
    const monthlyInterestRate = (rate) => rate / 100 / 12;
    const projectionsData = [];

    // Initialize accumulated amount for all savings combined
    let accumulatedTotal = 0;

    for (let year = 1; year <= range; year++) {
      for (let month = 1; month <= 12; month++) {
        savings.forEach((saving) => {
          let monthlyAmount = parseFloat(saving.amount);
          const interestRate = saving.interest_rate || 0;

          // Add interest to the current saving amount
          accumulatedTotal += monthlyAmount;
          accumulatedTotal += accumulatedTotal * monthlyInterestRate(interestRate);

          console.log(
            `Año ${year}, Mes ${month}, Ahorro: €${monthlyAmount.toFixed(2)}, Acumulado: €${accumulatedTotal.toFixed(2)}`
          );
        });
      }

      // Add the yearly total to the projections data
      projectionsData.push({ year, totalSavings: accumulatedTotal });
    }

    setProjections(projectionsData);
  };

  const lineData = {
    labels: projections.map((p) => `${p.year} años`),
    datasets: [
      {
        label: "Proyección de Ahorros (€)",
        data: projections.map((p) => p.totalSavings),
        borderColor: "#4caf50",
        backgroundColor: "#4caf5050",
        fill: true,
      },
    ],
  };

  return (
    <div className="projection-page">
      <h2>Proyección de Ahorros</h2>

      <div className="filter-buttons">
        {[1, 3, 5, 10, 20, 30, 40, 50, 60].map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={selectedRange === range ? "active" : ""}
          >
            {range} {range === 1 ? "Año" : "Años"}
          </button>
        ))}
      </div>

      <div className="line-chart-container">
        <Line data={lineData} options={{ animation: false }} />
      </div>
    </div>
  );
};
