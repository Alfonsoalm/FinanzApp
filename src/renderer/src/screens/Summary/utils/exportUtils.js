// utils/exportUtils.js
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const formatCurrency = (amount) => `${amount} €`;

export const exportToExcel = (data, selectedYear) => {
  const { incomes, expenses, savings, yearlyIncomeTotal, yearlyExpenseTotal, yearlyNetBalance, yearlySavingsTotal } = data;

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
    { Tipo: "Ingresos Totales", Cantidad: formatCurrency(yearlyIncomeTotal) },
    { Tipo: "Gastos Totales", Cantidad: formatCurrency(yearlyExpenseTotal) },
    { Tipo: "Balance Neto", Cantidad: formatCurrency(yearlyNetBalance) },
    { Tipo: "Ahorros Totales", Cantidad: formatCurrency(yearlySavingsTotal) },
  ];

  const mapData = (item) => ({
    Descripción: item.description,
    Cantidad: formatCurrency(item.amount),
    Fecha: new Date(item.date).toLocaleDateString("es-ES"),
    Categoría: item.category,
    Tipo: item.type,
  });

  const incomesData = filteredIncomes.map(mapData);
  const expensesData = filteredExpenses.map(mapData);
  const savingsData = filteredSavings.map(mapData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryData), "Resumen");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(incomesData), "Ingresos");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(expensesData), "Gastos");

  if (savingsData.length > 0) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(savingsData), "Ahorros");
  }

  XLSX.writeFile(workbook, `Resumen_${selectedYear}.xlsx`);
};

export const exportToPDF = (data, selectedYear) => {
  const { incomes, expenses, savings, yearlyIncomeTotal, yearlyExpenseTotal, yearlyNetBalance, yearlySavingsTotal } = data;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(`Resumen Anual: ${selectedYear}`, 10, 10);

  const summaryData = [
    ["Tipo", "Cantidad"],
    ["Ingresos Totales", formatCurrency(yearlyIncomeTotal)],
    ["Gastos Totales", formatCurrency(yearlyExpenseTotal)],
    ["Balance Neto", formatCurrency(yearlyNetBalance)],
    ["Ahorros Totales", formatCurrency(yearlySavingsTotal)],
  ];

  doc.autoTable({ head: [summaryData[0]], body: summaryData.slice(1), startY: 20 });

  const mapPdfData = (item) => [
    item.description,
    formatCurrency(item.amount),
    new Date(item.date).toLocaleDateString("es-ES"),
    item.category,
    item.type,
  ];
  
  const incomesData = incomes
    .filter((income) => new Date(income.date).getFullYear() === parseInt(selectedYear))
    .map(mapPdfData);

  doc.autoTable({
    head: [["Ingresos", "Cantidad", "Fecha", "Categoría", "Tipo"]],
    body: incomesData,
    startY: doc.lastAutoTable.finalY + 10,
    theme: "grid",
  });

  const expensesData = expenses
    .filter((expense) => new Date(expense.date).getFullYear() === parseInt(selectedYear))
    .map(mapPdfData);

  doc.autoTable({
    head: [["Gastos", "Cantidad", "Fecha", "Categoría", "Tipo"]],
    body: expensesData,
    startY: doc.lastAutoTable.finalY + 10,
    theme: "grid",
  });

  if (savings.length > 0) {
    const savingsData = savings
      .filter((saving) => new Date(saving.date).getFullYear() === parseInt(selectedYear))
      .map(mapPdfData);

    doc.autoTable({
      head: [["Ahorros", "Cantidad", "Fecha", "Categoría", "Tipo"]],
      body: savingsData,
      startY: doc.lastAutoTable.finalY + 10,
      theme: "grid",
    });
  }

  doc.save(`Resumen_${selectedYear}.pdf`);
};