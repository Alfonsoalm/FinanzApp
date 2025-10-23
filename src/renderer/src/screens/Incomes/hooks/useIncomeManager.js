// hooks/useIncomeManager.js
import { useContext, useState, useEffect, useCallback } from "react";
import { FinanceManagerContext } from "../../../context/FinanceManagerContext";

export const useIncomeManager = () => {
  const { 
    incomes, 
    insertIncome, 
    deleteIncome, 
    updateIncome, 
    getIncomes, 
    error 
  } = useContext(FinanceManagerContext);
  
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    type: "recurrent",
  });
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);

  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    setFormData({ description: "", amount: "", date: "", category: "", type: "recurrent" });
    setEditingId(null);
    setFormError("");
  }, []);

  // Efecto para cargar los ingresos inicialmente y tras cambios
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        await getIncomes();
      } catch (err) {
        console.error("Error al cargar los ingresos:", err);
      }
    };
    fetchIncomes();
  }, [shouldFetch, getIncomes]);

  // Handler de cambio de formulario
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handler de envío de formulario (insertar/actualizar)
  const handleSubmit = async (e) => {
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
      if (editingId) {
        await updateIncome(editingId, payload);
      } else {
        await insertIncome(payload);
      }

      // 3. Post-acción
      setShouldFetch((prev) => !prev);
      resetForm();
    } catch (err) {
      console.error("Error al guardar el ingreso", err);
      setFormError(`Error al guardar: ${err.message || 'Intente de nuevo.'}`);
    }
  };

  // Handler para iniciar la edición
  const handleEditIncome = useCallback((income) => {
    setEditingId(income.id);
    setFormData({
      description: income.description,
      amount: income.amount,
      date: income.date,
      category: income.category,
      type: income.type,
    });
  }, []);

  // Handler para eliminar
  const handleDeleteIncome = useCallback(async (id) => {
    try {
      await deleteIncome(id);
      setShouldFetch((prev) => !prev);
    } catch (err) {
      console.error("Error al eliminar el ingreso", err);
    }
  }, [deleteIncome]);

  return {
    // Datos y Contexto
    incomes,
    error,
    // Formulario y Estados
    formData,
    formError,
    editingId,
    // Handlers
    handleChange,
    handleSubmit,
    handleEditIncome,
    handleDeleteIncome,
    resetForm,
  };
};