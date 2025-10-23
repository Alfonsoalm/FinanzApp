// hooks/useSavingsManager.js
import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { FinanceManagerContext } from "../../../context/FinanceManagerContext";

// Lógica de cálculo aislada
const calculateNetBalanceInfo = (incomes, expenses, savings) => {
  const months = new Set();
  let totalNetBalance = 0;

  // 1. Calcular Balance Neto Total y meses únicos
  incomes.forEach((income) => {
    const monthKey = new Date(income.date).toISOString().slice(0, 7);
    months.add(monthKey);
    totalNetBalance += parseFloat(income.amount);
  });

  expenses.forEach((expense) => {
    const monthKey = new Date(expense.date).toISOString().slice(0, 7);
    months.add(monthKey);
    totalNetBalance -= parseFloat(expense.amount);
  });

  // 2. Calcular Ahorros Recurrentes Totales
  const recurrentSavingsTotal = savings
    .filter((saving) => saving.type === "recurrent")
    .reduce((sum, saving) => sum + parseFloat(saving.amount), 0);
    
  // 3. Calcular Promedio
  const averageNetBalance = months.size > 0 ? totalNetBalance / months.size : 0;
  
  // 4. Calcular Balance Restante
  const remainingSavingsBalance = averageNetBalance - recurrentSavingsTotal;

  return { averageNetBalance, remainingSavingsBalance };
};

export const useSavingsManager = () => {
  const {
    savings,
    insertSaving,
    updateSaving,
    deleteSaving,
    getSavings,
    incomes,
    expenses,
    error,
  } = useContext(FinanceManagerContext);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    interest_rate: "",
    type: "recurrent",
  });
  const [formError, setFormError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  // Cálculos derivados usando useMemo para eficiencia
  const { averageNetBalance, remainingSavingsBalance } = useMemo(() => {
    return calculateNetBalanceInfo(incomes, expenses, savings);
  }, [incomes, expenses, savings]);


  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    setFormData({
      description: "",
      amount: "",
      date: "",
      category: "",
      interest_rate: "",
      type: "recurrent",
    });
    setEditMode(false);
    setEditId(null);
    setFormError("");
  }, []);

  // Efecto inicial para cargar datos
  useEffect(() => {
    const fetchAndCalculate = async () => {
      try {
        await getSavings();
      } catch (err) {
        console.error("Error al cargar los ahorros:", err);
      }
    };
    fetchAndCalculate();
  }, [shouldFetch, getSavings]); // Depende de shouldFetch y getSavings

  // Handler de cambio de formulario
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handler de envío de formulario (insertar/actualizar)
  const handleSubmitSaving = async (e) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !formData.date || !formData.category) {
      setFormError("Por favor, completa todos los campos.");
      return;
    }

    const amount = parseFloat(formData.amount);

    if (amount <= 0) {
      setFormError("La cantidad debe ser mayor a cero.");
      return;
    }

    // Validación específica para ahorros recurrentes
    if (formData.type === "recurrent" && amount > remainingSavingsBalance) {
      setFormError(
        `La cantidad del ahorro no puede superar el balance restante 
        (${remainingSavingsBalance.toFixed(2)} €).`
      );
      return;
    }

    try {
      setFormError("");
      const payload = { 
        ...formData, 
        interest_rate: parseFloat(formData.interest_rate) || 0,
        amount: amount // Aseguramos que la cantidad es un número
      };

      if (editMode) {
        await updateSaving(editId, payload);
      } else {
        await insertSaving(payload);
      }

      setShouldFetch((prev) => !prev);
      resetForm();
    } catch (err) {
      console.error("Error al guardar el ahorro:", err);
      setFormError(`Error al guardar: ${err.message || 'Intente de nuevo.'}`);
    }
  };

  // Funciones de acción de la tabla
  const handleEditSaving = useCallback((saving) => {
    setEditMode(true);
    setEditId(saving.id);
    setFormData({
      description: saving.description,
      amount: saving.amount,
      date: saving.date,
      category: saving.category,
      interest_rate: saving.interest_rate,
      type: saving.type,
    });
  }, []);

  const handleDeleteSaving = useCallback(async (id) => {
    try {
      await deleteSaving(id);
      setShouldFetch((prev) => !prev);
    } catch (err) {
      console.error("Error al eliminar el ahorro", err);
    }
  }, [deleteSaving]);


  return {
    // Datos del contexto
    savings,
    error,
    // Estados del formulario y acciones
    formData,
    formError,
    editMode,
    handleChange,
    handleSubmitSaving,
    handleEditSaving,
    handleDeleteSaving,
    resetForm, // Permitir cancelar la edición
    // Datos calculados
    averageNetBalance,
    remainingSavingsBalance,
  };
};