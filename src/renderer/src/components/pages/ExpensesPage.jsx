import { useContext, useEffect, useState } from "react";
import "../../styles/pages/expensesPage.css";

import { FinanceManagerContext } from "../../context/FinanceManagerContext";

export const ExpensesPage = () => {
  const { expenses, insertExpense, deleteExpense, getExpenses, error } =
    useContext(FinanceManagerContext); // Eliminamos isLoading del contexto
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    type: "recurrent",
  });
  const [formError, setFormError] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false); // Nuevo estado para controlar cuándo ejecutar el useEffect

  useEffect(() => {
    // Cargar los gastos al montar el componente o después de enviar el formulario
    const fetchExpenses = async () => {
      try {
        await getExpenses();
      } catch (err) {
        console.error("Error al cargar los gastos:", err);
      }
    };

    fetchExpenses();
  }, [shouldFetch]); // Se ejecuta solo al montar el componente o cuando shouldFetch cambia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    // Validación del formulario
    if (!formData.description || !formData.amount || !formData.date || !formData.category) {
      setFormError("Por favor, completa todos los campos.");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setFormError("La cantidad debe ser mayor a cero.");
      return;
    }

    try {
      setFormError(""); // Limpiar errores previos
      const newExpense = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        type: formData.type,
      };

      await insertExpense(newExpense); // Insertar gasto
      setShouldFetch((prev) => !prev); // Cambiar el estado para disparar useEffect y actualizar la tabla
      setFormData({ description: "", amount: "", date: "", category: "", type: "recurrent" });
    } catch (err) {
      console.error("Error al agregar el gasto", err);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setShouldFetch((prev) => !prev); // Cambiar el estado para disparar useEffect y actualizar la tabla
    } catch (err) {
      console.error("Error al eliminar el gasto", err);
    }
  };

  return (
    <div className="expenses-page">
      <h2>Gastos</h2>

      {/* Formulario para agregar gastos */}
      <form onSubmit={handleAddExpense} className="expenses-form">
        <input
          name="amount"
          type="number"
          placeholder="Cantidad"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          type="text"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          type="text"
          placeholder="Categoría"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="recurrent">Recurrente</option>
          <option value="one-time">Puntual</option>
        </select>
        <button type="submit">Añadir Gasto</button>
      </form>

      {/* Mostrar errores del formulario */}
      {formError && <p className="form-error">{formError}</p>}

      {/* Mostrar errores globales */}
      {error && <p className="error">Error: {error}</p>}

      {/* Resumen de gastos */}
      <div className="expenses-summary">
        <h3>Resumen</h3>
        {expenses.length === 0 ? (
          <p>No hay gastos registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    }).format(expense.amount)}
                  </td>
                  <td>{new Date(expense.date).toLocaleDateString("es-ES")}</td>
                  <td>{expense.category}</td>
                  <td>{expense.type === "recurrent" ? "Recurrente" : "Puntual"}</td>
                  <td>
                    <button onClick={() => handleDeleteExpense(expense.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
