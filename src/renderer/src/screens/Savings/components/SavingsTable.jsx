/* eslint-disable react/prop-types */
// components/SavingsPage/SavingsTable.jsx

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

export const SavingsTable = ({ savings, handleEdit, handleDelete }) => {
  if (savings.length === 0) {
    return <p>No hay ahorros registrados.</p>;
  }

  return (
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
            <td>{formatCurrency(saving.amount)}</td>
            <td>{new Date(saving.date).toLocaleDateString("es-ES")}</td>
            <td>{saving.category}</td>
            <td>{saving.interest_rate}%</td>
            <td>{saving.type === "recurrent" ? "Recurrente" : "Puntual"}</td>
            <td>
              <button
                className="edit-btn"
                onClick={() => handleEdit(saving)}
              >
                Editar
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(saving.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};