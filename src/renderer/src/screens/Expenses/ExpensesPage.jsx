// ExpensesPage.jsx
import { useExpenseManager } from "./hooks/useExpenseManager";
import { ExpensesForm } from "./components/ExpensesForm";
import { ExpensesTable } from "./components/ExpensesTable";
import "./styles/expensesPage.css";

export const ExpensesPage = () => {
  const {
    expenses,
    error,
    formData,
    formError,
    editMode,
    handleChange,
    handleSubmitExpense,
    handleEditExpense,
    handleDeleteExpense,
    resetForm,
  } = useExpenseManager();

  return (
    <div className="expenses-page">
      <h2>Gastos</h2>

      {/* Formulario de Gastos (Añadir/Editar) */}
      <ExpensesForm
        formData={formData}
        formError={formError}
        editMode={editMode}
        handleChange={handleChange}
        handleSubmitExpense={handleSubmitExpense}
        resetForm={resetForm}
      />

      {error && <p className="error">Error: {error}</p>}

      {/* Resumen y Tabla de Gastos */}
      <div className="expenses-summary">
        <h3>Resumen</h3>
        <ExpensesTable
          expenses={expenses}
          handleEdit={handleEditExpense}
          handleDelete={handleDeleteExpense}
        />
      </div>
    </div>
  );
};