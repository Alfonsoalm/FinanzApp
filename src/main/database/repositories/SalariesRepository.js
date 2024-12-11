import { Salaries } from "../models";
import "../models/relations";

export class SalariesRepository {
  // Método estático para obtener un técnico por su nombre de usuario
  static async getAll() {
    const salaries = await Salaries.findAll({
    })
    if (salaries) {
      return salaries.map(salary => {
        const salariesData = salary.dataValues;
        return salariesData;
      });
    }
    return []
  }

  static async insert(salary){
      console.log("Insertar salario", salary);
      await Salaries.create({
        ...salary,
      })
  }

  static async deleteById(id_salary){
      console.log("Borrar salario con id:", id_salary);
      await Salaries.destroy({
          where:{
          id: id_salary
          }
      })
  }

  static async edit(salary) {
    console.log("Editar salario", salary);
    await Salaries.update(
        {
          contributionGroup: salary.contributionGroup,
          hourCost: salary.hourCost,
          startDate: salary.startDate,
          endDate: salary.endDate,
          id_technician: salary.id_technician, // Actualizar también id_technician
        },
        {
          where: {
              id: salary.id, // Identifica el salario a actualizar por su ID
          },
        }
    );
    console.log("Salario editado con éxito");
}


  static async findByTechnicianId(id_technician){
      try {
          const salaries = await Salaries.findAll({
          where: { id_technician: id_technician}, // Filtrar por ID del técnico
          });

          if (salaries) {
              const salariesData = salaries.map(salary => {
              const salariesData = salary.dataValues;
              return salariesData;
            });
            return salariesData
          }
      } catch (error) {
          console.error('Error al obtener técnico por ID:', error);
          throw error; 
      }
  }
}