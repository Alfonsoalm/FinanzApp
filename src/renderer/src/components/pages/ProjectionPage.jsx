import { useContext, useEffect, useState } from "react";
import { FinanceManagerContext } from "../../context/FinanceManagerContext";
import { Line } from "react-chartjs-2";
import "../../styles/pages/projectionPage.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ProjectionPage = () => {
  const { savings } = useContext(FinanceManagerContext); // Obtener ahorros del contexto
  const [selectedRange, setSelectedRange] = useState(1); // Rango seleccionado (en años)
  const [projections, setProjections] = useState([]); // Datos de proyecciones

  // Calcular proyecciones localmente sin afectar el contexto global
  const calculateProjections = (savingsData, range) => {
    const monthlyInterestRate = (rate) => rate / 100 / 12;
    const categories = [...new Set(savingsData.map((saving) => saving.category))];
    const projectionsByCategory = {};
    const totalProjections = [];
    let totalAccumulated = 0;

    categories.forEach((category) => {
      projectionsByCategory[category] = [];
      let categoryAccumulated = 0;

      for (let year = 1; year <= range; year++) {
        for (let month = 0; month < 12; month++) {
          const currentDate = new Date(new Date().getFullYear() + year - 1, month);

          savingsData
            .filter((saving) => saving.category === category)
            .forEach((saving) => {
              const savingStartDate = new Date(saving.date);

              if (
                currentDate.getFullYear() > savingStartDate.getFullYear() ||
                (currentDate.getFullYear() === savingStartDate.getFullYear() &&
                  currentDate.getMonth() >= savingStartDate.getMonth())
              ) {
                let monthlyAmount = parseFloat(saving.amount);
                const interestRate = saving.interest_rate || 0;

                if (saving.type === "recurrent") {
                  // Agregar contribuciones recurrentes
                  categoryAccumulated += monthlyAmount;
                } else if (
                  saving.type === "one-time" &&
                  currentDate.getFullYear() === savingStartDate.getFullYear() &&
                  currentDate.getMonth() === savingStartDate.getMonth()
                ) {
                  // Agregar contribuciones puntuales
                  categoryAccumulated += monthlyAmount;
                }

                // Aplicar interés mensual
                categoryAccumulated += categoryAccumulated * monthlyInterestRate(interestRate);
              }
            });
        }
        projectionsByCategory[category].push(categoryAccumulated);
      }
    });

    // Sumar acumulados por categorías para calcular el total
    for (let i = 0; i < range; i++) {
      let yearlyTotal = 0;
      Object.keys(projectionsByCategory).forEach((category) => {
        yearlyTotal += projectionsByCategory[category][i];
      });
      totalProjections.push(yearlyTotal);
    }

    return { projectionsByCategory, totalProjections };
  };

  // Recalcular proyecciones cuando el rango o ahorros cambian
  useEffect(() => {
    const { projectionsByCategory, totalProjections } = calculateProjections(savings, selectedRange);
    setProjections({ projectionsByCategory, totalProjections });
  }, [savings, selectedRange]);

  const lineData = {
    labels: Array.from({ length: selectedRange }, (_, i) => `${i + 1} años`),
    datasets: [
      ...Object.keys(projections.projectionsByCategory || {}).map((category, index) => ({
        label: `Proyección (${category})`,
        data: projections.projectionsByCategory[category],
        borderColor: `hsl(${index * 60}, 70%, 50%)`, // Colores dinámicos
        backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.5)`,
        fill: true,
      })),
      {
        label: "Total Proyección (€)",
        data: projections.totalProjections || [],
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
