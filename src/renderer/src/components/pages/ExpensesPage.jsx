import { useContext, useEffect, useState } from "react";
import { FinanceManagerContext } from "../../context/FinanceManagerContext";
import "../../styles/pages/expensesPage.css";

export const ExpensesPage = () => {
  const { expenses, insertExpense, updateExpense, deleteExpense, getExpenses, error } =
    useContext(FinanceManagerContext);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    type: "recurrent",
  });
  const [formError, setFormError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        await getExpenses();
      } catch (err) {
        console.error("Error al cargar los gastos:", err);
      }
    };

    fetchExpenses();
  }, [shouldFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !formData.date || !formData.category) {
      setFormError("Por favor, completa todos los campos.");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setFormError("La cantidad debe ser mayor a cero.");
      return;
    }

    try {
      setFormError("");
      if (editMode) {
        // Update existing expense
        await updateExpense(editId, formData);
        setEditMode(false);
        setEditId(null);
      } else {
        // Insert new expense
        await insertExpense(formData);
      }
      setShouldFetch((prev) => !prev);
      setFormData({ description: "", amount: "", date: "", category: "", type: "recurrent" });
    } catch (err) {
      console.error("Error al guardar el gasto:", err);
    }
  };

  const handleEditExpense = (expense) => {
    setEditMode(true);
    setEditId(expense.id);
    setFormData({
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      type: expense.type,
    });
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setShouldFetch((prev) => !prev);
    } catch (err) {
      console.error("Error al eliminar el gasto:", err);
    }
  };

  return (
    <div className="expenses-page">
      <h2>Gastos</h2>

      <form onSubmit={handleSubmitExpense} className="expenses-form">
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
        <button type="submit">{editMode ? "Actualizar Gasto" : "Añadir Gasto"}</button>
      </form>

      {formError && <p className="form-error">{formError}</p>}
      {error && <p className="error">Error: {error}</p>}

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
                    <button className="edit-btn" onClick={() => handleEditExpense(expense)}>
                      Editar
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteExpense(expense.id)}>
                      Eliminar
                    </button>
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
