// hooks/useSavingsProjection.js
import { useContext, useState, useMemo } from "react";
import { FinanceManagerContext } from "../../../context/FinanceManagerContext";

// Lógica de cálculo aislada para la proyección
const calculateProjections = (savingsData, range) => {
  console.log("🟢 INICIO cálculo de proyecciones --------------------------");
  console.log("Datos recibidos:", savingsData);
  console.log("Rango seleccionado (años):", range);

  const monthlyInterestRate = (rate) => rate / 100 / 12;
  const categories = [...new Set(savingsData.map((s) => s.category))];
  console.log("Categorías detectadas:", categories);

  const projectionsByCategory = {};

  // 1️⃣ Calcular saldo base del AÑO 0 (solo one-time pasados)
  const initialAccumulated = {};
  categories.forEach((cat) => (initialAccumulated[cat] = 0));

  savingsData.forEach((saving) => {
    const savingStartDate = new Date(saving.date);
    const today = new Date();
    const amount = parseFloat(saving.amount);

    if (saving.type === "one-time" && savingStartDate <= today) {
      initialAccumulated[saving.category] += amount;
      console.log(
        `✅ AÑO 0: sumado ${amount}€ de '${saving.category}' (${saving.date})`
      );
    } else if (saving.type === "one-time") {
      console.log(
        `⏩ AÑO FUTURO: ${amount}€ de '${saving.category}' (${saving.date}) - fecha futura, no se suma al Año 0`
      );
    }
  });

  console.log("💰 Saldo inicial por categoría (Año 0):", initialAccumulated);
  console.log(
    "💵 Total inicial Año 0:",
    Object.values(initialAccumulated).reduce((a, b) => a + b, 0)
  );

  // 2️⃣ Configuración inicial
  const allMonthlyProjections = [];
  let categoryAccumulated = {};
  categories.forEach(
    (cat) => (categoryAccumulated[cat] = initialAccumulated[cat] || 0)
  );

  let sumInitialYear0 = 0;
  categories.forEach((cat) => {
    projectionsByCategory[cat] = [categoryAccumulated[cat]];
    sumInitialYear0 += categoryAccumulated[cat];
  });

  const totalProjections = [sumInitialYear0];
  console.log("📊 Inicialización completada. Año 0 total:", sumInitialYear0);

  // 3️⃣ Proyección mensual
  const totalMonths = range * 12;

  for (let m = 0; m < totalMonths; m++) {
    const projectionDate = new Date();
    projectionDate.setMonth(projectionDate.getMonth() + m);
    const monthlyEntry = {
      month: projectionDate.toISOString().slice(0, 7),
      totals: {},
    };

    console.log(
      `\n📅 Mes ${m + 1}: ${projectionDate.toISOString().slice(0, 7)}`
    );

    categories.forEach((category) => {
      let monthlyContribution = 0;
      let highestInterestRate = 0;

      savingsData
        .filter((s) => s.category === category)
        .forEach((saving) => {
          const savingStartDate = new Date(saving.date);
          const amount = parseFloat(saving.amount);

          if (saving.interest_rate > highestInterestRate) {
            highestInterestRate = saving.interest_rate;
          }

          const isSameMonth =
            projectionDate.getFullYear() === savingStartDate.getFullYear() &&
            projectionDate.getMonth() === savingStartDate.getMonth();

          if (saving.type === "recurrent" && projectionDate >= savingStartDate) {
            monthlyContribution += amount;
            console.log(
              `🔁 ${category}: +${amount}€ recurrente desde ${saving.date}`
            );
          } else if (
            saving.type === "one-time" &&
            projectionDate > new Date() &&
            isSameMonth
          ) {
            monthlyContribution += amount;
            console.log(
              `🎯 ${category}: +${amount}€ puntual FUTURA (${saving.date})`
            );
          }
        });

      // Aplicar contribuciones e intereses
      categoryAccumulated[category] += monthlyContribution;
      categoryAccumulated[category] +=
        categoryAccumulated[category] * monthlyInterestRate(highestInterestRate);

      monthlyEntry.totals[category] = categoryAccumulated[category];

      console.log(
        `📈 ${category}: contribución=${monthlyContribution}€, interés=${highestInterestRate}%, nuevo saldo=${categoryAccumulated[category].toFixed(
          2
        )}`
      );
    });

    allMonthlyProjections.push(monthlyEntry);
  }

  // 4️⃣ Agrupar en años
  console.log("\n📆 AGRUPACIÓN ANUAL ----------------------------");
  for (let y = 1; y <= range; y++) {
    const yearlyTotal = allMonthlyProjections.slice((y - 1) * 12, y * 12).pop();
    if (yearlyTotal) {
      let sumYearlyTotal = 0;
      Object.keys(yearlyTotal.totals).forEach((category) => {
        projectionsByCategory[category].push(yearlyTotal.totals[category]);
        sumYearlyTotal += yearlyTotal.totals[category];
      });
      totalProjections.push(sumYearlyTotal);
      console.log(`🟦 Año ${y}: total=${sumYearlyTotal.toFixed(2)}€`);
    }
  }

  console.log("✅ Proyecciones finales por categoría:", projectionsByCategory);
  console.log("✅ Proyección total por año:", totalProjections);
  console.log("🔚 FIN cálculo de proyecciones --------------------------");

  return { projectionsByCategory, totalProjections };
};

export const useSavingsProjection = () => {
  const { savings } = useContext(FinanceManagerContext);
  const [selectedRange, setSelectedRange] = useState(1);

  console.log("savings (desde contexto):", savings);
  console.log("selectedRange (años):", selectedRange);

  // Calcular proyecciones usando useMemo
  const projections = useMemo(() => {
    const data = calculateProjections(savings, selectedRange);
    console.log("📦 Resultado completo de calculateProjections:", data);
    return data;
  }, [savings, selectedRange]);

  // Datos para el gráfico
  const lineData = useMemo(() => {
    const { projectionsByCategory, totalProjections } = projections;

    return {
      labels: [
        "Año 0 (Inicial)",
        ...Array.from({ length: selectedRange }, (_, i) => `${i + 1} años`),
      ],
      datasets: [
        ...Object.keys(projectionsByCategory || {}).map((category, index) => ({
          label: `Proyección (${category})`,
          data: projectionsByCategory[category],
          borderColor: `hsl(${index * 60}, 70%, 50%)`,
          backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.5)`,
          fill: true,
        })),
        {
          label: "Total Proyección (€)",
          data: totalProjections || [],
          borderColor: "#4caf50",
          backgroundColor: "#4caf5050",
          fill: true,
        },
      ],
    };
  }, [projections, selectedRange]);

  return {
    selectedRange,
    setSelectedRange,
    lineData,
  };
};
