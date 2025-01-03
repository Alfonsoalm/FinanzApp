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
  const [selectedMonth, setSelectedMonth] = useState("2025-12");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonthOnly, setSelectedMonthOnly] = useState("12");

  useEffect(() => {
    // Load data on component mount
    getIncomes();
    getExpenses();
    getSavings();
  }, []);

  useEffect(() => {
    setSelectedMonth(`${selectedYear}-${selectedMonthOnly}`);
  }, [selectedYear, selectedMonthOnly]);

  // Función para calcular totales del año
  const calculateYearlyTotals = (data, year) => {
    return data
      .filter((item) => new Date(item.date).getFullYear() === parseInt(year))
      .reduce((acc, item) => acc + parseFloat(item.amount), 0);
  };

  // Calcular totales del año seleccionado
  const yearlyIncomeTotal = calculateYearlyTotals(incomes, selectedYear);
  const yearlyExpenseTotal = calculateYearlyTotals(expenses, selectedYear);
  const yearlySavingsTotal = calculateYearlyTotals(savings, selectedYear);
  const yearlyNetBalance = yearlyIncomeTotal - yearlyExpenseTotal;

  const exportToExcel = () => {
    const filteredIncomes = incomes.filter(
      (income) => new Date(income.date).getFullYear() === parseInt(selectedYear)
    );
    const filteredExpenses = expenses.filter(
      (expense) => new Date(expense.date).getFullYear() === parseInt(selectedYear)
    );
    const filteredSavings = savings.filter(
      (saving) => new Date(saving.date).getFullYear() === parseInt(selectedYear)
    );

    const summaryData = [
      { Tipo: "Ingresos Totales", Cantidad: `${yearlyIncomeTotal} €` },
      { Tipo: "Gastos Totales", Cantidad: `${yearlyExpenseTotal} €` },
      { Tipo: "Balance Neto", Cantidad: `${yearlyNetBalance} €` },
      { Tipo: "Ahorros Totales", Cantidad: `${yearlySavingsTotal} €` },
    ];

    const incomesData = filteredIncomes.map((income) => ({
      Descripción: income.description,
      Cantidad: `${income.amount} €`,
      Fecha: new Date(income.date).toLocaleDateString("es-ES"),
      Categoría: income.category,
      Tipo: income.type,
    }));

    const expensesData = filteredExpenses.map((expense) => ({
      Descripción: expense.description,
      Cantidad: `${expense.amount} €`,
      Fecha: new Date(expense.date).toLocaleDateString("es-ES"),
      Categoría: expense.category,
      Tipo: expense.type,
    }));

    const savingsData = filteredSavings.map((saving) => ({
      Descripción: saving.description,
      Cantidad: `${saving.amount} €`,
      Fecha: new Date(saving.date).toLocaleDateString("es-ES"),
      Categoría: saving.category,
      Tipo: saving.type,
    }));

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryData), "Resumen");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(incomesData), "Ingresos");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(expensesData), "Gastos");

    if (savingsData.length > 0) {
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(savingsData), "Ahorros");
    }

    XLSX.writeFile(workbook, `Resumen_${selectedYear}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Resumen Anual: ${selectedYear}`, 10, 10);

    const summaryData = [
      ["Tipo", "Cantidad"],
      ["Ingresos Totales", `${yearlyIncomeTotal} €`],
      ["Gastos Totales", `${yearlyExpenseTotal} €`],
      ["Balance Neto", `${yearlyNetBalance} €`],
      ["Ahorros Totales", `${yearlySavingsTotal} €`],
    ];

    doc.autoTable({ head: [summaryData[0]], body: summaryData.slice(1), startY: 20 });

    const incomesData = incomes
      .filter((income) => new Date(income.date).getFullYear() === parseInt(selectedYear))
      .map((income) => [
        income.description,
        `${income.amount} €`,
        new Date(income.date).toLocaleDateString("es-ES"),
        income.category,
        income.type,
      ]);

    doc.autoTable({
      head: [["Ingresos", "Cantidad", "Fecha", "Categoría", "Tipo"]],
      body: incomesData,
      startY: doc.lastAutoTable.finalY + 10,
      theme: "grid",
    });

    const expensesData = expenses
      .filter((expense) => new Date(expense.date).getFullYear() === parseInt(selectedYear))
      .map((expense) => [
        expense.description,
        `${expense.amount} €`,
        new Date(expense.date).toLocaleDateString("es-ES"),
        expense.category,
        expense.type,
      ]);

    doc.autoTable({
      head: [["Gastos", "Cantidad", "Fecha", "Categoría", "Tipo"]],
      body: expensesData,
      startY: doc.lastAutoTable.finalY + 10,
      theme: "grid",
    });

    if (savings.length > 0) {
      const savingsData = savings
        .filter((saving) => new Date(saving.date).getFullYear() === parseInt(selectedYear))
        .map((saving) => [
          saving.description,
          `${saving.amount} €`,
          new Date(saving.date).toLocaleDateString("es-ES"),
          saving.category,
          saving.type,
        ]);

      doc.autoTable({
        head: [["Ahorros", "Cantidad", "Fecha", "Categoría", "Tipo"]],
        body: savingsData,
        startY: doc.lastAutoTable.finalY + 10,
        theme: "grid",
      });
    }

    doc.save(`Resumen_${selectedYear}.pdf`);
  };

  const calculateTotals = (data) => {
    const monthlyData = { recurrent: {}, oneTime: {} };
    // console.log("data",data);
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
  console.log("incomesByMonth.recurrent",incomesByMonth.recurrent);
  console.log("incomesByMonth.oneTime",incomesByMonth.oneTime);
  const expensesByMonth = calculateTotals(expenses);
  console.log("expensesByMonth.recurrent",expensesByMonth.recurrent);
  console.log("expensesByMonth.oneTime",expensesByMonth.oneTime);

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

  // Combinar todas las claves de los meses de ingresos y gastos
  const allMonths = [
    ...new Set([
      ...Object.keys(incomesByMonth.recurrent),
      ...Object.keys(incomesByMonth.oneTime),
      ...Object.keys(expensesByMonth.recurrent),
      ...Object.keys(expensesByMonth.oneTime),
    ]),
  ].sort((a, b) => new Date(a) - new Date(b)); // Ordenar cronológicamente

  // Construir monthlyData asegurándose de recorrer todos los meses combinados
  const monthlyData = allMonths.map((month) => ({
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

  console.log("monthlyData:", monthlyData);

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