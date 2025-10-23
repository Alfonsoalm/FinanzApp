import { useContext, useState, useEffect } from "react";
import { FinanceManagerContext } from "../../context/FinanceManagerContext";
import "./styles/savingsPage.css";

export const SavingsPage = () => {
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
  const [averageNetBalance, setAverageNetBalance] = useState(0);
  const [remainingSavingsBalance, setRemainingSavingsBalance] = useState(0);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        await getSavings();
        calculateAverageNetBalance();
        calculateRemainingSavingsBalance();
      } catch (err) {
        console.error("Error al cargar los ahorros:", err);
      }
    };

    fetchSavings();
  }, [shouldFetch, incomes, expenses, savings]);

  const calculateAverageNetBalance = () => {
    const months = new Set();
    let totalNetBalance = 0;

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

    const average = months.size > 0 ? totalNetBalance / months.size : 0;
    setAverageNetBalance(average);
  };

  const calculateRemainingSavingsBalance = () => {
    const recurrentSavings = savings
      .filter((saving) => saving.type === "recurrent")
      .reduce((sum, saving) => sum + parseFloat(saving.amount), 0);

    setRemainingSavingsBalance(averageNetBalance - recurrentSavings);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitSaving = async (e) => {
    e.preventDefault();

    if (
      !formData.description ||
      !formData.amount ||
      !formData.date ||
      !formData.category
    ) {
      setFormError("Por favor, completa todos los campos.");
      return;
    }

    const amount = parseFloat(formData.amount);

    if (amount <= 0) {
      setFormError("La cantidad debe ser mayor a cero.");
      return;
    }

    if (formData.type === "recurrent" && amount > remainingSavingsBalance) {
      setFormError(
        `La cantidad del ahorro no puede superar el balance restante 
        (${remainingSavingsBalance.toFixed(2)} €).`
      );
      return;
    }

    try {
      setFormError("");

      if (editMode) {
        await updateSaving(editId, formData);
        setEditMode(false);
        setEditId(null);
      } else {
        await insertSaving({
          ...formData,
          interest_rate: parseFloat(formData.interest_rate) || 0,
        });
      }

      setShouldFetch((prev) => !prev);
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
      setShouldFetch((prev) => !prev);
    } catch (err) {
      console.error("Error al eliminar el ahorro", err);
    }
  };

  return (
    <div className="savings-page">
      <h2>Ahorros</h2>

      <div className="average-net-balance">
        <p>
          <strong>Balance Neto Promedio:</strong>{" "}
          {new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
          }).format(averageNetBalance)}
        </p>
        <p>
          <strong>Balance Restante para Ahorros:</strong>{" "}
          {new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
          }).format(remainingSavingsBalance)}
        </p>
      </div>

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
                    <button
                      className="edit-btn"
                      onClick={() => handleEditSaving(saving)}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteSaving(saving.id)}
                    >
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
