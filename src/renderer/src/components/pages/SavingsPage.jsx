import { useContext, useState, useEffect } from "react";
import { FinanceManagerContext } from "../../context/FinanceManagerContext";
import "../../styles/pages/savingsPage.css";

export const SavingsPage = () => {
  const { savings, insertSaving, updateSaving, deleteSaving, getSavings, error } =
    useContext(FinanceManagerContext);
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

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        await getSavings();
      } catch (err) {
        console.error("Error al cargar los ahorros:", err);
      }
    };

    fetchSavings();
  }, [shouldFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitSaving = async (e) => {
    e.preventDefault();

    // Validación del formulario
    if (
      !formData.description ||
      !formData.amount ||
      !formData.date ||
      !formData.category
    ) {
      setFormError("Por favor, completa todos los campos.");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setFormError("La cantidad debe ser mayor a cero.");
      return;
    }

    try {
      setFormError(""); // Limpiar errores previos
      if (editMode) {
        // Actualizar ahorro existente
        await updateSaving(editId, formData);
        setEditMode(false);
        setEditId(null);
      } else {
        // Insertar nuevo ahorro
        await insertSaving({
          ...formData,
          interest_rate: parseFloat(formData.interest_rate) || 0,
        });
      }
      setShouldFetch((prev) => !prev); // Actualizar la tabla
      setFormData({
        description: "",
        amount: "",
        date: "",
        category: "",
        interest_rate: "",
        type: "recurrent",
      });
    } catch (err) {
      console.error("Error al guardar el ahorro:", err);
    }
  };

  const handleEditSaving = (saving) => {
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
  };

  const handleDeleteSaving = async (id) => {
    try {
      await deleteSaving(id);
      setShouldFetch((prev) => !prev); // Actualizar la tabla
    } catch (err) {
      console.error("Error al eliminar el ahorro", err);
    }
  };

  return (
    <div className="savings-page">
      <h2>Ahorros</h2>

      {/* Formulario para agregar/editar ahorros */}
      <form onSubmit={handleSubmitSaving} className="savings-form">
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
          name="interest_rate"
          type="number"
          step="0.01"
          placeholder="Tasa de interés (%)"
          value={formData.interest_rate}
          onChange={handleChange}
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
        <button type="submit">{editMode ? "Actualizar Ahorro" : "Añadir Ahorro"}</button>
      </form>

      {formError && <p className="form-error">{formError}</p>}
      {error && <p className="error">Error: {error}</p>}

      {/* Resumen de ahorros */}
      <div className="savings-summary">
        <h3>Resumen</h3>
        {savings.length === 0 ? (
          <p>No hay ahorros registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Tasa de Interés</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {savings.map((saving) => (
                <tr key={saving.id}>
                  <td>{saving.description}</td>
                  <td>
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    }).format(saving.amount)}
                  </td>
                  <td>{new Date(saving.date).toLocaleDateString("es-ES")}</td>
                  <td>{saving.category}</td>
                  <td>{saving.interest_rate}%</td>
                  <td>{saving.type === "recurrent" ? "Recurrente" : "Puntual"}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditSaving(saving)}>
                      Editar
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteSaving(saving.id)}>
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
