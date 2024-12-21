import { Op } from 'sequelize';
import Expenses from '../models/expenses.js';

class ExpensesRepository {
  // Obtener todos los gastos
  async getAll() {
    const expenses = await Expenses.findAll();

    if (expenses) {
      return expenses.map(expense => {
        const expenseData = expense.dataValues;
        return expenseData;
      });
    }
    return "Sin datos"
  }

  // Insertar un nuevo gasto
  async create(data) {
    await Expenses.create(data)
    return {success: true};
  }

  // Actualizar un gasto por ID
  async update(id, data) {
    const expenses = await Expenses.findByPk(id);
    if (!expenses) return null;
    return await Expenses.update(data);
  }

  // Eliminar un gasto por ID
  async delete(id) {
    const expense = await Expenses.findByPk(id);
    if (!expense) return null;
    return await expense.destroy();
  }

  // Buscar gastos por categoría
  async findByCategory(category) {
    return await Expenses.findAll({ where: {category: category } });
  }

  // Buscar gastos por tipo de recurrencia
  async findByType(type) {
    return await Expenses.findAll({ where: {type: type } });
  }

  // Buscar gastos por rango de fechas
  async findByDateRange(startDate, endDate) {
    return await Expenses.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
  }
}

export default new ExpensesRepository();
