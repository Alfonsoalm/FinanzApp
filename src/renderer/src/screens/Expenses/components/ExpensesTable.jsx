/* eslint-disable react/prop-types */
// components/ExpensesTable.jsx

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

export const ExpensesTable = ({ expenses, handleEdit, handleDelete }) => {
  if (expenses.length === 0) {
    return <p>No hay gastos registrados.</p>;
  }

  return (
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
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td>{expense.description}</td>
            <td>{formatCurrency(expense.amount)}</td>
            <td>{new Date(expense.date).toLocaleDateString("es-ES")}</td>
            <td>{expense.category}</td>
            <td>{expense.type === "recurrent" ? "Recurrente" : "Puntual"}</td>
            <td>
              <button className="edit-btn" onClick={() => handleEdit(expense)}>
                Editar
              </button>
              <button className="delete-btn" onClick={() => handleDelete(expense.id)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};