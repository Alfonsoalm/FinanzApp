/* eslint-disable react/prop-types */
// components/SummaryPage/LineChart.jsx
import { Line } from "react-chartjs-2";

export const MonthlyRangeFilter = ({ range, setRange }) => (
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
);

export const LineChart = ({ data, range, setRange }) => (
  <div className="line-chart-container">
    <MonthlyRangeFilter range={range} setRange={setRange} />
    <h3>Temporal Trends</h3>
    <Line data={data} options={{ animation: false }} />
  </div>
);