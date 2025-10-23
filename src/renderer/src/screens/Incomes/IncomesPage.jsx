// components/IncomesPage/IncomesPage.jsx
import { useIncomeManager } from "./hooks/useIncomeManager";
import { IncomesForm } from "./components/IncomesForm";
import { IncomesTable } from "./components/IncomesTable";
import "./styles/incomesPage.css";

export const IncomesPage = () => {
  const {
    incomes,
    error,
    formData,
    formError,
    editingId,
    handleChange,
    handleSubmit,
    handleEditIncome,
    handleDeleteIncome,
    resetForm,
  } = useIncomeManager();

  return (
    <div className="incomes-page">
      <h2>Ingresos</h2>

      {/* Formulario de Ingresos (Añadir/Editar) */}
      <IncomesForm
        formData={formData}
        formError={formError}
        editingId={editingId}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />

      {error && <p className="error">Error: {error}</p>}

      {/* Resumen y Tabla de Ingresos */}
      <div className="incomes-summary">
        <h3>Resumen</h3>
        <IncomesTable
          incomes={incomes}
          handleEdit={handleEditIncome}
          handleDelete={handleDeleteIncome}
        />
      </div>
    </div>
  );
};