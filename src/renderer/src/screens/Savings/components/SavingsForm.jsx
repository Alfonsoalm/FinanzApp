/* eslint-disable react/prop-types */
// components/SavingsPage/SavingsForm.jsx

export const SavingsForm = ({
  formData,
  formError,
  editMode,
  handleChange,
  handleSubmitSaving,
  resetForm,
}) => (
  <>
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
      
      {editMode && (
        <button type="button" onClick={resetForm} className="cancel-btn">
          Cancelar Edición
        </button>
      )}
    </form>
    
    {formError && <p className="form-error">{formError}</p>}
  </>
);