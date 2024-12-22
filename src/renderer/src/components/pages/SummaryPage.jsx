import { useContext, useEffect, useState } from "react";
import "../../styles/pages/summaryPage.css";
import { FinanceManagerContext } from "../../context/FinanceManagerContext";
import { Pie, Line } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Importa el plugin después de jsPDF
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

// Import icons
import { FaArrowUp, FaArrowDown, FaBalanceScale } from "react-icons/fa";

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
  const { incomes, expenses, savings, getIncomes, getExpenses, getSavings } = useContext(FinanceManagerContext);
  const [range, setRange] = useState(3);
  const [selectedMonth, setSelectedMonth] = useState("2024-12");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonthOnly, setSelectedMonthOnly] = useState("12");

  useEffect(() => {
    // Load data on component mount
    getIncomes();
    getExpenses();
    getSavings();
  }, [getIncomes, getExpenses, getSavings]);

  useEffect(() => {
    setSelectedMonth(`${selectedYear}-${selectedMonthOnly}`);
  }, [selectedYear, selectedMonthOnly]);

  // Función para exportar ingresos a Excel
  const exportToExcel = () => {
    // Crear hojas de cálculo separadas para Resumen, Ingresos, Gastos y Ahorros
    const summaryData = [
      { Tipo: "Ingresos Totales", Cantidad: `${totalIncome} €` },
      { Tipo: "Ingresos Recurrentes", Cantidad: `${totalIncomesRecurrent} €` },
      { Tipo: "Ingresos Puntuales", Cantidad: `${totalIncomesOneTime} €` },
      { Tipo: "Gastos Totales", Cantidad: `${totalExpense} €` },
      { Tipo: "Gastos Recurrentes", Cantidad: `${totalExpensesRecurrent} €` },
      { Tipo: "Gastos Puntuales", Cantidad: `${totalExpensesOneTime} €` },
      { Tipo: "Balance Neto", Cantidad: `${netBalance} €` },
    ];
  
    const incomesData = incomes.map((income) => ({
      Descripción: income.description,
      Cantidad: `${income.amount} €`,
      Fecha: income.date,
      Categoría: income.category,
      Tipo: income.type,
    }));
  
    const expensesData = expenses.map((expense) => ({
      Descripción: expense.description,
      Cantidad: `${expense.amount} €`,
      Fecha: expense.date,
      Categoría: expense.category,
      Tipo: expense.type,
    }));
  
    const savingsData = savings.map((saving) => ({
      Descripción: saving.description,
      Cantidad: `${saving.amount} €`,
      Fecha: saving.date,
      Categoría: saving.category,
      Tipo: saving.type,
    }));
  
    // Crear hojas de Excel
    const workbook = XLSX.utils.book_new();
  
    // Hoja Resumen
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen");
  
    // Hoja Ingresos
    const incomesSheet = XLSX.utils.json_to_sheet(incomesData);
    XLSX.utils.book_append_sheet(workbook, incomesSheet, "Ingresos");
  
    // Hoja Gastos
    const expensesSheet = XLSX.utils.json_to_sheet(expensesData);
    XLSX.utils.book_append_sheet(workbook, expensesSheet, "Gastos");
  
    // Hoja Ahorros (si hay datos)
    if (savings && savings.length > 0) {
      const savingsSheet = XLSX.utils.json_to_sheet(savingsData);
      XLSX.utils.book_append_sheet(workbook, savingsSheet, "Ahorros");
    }
  
    // Exportar el archivo Excel
    XLSX.writeFile(workbook, `Resumen_Completo_${selectedMonth}.xlsx`);
  };
  

  // Función para exportar ingresos a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
  
    // Título
    doc.setFontSize(16);
    doc.text("Resumen Mensual", 10, 10);
  
    // Datos totales (resumen)
    const summaryData = [
      ["Tipo", "Cantidad"],
      ["Ingresos Totales", `${totalIncome} €`],
      ["Ingresos Recurrentes", `${totalIncomesRecurrent} €`],
      ["Ingresos Puntuales", `${totalIncomesOneTime} €`],
      ["Gastos Totales", `${totalExpense} €`],
      ["Gastos Recurrentes", `${totalExpensesRecurrent} €`],
      ["Gastos Puntuales", `${totalExpensesOneTime} €`],
      ["Balance Neto", `${netBalance} €`],
    ];
  
    doc.autoTable({
      head: [summaryData[0]],
      body: summaryData.slice(1),
      startY: 20
    });
  
    // Espacio entre las tablas
    let startY = doc.lastAutoTable.finalY + 10;
  
    // Detalles de ingresos
    doc.setFontSize(14);
    doc.text("Detalles de Ingresos", 10, startY);
  
    const incomesData = incomes.map((income) => [
      income.description,
      `${income.amount} €`,
      income.date,
      income.category,
      income.type,
    ]);
  
    doc.autoTable({
      head: [["Descripción", "Cantidad", "Fecha", "Categoría", "Tipo"]],
      body: incomesData,
      startY: startY + 10,
      theme: "grid",
    });
  
    // Espacio entre las tablas
    startY = doc.lastAutoTable.finalY + 10;
  
    // Detalles de gastos
    doc.setFontSize(14);
    doc.text("Detalles de Gastos", 10, startY);
  
    const expensesData = expenses.map((expense) => [
      expense.description,
      `${expense.amount} €`,
      expense.date,
      expense.category,
      expense.type,
    ]);
  
    doc.autoTable({
      head: [["Descripción", "Cantidad", "Fecha", "Categoría", "Tipo"]],
      body: expensesData,
      startY: startY + 10,
      theme: "grid",
    });
  
    // Espacio entre las tablas
    startY = doc.lastAutoTable.finalY + 10;
  
    // Detalles de ahorros (si existen)
    if (savings && savings.length > 0) {
      doc.setFontSize(14);
      doc.text("Detalles de Ahorros", 10, startY);
  
      const savingsData = savings.map((saving) => [
        saving.description,
        `${saving.amount} €`,
        saving.date,
        saving.category,
        saving.type,
      ]);
  
      doc.autoTable({
        head: [["Descripción", "Cantidad", "Fecha", "Categoría", "Tipo"]],
        body: savingsData,
        startY: startY + 10,
        theme: "grid",
      });
    }
  
    // Guardar el PDF
    doc.save(`Resumen_Completo_${selectedMonth}.pdf`);
  };
  
  

  const calculateTotals = (data) => {
    const monthlyData = { recurrent: {}, oneTime: {} };
    data.forEach((item) => {
      const startDate = new Date(item.date);
      const startMonthKey = startDate.toISOString().slice(0, 7);

      if (item.type === "recurrent") {
        const currentDate = new Date();
        let tempDate = new Date(startDate);
        while (tempDate <= currentDate) {
          const monthKey = tempDate.toISOString().slice(0, 7);
          if (!monthlyData.recurrent[monthKey]) {
            monthlyData.recurrent[monthKey] = 0;
          }
          monthlyData.recurrent[monthKey] += parseFloat(item.amount);
          tempDate.setMonth(tempDate.getMonth() + 1);
        }
      } else if (item.type === "one-time") {
        if (!monthlyData.oneTime[startMonthKey]) {
          monthlyData.oneTime[startMonthKey] = 0;
        }
        monthlyData.oneTime[startMonthKey] += parseFloat(item.amount);
      }
    });
    return monthlyData;
  };

  const incomesByMonth = calculateTotals(incomes);
  const expensesByMonth = calculateTotals(expenses);

  const totalIncomesRecurrent = incomesByMonth.recurrent[selectedMonth] || 0;
  const totalIncomesOneTime = incomesByMonth.oneTime[selectedMonth] || 0;
  const totalExpensesRecurrent = expensesByMonth.recurrent[selectedMonth] || 0;
  const totalExpensesOneTime = expensesByMonth.oneTime[selectedMonth] || 0;

  const totalIncome = totalIncomesRecurrent + totalIncomesOneTime;
  const totalExpense = totalExpensesRecurrent + totalExpensesOneTime;
  const netBalance = totalIncome - totalExpense;

  const pieData = {
    labels: [
      "Ingresos Recurrentes",
      "Ingresos Puntuales",
      "Gastos Recurrentes",
      "Gastos Puntuales",
    ],
    datasets: [
      {
        data: [
          totalIncomesRecurrent,
          totalIncomesOneTime,
          totalExpensesRecurrent,
          totalExpensesOneTime,
        ],
        backgroundColor: ["#2e7d32", "#81c784", "#f44336", "#e57373"],
      },
    ],
  };

  const monthlyData = Object.keys(incomesByMonth.recurrent).map((month) => ({
    month,
    income:
      (incomesByMonth.recurrent[month] || 0) +
      (incomesByMonth.oneTime[month] || 0),
    expense:
      (expensesByMonth.recurrent[month] || 0) +
      (expensesByMonth.oneTime[month] || 0),
    net:
      (incomesByMonth.recurrent[month] || 0) +
      (incomesByMonth.oneTime[month] || 0) -
      ((expensesByMonth.recurrent[month] || 0) +
        (expensesByMonth.oneTime[month] || 0)),
  }));

  const lineData = {
    labels: monthlyData.map((data) => data.month),
    datasets: [
      {
        label: "Ingresos (€)",
        data: monthlyData.map((data) => data.income),
        borderColor: "#4caf50",
        backgroundColor: "#4caf5050",
        fill: true,
      },
      {
        label: "Gastos (€)",
        data: monthlyData.map((data) => data.expense),
        borderColor: "#f44336",
        backgroundColor: "#f4433650",
        fill: true,
      },
      {
        label: "Balance (€)",
        data: monthlyData.map((data) => data.net),
        borderColor: "#2196f3",
        backgroundColor: "#2196f350",
        fill: true,
      },
    ],
  };

  return (
    <div className="summary-page">
      <h2>Resumen</h2>

      <div className="summary-container">
        {/* Columna izquierda: Filtros y tarjetas */}
        <div className="left-column">
                {/* Filtro de mes y año */}
          <div className="month-filter">
            <label htmlFor="month"> Mes:</label>
            <select
              id="month"
              value={selectedMonthOnly}
              onChange={(e) => setSelectedMonthOnly(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) =>
                String(i + 1).padStart(2, "0")
              ).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <label htmlFor="year"> Año:</label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {[2023, 2024, 2025].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Botones de exportación */}
            <div className="export-buttons">
              <button onClick={exportToExcel}>Exportar a Excel</button>
              <button onClick={exportToPDF}>Exportar a PDF</button>
            </div>
          </div>



            {/* Tarjetas de ingresos, gastos y balance */}
            <div className="data-container">
                <div className="card">
                    <div className="card-header" style={{ color: "#2e7d32" }}>
                        <FaArrowUp /> <h3>Ingresos totales este mes</h3>
                    </div>
                    <span className="total">
                        {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(totalIncome)}
                    </span>
                </div>

                <div className="card">
                    <div className="card-header" style={{ color: "#f44336" }}>
                        <FaArrowDown /> <h3>Gastos totales este mes</h3>
                    </div>
                    <span className="total">
                        {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(totalExpense)}
                    </span>
                </div>

                <div className="card">
                    <div className="card-header" style={{ color: "#2196f3" }}>
                        <FaBalanceScale /> <h3>Balance neto este mes</h3>
                    </div>
                    <span className="total">
                        {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(netBalance)}
                    </span>
                </div>
            </div>
        </div>

        {/* Columna derecha: Gráfico circular */}
        <div className="right-column chart-container">
            <Pie
                data={pieData}
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
    </div>


      {/* Filtro por rango */}
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

      <div className="line-chart-container">
        <h3>Temporal Trends</h3>
        <Line data={lineData} options={{ animation: false }} />
      </div>
    </div>
  );
};
