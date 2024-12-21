import { Op } from 'sequelize';
import Savings from '../models/savings.js';

class SavingsRepository {
    // Obtener todos los ahorros
    async getAll() {
      const savings = await Savings.findAll()

      if (savings) {
        return savings.map(saving => {
          const savingData = saving.dataValues;
          return savingData;
        });
      }
      return []
    }
  
    // Insertar un nuevo ahorro
    async create(data) {
      await Savings.create(data)
      return {success: true};
    }
  
    // Actualizar un ahorro por ID
    async update(id, data) {
      const saving = await Savings.findByPk(id);
      if (!saving) return null;
      return await saving.update(data);
    }
  
    // Eliminar un ahorro por ID
    async delete(id) {
      const saving = await Savings.findByPk(id);
      if (!saving) return null;
      return await saving.destroy();
    }
  
    // Buscar ahorros por categoría
    async findByCategory(category) {
      return await Savings.findAll({ where: { category } });
    }
  
    // Buscar ahorros por tipo de recurrencia
    async findByType(type) {
      return await Savings.findAll({ where: { type } });
    }
  
    // Buscar ahorros por rango de fechas
    async findByDateRange(startDate, endDate) {
      return await Savings.findAll({
        where: {
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
      });
    }
  }
  
  export default new SavingsRepository();