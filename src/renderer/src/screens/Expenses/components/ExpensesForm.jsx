/* eslint-disable react/prop-types */
// components/ExpensesForm.jsx

export const ExpensesForm = ({ 
  formData, 
  formError, 
  editMode, 
  handleChange, 
  handleSubmitExpense, 
  resetForm 
}) => (
  <>
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
      
      {editMode && (
        <button type="button" onClick={resetForm} className="cancel-btn">
          Cancelar Edición
        </button>
      )}
    </form>

    {formError && <p className="form-error">{formError}</p>}
  </>
);