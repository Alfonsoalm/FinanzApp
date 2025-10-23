// hooks/useSavingsProjection.js
import { useContext, useState, useMemo } from "react";
import { FinanceManagerContext } from "../../../context/FinanceManagerContext";

// Lógica de cálculo aislada para la proyección
const calculateProjections = (savingsData, range) => {
  const monthlyInterestRate = (rate) => rate / 100 / 12;
  const categories = [...new Set(savingsData.map((saving) => saving.category))];
  const projectionsByCategory = {};

  // Inicializar acumulados por categoría con el saldo inicial (contribuciones one-time en el pasado)
  const initialAccumulated = {};
  categories.forEach(category => initialAccumulated[category] = 0);
  
  // Calcular el saldo inicial al inicio de la proyección (hoy)
  savingsData.forEach(saving => {
    const savingStartDate = new Date(saving.date);
    const today = new Date();
    const amount = parseFloat(saving.amount);
    
    // Si es puntual y ya pasó, suma la cantidad inicial
    if (saving.type === "one-time" && savingStartDate <= today) {
        initialAccumulated[saving.category] += amount;
    }
    // NOTA: Para recurrente, el cálculo de interés es más complejo.
    // Aquí asumimos que todos los montos recurrentes se aplican mes a mes.
    // La lógica de la versión original tenía problemas: mezclaba la suma anual con la mensual dentro del bucle.
  });

  // La lógica de proyección de la versión original es ineficiente y no calcula bien el interés compuesto.
  // La reescribiremos para ser más precisa mes a mes y luego agrupar por año.
  
  const allMonthlyProjections = [];
  let categoryAccumulated = {};
  categories.forEach(category => categoryAccumulated[category] = initialAccumulated[category] || 0);

  const totalMonths = range * 12;

  for (let m = 0; m < totalMonths; m++) {
    const projectionDate = new Date();
    projectionDate.setMonth(projectionDate.getMonth() + m);
    
    const monthlyEntry = { month: projectionDate.toISOString().slice(0, 7), totals: {} };

    categories.forEach(category => {
      let monthlyContribution = 0;
      let highestInterestRate = 0; // Usar la tasa más alta para simplificar la proyección

      savingsData
        .filter(saving => saving.category === category)
        .forEach(saving => {
          const savingStartDate = new Date(saving.date);
          const amount = parseFloat(saving.amount);
          
          if (saving.interest_rate > highestInterestRate) {
              highestInterestRate = saving.interest_rate;
          }

          // Aplicar la contribución recurrente o puntual si cae en este mes
          if (saving.type === "recurrent") {
            // Asumimos que los recurrentes comienzan en el mes de inicio y continúan
            if (projectionDate.getFullYear() > savingStartDate.getFullYear() || 
                (projectionDate.getFullYear() === savingStartDate.getFullYear() && projectionDate.getMonth() >= savingStartDate.getMonth())) {
                monthlyContribution += amount;
            }
          } else if (saving.type === "one-time" && 
                     projectionDate.getFullYear() === savingStartDate.getFullYear() && 
                     projectionDate.getMonth() === savingStartDate.getMonth()) {
            // Solo se añade en el mes de inicio (si está en el rango de proyección)
            monthlyContribution += amount;
          }
        });
        
        // 1. Añadir la contribución
        categoryAccumulated[category] += monthlyContribution;
        
        // 2. Aplicar el interés (compuesto)
        categoryAccumulated[category] += categoryAccumulated[category] * monthlyInterestRate(highestInterestRate);
        
        monthlyEntry.totals[category] = categoryAccumulated[category];
    });
    allMonthlyProjections.push(monthlyEntry);
  }
  
  // Agrupar los resultados mensuales en puntos de datos anuales
  const totalProjections = [];
  for (let y = 1; y <= range; y++) {
    const yearlyTotal = allMonthlyProjections.slice((y - 1) * 12, y * 12).pop();
    
    // Almacenar el total anual
    if (yearlyTotal) {
        let sumYearlyTotal = 0;
        Object.keys(yearlyTotal.totals).forEach(category => {
            if (!projectionsByCategory[category]) projectionsByCategory[category] = [];
            
            // Proyección por categoría
            projectionsByCategory[category].push(yearlyTotal.totals[category]);
            sumYearlyTotal += yearlyTotal.totals[category];
        });
        totalProjections.push(sumYearlyTotal);
    }
  }


  return { projectionsByCategory, totalProjections };
};


export const useSavingsProjection = () => {
  const { savings } = useContext(FinanceManagerContext);
  const [selectedRange, setSelectedRange] = useState(1);
  
  // Calcular proyecciones usando useMemo
  const projections = useMemo(() => {
    return calculateProjections(savings, selectedRange);
  }, [savings, selectedRange]);

  // Datos para el gráfico
  const lineData = useMemo(() => {
    const { projectionsByCategory, totalProjections } = projections;
    
    return {
      labels: Array.from({ length: selectedRange }, (_, i) => `${i + 1} años`),
      datasets: [
        // Proyecciones por categoría
        ...Object.keys(projectionsByCategory || {}).map((category, index) => ({
          label: `Proyección (${category})`,
          data: projectionsByCategory[category],
          borderColor: `hsl(${index * 60}, 70%, 50%)`,
          backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.5)`,
          fill: true,
        })),
        // Proyección Total
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