import { useContext, useState, useEffect } from "react";
import "../../styles/pages/savingsPage.css";
import { FinanceManagerContext } from "../../context/FinanceManagerContext";

export const SavingsPage = () => {
  const { savings, insertSaving, deleteSaving, getSavings, error } =
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
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    // Cargar ahorros al montar el componente o cuando se realiza un cambio
    const fetchSavings = async () => {
      try {
        await getSavings();
      } catch (err) {
        console.error("Error al cargar los ahorros:", err);
      }
    };

    fetchSavings();
  }, [shouldFetch]); // Ejecutar al montar el componente o cuando cambia shouldFetch

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSaving = async (e) => {
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
      const newSaving = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        interest_rate: parseFloat(formData.interest_rate) || 0,
        date: formData.date,
        category: formData.category,
        type: formData.type,
      };

      await insertSaving(newSaving); // Insertar ahorro
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
      console.error("Error al agregar el ahorro", err);
    }
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

      {/* Formulario para agregar ahorros */}
      <form onSubmit={handleAddSaving} className="savings-form">
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
        <button type="submit">Añadir Ahorro</button>
      </form>

      {/* Mostrar errores del formulario */}
      {formError && <p className="form-error">{formError}</p>}

      {/* Mostrar errores globales */}
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
                    <button onClick={() => handleDeleteSaving(saving.id)}>
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
