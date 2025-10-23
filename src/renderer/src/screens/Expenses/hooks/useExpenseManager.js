// hooks/useExpenseManager.js
import { useContext, useState, useEffect, useCallback } from "react";
import { FinanceManagerContext } from "../../../context/FinanceManagerContext";

export const useExpenseManager = () => {
  const { 
    expenses, 
    insertExpense, 
    deleteExpense, 
    updateExpense, 
    getExpenses, 
    error 
  } = useContext(FinanceManagerContext);
  
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    type: "recurrent",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);

  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    setFormData({ description: "", amount: "", date: "", category: "", type: "recurrent" });
    setEditMode(false);
    setEditId(null);
    setFormError("");
  }, []);

  // Efecto para cargar los gastos inicialmente y tras cambios
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        await getExpenses();
      } catch (err) {
        console.error("Error al cargar los gastos:", err);
      }
    };
    fetchExpenses();
  }, [shouldFetch, getExpenses]);

  // Handler de cambio de formulario
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handler de envío de formulario (insertar/actualizar)
  const handleSubmitExpense = async (e) => {
    e.preventDefault();

    // 1. Validación
    if (!formData.description || !formData.amount || !formData.date || !formData.category) {
      setFormError("Por favor, completa todos los campos.");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setFormError("La cantidad debe ser mayor a cero.");
      return;
    }

    try {
      setFormError("");
      const payload = { ...formData, amount };

      // 2. Acción CRUD
      if (editMode) {
        await updateExpense(editId, payload);
      } else {
        await insertExpense(payload);
      }

      // 3. Post-acción
      setShouldFetch((prev) => !prev);
      resetForm();
    } catch (err) {
      console.error("Error al guardar el gasto:", err);
      setFormError(`Error al guardar: ${err.message || 'Intente de nuevo.'}`);
    }
  };

  // Handler para iniciar la edición
  const handleEditExpense = useCallback((expense) => {
    setEditMode(true);
    setEditId(expense.id);
    setFormData({
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      type: expense.type,
    });
  }, []);

  // Handler para eliminar
  const handleDeleteExpense = useCallback(async (id) => {
    try {
      await deleteExpense(id);
      setShouldFetch((prev) => !prev);
    } catch (err) {
      console.error("Error al eliminar el gasto:", err);
    }
  }, [deleteExpense]);

  return {
    // Datos y Contexto
    expenses,
    error,
    // Formulario y Estados
    formData,
    formError,
    editMode,
    // Handlers
    handleChange,
    handleSubmitExpense,
    handleEditExpense,
    handleDeleteExpense,
    resetForm,
  };
};