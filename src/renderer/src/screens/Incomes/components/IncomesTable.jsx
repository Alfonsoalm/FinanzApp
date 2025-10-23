/* eslint-disable react/prop-types */
// components/IncomesTable.jsx

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

export const IncomesTable = ({ incomes, handleEdit, handleDelete }) => {
  if (incomes.length === 0) {
    return <p>No hay ingresos registrados.</p>;
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
        {incomes.map((income) => (
          <tr key={income.id}>
            <td>{income.description}</td>
            <td>{formatCurrency(income.amount)}</td>
            <td>{new Date(income.date).toLocaleDateString("es-ES")}</td>
            <td>{income.category}</td>
            <td>{income.type === "recurrent" ? "Recurrente" : "Puntual"}</td>
            <td>
              <button className="edit-btn" onClick={() => handleEdit(income)}>
                Editar
              </button>
              <button className="delete-btn" onClick={() => handleDelete(income.id)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};