// components/ProjectionPage/ProjectionPage.jsx
import { useSavingsProjection } from "./hooks/useSavingsProjection";
import { RangeFilter } from "./components/RangeFilter";
import { ProjectionChart } from "./components/ProjectionChart";
import "./styles/projectionPage.css";
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

// Registro de ChartJS (mantener aquí o en el punto de entrada)
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
  // Obtener la lógica y los datos del hook
  const { selectedRange, setSelectedRange, lineData } = useSavingsProjection();

  return (
    <div className="projection-page">
      <h2>Proyección de Ahorros</h2>

      {/* Componente de filtro de rango */}
      <RangeFilter 
        selectedRange={selectedRange} 
        setSelectedRange={setSelectedRange} 
      />

      {/* Componente del gráfico */}
      <ProjectionChart data={lineData} />
    </div>
  );
};