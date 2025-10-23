// components/SavingsPage/SavingsPage.jsx
import { useSavingsManager } from "./hooks/useSavingsManager";
import { SavingsSummary } from "./components/SavingsSummary";
import { SavingsForm } from "./components/SavingsForm";
import { SavingsTable } from "./components/SavingsTable";
import "./styles/savingsPage.css";

export const SavingsPage = () => {
  const {
    savings,
    error,
    formData,
    formError,
    editMode,
    averageNetBalance,
    remainingSavingsBalance,
    handleChange,
    handleSubmitSaving,
    handleEditSaving,
    handleDeleteSaving,
    resetForm,
  } = useSavingsManager();

  return (
    <div className="savings-page">
      <h2>Ahorros</h2>

      <SavingsSummary
        averageNetBalance={averageNetBalance}
        remainingSavingsBalance={remainingSavingsBalance}
      />

      <SavingsForm
        formData={formData}
        formError={formError}
        editMode={editMode}
        handleChange={handleChange}
        handleSubmitSaving={handleSubmitSaving}
        resetForm={resetForm}
      />

      {error && <p className="error">Error: {error}</p>}

      <div className="savings-summary">
        <h3>Resumen</h3>
        <SavingsTable
          savings={savings}
          handleEdit={handleEditSaving}
          handleDelete={handleDeleteSaving}
        />
      </div>
    </div>
  );
};