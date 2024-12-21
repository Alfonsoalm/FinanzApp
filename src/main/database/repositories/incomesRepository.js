import { Op } from 'sequelize';
import Incomes from '../models/incomes.js';

class IncomesRepository {
  // Obtener todos los ingresos
  async getAll() {
    const incomes = await Incomes.findAll();
    if (incomes) {
      return incomes.map(income => {
        const incomeData = income.dataValues;
        return incomeData;
      });
    }
    return "Sin datos"
  }

  // Insertar un nuevo ingreso
  async create(data) {
    await Incomes.create(data)
    return {success: true};
  }

  // Actualizar un ingreso por ID
  async update(id, data) {
    const income = await Incomes.findByPk(id);
    if (!income) return null;
    return await income.update(data);
  }

  // Eliminar un ingreso por ID
  async delete(id) {
    const income = await Incomes.findByPk(id);
    if (!income) return null;
    return await income.destroy();
  }

  // Buscar ingresos por categoría
  async findByCategory(category) {
    return await Incomes.findAll({ where: {category: category } });
  }

  // Buscar ingresos por tipo de recurrencia
  async findByType(type) {
    return await Incomes.findAll({ where: {type: type } });
  }

  // Buscar ingresos por rango de fechas
  async findByDateRange(startDate, endDate) {
    return await Incomes.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
  }
}

export default new IncomesRepository();
