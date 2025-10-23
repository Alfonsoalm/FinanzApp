/* eslint-disable react/prop-types */
// components/SummaryPage/ExportControls.jsx
import { exportToExcel, exportToPDF } from "../utils/exportUtils";

export const ExportControls = ({
  selectedYear,
  setSelectedYear,
  selectedMonthOnly,
  setSelectedMonthOnly,
  exportData,
}) => {
  const handleExportExcel = () => exportToExcel(exportData, selectedYear);
  const handleExportPDF = () => exportToPDF(exportData, selectedYear);

  return (
    <div className="month-filter">
      <label htmlFor="month"> Mes:</label>
      <select
        id="month"
        value={selectedMonthOnly}
        onChange={(e) => setSelectedMonthOnly(e.target.value)}
      >
        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(
          (month) => (
            <option key={month} value={month}>
              {month}
            </option>
          )
        )}
      </select>

      <label htmlFor="year"> Año:</label>
      <select
        id="year"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {[2023, 2024, 2025, 2026, 2027].map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <div className="export-buttons">
        <button onClick={handleExportExcel}>Exportar a Excel</button>
        <button onClick={handleExportPDF}>Exportar a PDF</button>
      </div>
    </div>
  );
};