// hooks/useFinanceSummary.js
import { useContext, useEffect, useState, useMemo } from "react";
import { FinanceManagerContext } from "../../../context/FinanceManagerContext";

const calculateTotals = (data) => {
  const monthlyData = { recurrent: {}, oneTime: {} };

  const today = new Date(); 
  const projectionLimit = new Date(); 
  projectionLimit.setFullYear(today.getFullYear() + 1);


  data.forEach((item) => {
    const startDate = new Date(item.date);
    const startMonthKey = startDate.toISOString().slice(0, 7);

    if (item.type === "recurrent") {
      let tempDate = new Date(startDate);

      while (tempDate <= projectionLimit) {
        const monthKey = tempDate.toISOString().slice(0, 7);
        monthlyData.recurrent[monthKey] =
          (monthlyData.recurrent[monthKey] || 0) + parseFloat(item.amount);
        tempDate.setMonth(tempDate.getMonth() + 1);
      }
    } else if (item.type === "one-time") {
      monthlyData.oneTime[startMonthKey] =
        (monthlyData.oneTime[startMonthKey] || 0) + parseFloat(item.amount);
    }
  });
  return monthlyData;
};

const calculateYearlyTotals = (data, year) => {
  return data
    .filter((item) => new Date(item.date).getFullYear() === parseInt(year))
    .reduce((acc, item) => acc + parseFloat(item.amount), 0);
};

export const useFinanceSummary = () => {
  const { incomes, expenses, savings, getIncomes, getExpenses, getSavings } =
    useContext(FinanceManagerContext);

  // Estados
  const [range, setRange] = useState(3);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonthOnly, setSelectedMonthOnly] = useState("12");

  // Efecto inicial para cargar datos
  useEffect(() => {
    getIncomes();
    getExpenses();
    getSavings();
  }, [getIncomes, getExpenses, getSavings]);

  // Derivar selectedMonth del año y mes seleccionados
  const selectedMonth = useMemo(
    () => `${selectedYear}-${selectedMonthOnly}`,
    [selectedYear, selectedMonthOnly]
  );

  // Cálculos Mensuales (usando useMemo para optimización)
  const { incomesByMonth, expensesByMonth } = useMemo(() => {
    const iByM = calculateTotals(incomes);
    const eByM = calculateTotals(expenses);
    return { incomesByMonth: iByM, expensesByMonth: eByM };
  }, [incomes, expenses]);

  // Totales del mes seleccionado
  const totalIncomesRecurrent = incomesByMonth.recurrent[selectedMonth] || 0;
  const totalIncomesOneTime = incomesByMonth.oneTime[selectedMonth] || 0;
  const totalExpensesRecurrent = expensesByMonth.recurrent[selectedMonth] || 0;
  const totalExpensesOneTime = expensesByMonth.oneTime[selectedMonth] || 0;

  const totalIncome = totalIncomesRecurrent + totalIncomesOneTime;
  const totalExpense = totalExpensesRecurrent + totalExpensesOneTime;
  const netBalance = totalIncome - totalExpense;

  // Cálculos Anuales
  const yearlyIncomeTotal = useMemo(
    () => calculateYearlyTotals(incomes, selectedYear),
    [incomes, selectedYear]
  );
  const yearlyExpenseTotal = useMemo(
    () => calculateYearlyTotals(expenses, selectedYear),
    [expenses, selectedYear]
  );
  const yearlySavingsTotal = useMemo(
    () => calculateYearlyTotals(savings, selectedYear),
    [savings, selectedYear]
  );
  const yearlyNetBalance = yearlyIncomeTotal - yearlyExpenseTotal;

  // Datos para el gráfico PIE
  const pieData = useMemo(() => {
    return {
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
  }, [
    totalIncomesRecurrent,
    totalIncomesOneTime,
    totalExpensesRecurrent,
    totalExpensesOneTime,
  ]);

  // Datos para el gráfico LINE
  const lineData = useMemo(() => {
    const allMonths = [
      ...new Set([
        ...Object.keys(incomesByMonth.recurrent),
        ...Object.keys(incomesByMonth.oneTime),
        ...Object.keys(expensesByMonth.recurrent),
        ...Object.keys(expensesByMonth.oneTime),
      ]),
    ].sort((a, b) => new Date(a) - new Date(b));

    const monthlyData = allMonths.map((month) => {
      const income =
        (incomesByMonth.recurrent[month] || 0) +
        (incomesByMonth.oneTime[month] || 0);
      const expense =
        (expensesByMonth.recurrent[month] || 0) +
        (expensesByMonth.oneTime[month] || 0);
      return { month, income, expense, net: income - expense };
    });
    
    // Filtrar por el rango de meses
    const endIndex = monthlyData.length;
    const startIndex = Math.max(0, endIndex - range);
    const dataInRange = monthlyData.slice(startIndex, endIndex);

    return {
      labels: dataInRange.map((data) => data.month),
      datasets: [
        {
          label: "Ingresos (€)",
          data: dataInRange.map((data) => data.income),
          borderColor: "#4caf50",
          backgroundColor: "#4caf5050",
          fill: true,
        },
        {
          label: "Gastos (€)",
          data: dataInRange.map((data) => data.expense),
          borderColor: "#f44336",
          backgroundColor: "#f4433650",
          fill: true,
        },
        {
          label: "Balance (€)",
          data: dataInRange.map((data) => data.net),
          borderColor: "#2196f3",
          backgroundColor: "#2196f350",
          fill: true,
        },
      ],
    };
  }, [incomesByMonth, expensesByMonth, range]);

  return {
    // Estados y setters
    range,
    setRange,
    selectedYear,
    setSelectedYear,
    selectedMonthOnly,
    setSelectedMonthOnly,
    // Totales del mes
    totalIncome,
    totalExpense,
    netBalance,
    // Totales del año
    yearlyIncomeTotal,
    yearlyExpenseTotal,
    yearlySavingsTotal,
    yearlyNetBalance,
    // Datos brutos
    incomes,
    expenses,
    savings,
    // Datos del gráfico
    pieData,
    lineData,
  };
};