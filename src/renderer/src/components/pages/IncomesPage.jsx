import { useContext, useEffect, useState } from "react";
import "../../styles/pages/incomesPage.css";

import { FinanceManagerContext } from "../../context/FinanceManagerContext";

export const IncomesPage = () => {
  const { incomes, insertIncome, deleteIncome, getIncomes, error } =
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
    // Cargar los ingresos al montar el componente o después de enviar el formulario
    const fetchIncomes = async () => {
      try {
        await getIncomes();
      } catch (err) {
        console.error("Error al cargar los ingresos:", err);
      }
    };

    fetchIncomes();
  }, [shouldFetch]); // Se ejecuta solo al montar el componente o cuando shouldFetch cambia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddIncome = async (e) => {
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
      const newIncome = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        type: formData.type,
      };

      await insertIncome(newIncome); // Insertar ingreso
      setShouldFetch((prev) => !prev); // Cambiar el estado para disparar useEffect y actualizar la tabla
      setFormData({ description: "", amount: "", date: "", category: "", type: "recurrent" });
    } catch (err) {
      console.error("Error al agregar el ingreso", err);
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteIncome(id);
      setShouldFetch((prev) => !prev); // Cambiar el estado para disparar useEffect y actualizar la tabla
    } catch (err) {
      console.error("Error al eliminar el ingreso", err);
    }
  };

  return (
    <div className="incomes-page">
      <h2>Ingresos</h2>

      {/* Formulario para agregar ingresos */}
      <form onSubmit={handleAddIncome} className="incomes-form">
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
        <button type="submit">Añadir Ingreso</button>
      </form>

      {/* Mostrar errores del formulario */}
      {formError && <p className="form-error">{formError}</p>}

      {/* Mostrar errores globales */}
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
                    <button onClick={() => handleDeleteIncome(income.id)}>Eliminar</button>
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
