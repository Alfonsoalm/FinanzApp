import { useContext, useEffect, useState } from "react";
import "../../styles/pages/incomesPage.css";

import { FinanceManagerContext } from "../../context/FinanceManagerContext";

export const IncomesPage = () => {
  const { incomes, insertIncome, deleteIncome, updateIncome, getIncomes, error } =
    useContext(FinanceManagerContext);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    type: "recurrent",
  });
  const [editingId, setEditingId] = useState(null); // Estado para manejar edición
  const [formError, setFormError] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        await getIncomes();
      } catch (err) {
        console.error("Error al cargar los ingresos:", err);
      }
    };
    fetchIncomes();
  }, [shouldFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
      setFormError("");

      if (editingId) {
        // Actualizar ingreso existente
        await updateIncome(editingId, formData);
        setEditingId(null); // Limpiar modo edición
      } else {
        // Crear nuevo ingreso
        await insertIncome({
          ...formData,
          amount: parseFloat(formData.amount),
        });
      }

      setShouldFetch((prev) => !prev);
      setFormData({ description: "", amount: "", date: "", category: "", type: "recurrent" });
    } catch (err) {
      console.error("Error al guardar el ingreso", err);
    }
  };

  const handleEditIncome = (income) => {
    setEditingId(income.id); // Establecer modo edición con el ID
    setFormData({
      description: income.description,
      amount: income.amount,
      date: income.date,
      category: income.category,
      type: income.type,
    });
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteIncome(id);
      setShouldFetch((prev) => !prev);
    } catch (err) {
      console.error("Error al eliminar el ingreso", err);
    }
  };

  return (
    <div className="incomes-page">
      <h2>Ingresos</h2>

      {/* Formulario para agregar/editar ingresos */}
      <form onSubmit={handleSubmit} className="incomes-form">
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
        <button type="submit">{editingId ? "Actualizar Ingreso" : "Añadir Ingreso"}</button>
      </form>

      {formError && <p className="form-error">{formError}</p>}
      {error && <p className="error">Error: {error}</p>}

      {/* Resumen de ingresos */}
      <div className="incomes-summary">
        <h3>Resumen</h3>
        {incomes.length === 0 ? (
          <p>No hay ingresos registrados.</p>
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
              {incomes.map((income) => (
                <tr key={income.id}>
                  <td>{income.description}</td>
                  <td>
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    }).format(income.amount)}
                  </td>
                  <td>{new Date(income.date).toLocaleDateString("es-ES")}</td>
                  <td>{income.category}</td>
                  <td>{income.type === "recurrent" ? "Recurrente" : "Puntual"}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditIncome(income)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleDeleteIncome(income.id)}>Eliminar</button>
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
