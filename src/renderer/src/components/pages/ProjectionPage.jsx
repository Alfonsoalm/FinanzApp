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

    let accumulatedTotal = 0; // Total acumulado de todos los ahorros
    const startDate = new Date(); // Fecha actual

    for (let year = 1; year <= range; year++) {
      for (let month = 0; month < 12; month++) {
        const currentDate = new Date(startDate.getFullYear() + year - 1, month);

        savings.forEach((saving) => {
          const savingStartDate = new Date(saving.date);

          if (
            currentDate.getFullYear() > savingStartDate.getFullYear() ||
            (currentDate.getFullYear() === savingStartDate.getFullYear() && currentDate.getMonth() >= savingStartDate.getMonth())
          ) {
            let monthlyAmount = parseFloat(saving.amount);
            const interestRate = saving.interest_rate || 0;

            if (saving.type === "recurrent") {
              // Agregar la contribución recurrente al total acumulado
              accumulatedTotal += monthlyAmount;
            } else if (
              saving.type === "one-time" &&
              currentDate.getFullYear() === savingStartDate.getFullYear() &&
              currentDate.getMonth() === savingStartDate.getMonth()
            ) {
              // Agregar la contribución puntual solo una vez en su mes correspondiente
              accumulatedTotal += monthlyAmount;
              console.log(
                `Contribución puntual agregada: Fecha ${currentDate.toISOString().slice(0, 7)}, Cantidad: €${monthlyAmount.toFixed(2)}`
              );
            }

            // Aplicar interés mensual al total acumulado
            const previousTotal = accumulatedTotal;
            accumulatedTotal += accumulatedTotal * monthlyInterestRate(interestRate);

            console.log(
              `Fecha: ${currentDate.toISOString().slice(0, 7)}, Tipo: ${saving.type}, Ahorro: €${monthlyAmount.toFixed(2)}, Acumulado previo: €${previousTotal.toFixed(2)}, Acumulado después de interés: €${accumulatedTotal.toFixed(2)}`
            );
          }
        });
      }

      // Guardar el total acumulado al final del año
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