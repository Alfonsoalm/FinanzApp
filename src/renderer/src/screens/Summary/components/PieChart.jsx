/* eslint-disable react/prop-types */
// components/SummaryPage/PieChart.jsx
import { Pie } from "react-chartjs-2";

export const PieChart = ({ data }) => (
  <div className="right-column chart-container">
    <Pie
      data={data}
      options={{
        animation: false,
        plugins: {
          legend: {
            position: "top",
            align: "center",
            labels: {
              boxWidth: 10,
              padding: 10,
            },
          },
        },
      }}
    />
  </div>
);