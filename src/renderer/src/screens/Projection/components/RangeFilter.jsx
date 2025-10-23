/* eslint-disable react/prop-types */
// components/ProjectionPage/RangeFilter.jsx

const RANGES = [1, 3, 5, 10, 20]; // Simplificar la lista de rangos para la interfaz

export const RangeFilter = ({ selectedRange, setSelectedRange }) => (
  <div className="filter-buttons">
    {RANGES.map((range) => (
      <button
        key={range}
        onClick={() => setSelectedRange(range)}
        className={selectedRange === range ? "active" : ""}
      >
        {range} {range === 1 ? "Año" : "Años"}
      </button>
    ))}
  </div>
);