/* eslint-disable react/prop-types */
// components/ProjectionPage/ProjectionChart.jsx
import { Line } from "react-chartjs-2";

export const ProjectionChart = ({ data }) => (
  <div className="line-chart-container">
    <Line data={data} options={{ animation: false }} />
  </div>
);