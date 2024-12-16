import { formatData } from '../../helpers/formatData';
import { Technicians, Headquarters, Assignments, Phases } from '../models';
import { Op } from 'sequelize';

export class TechnicianRepository {
  static async findByUsername(username) {
    const user = await Technicians.findOne({
      where: { username },
      attributes: ['id', 'name', 'is_admin', 'password'],
    });

    if(user) return formatData(user)
  }

  static async findByIds(ids) {
    try{
      const technicians = await Technicians.findAll({
        where: {id: ids},
      });
  
      if (technicians) {
        return technicians.map(technician => {
        const techniciansData = technician.dataValues;
        return techniciansData;
        });
      }
      return [];
    } catch (error) {
      console.error('Error al obtener los tecnicos:', error);
      return [];
    }
  }

  static async getAll() {
    const technicians = await Technicians.findAll({
      include: [
        {
          model: Headquarters,
          attributes: ['name'],  
        }
      ],
      attributes: {
        exclude: ['id_sede'], 
      }
    })

    if (technicians) {
      return technicians.map(technician => {
        const techniciansData = technician.dataValues;
        if (techniciansData.Headquarter) {
          techniciansData.headquarter = techniciansData.Headquarter.name; // Extraemos el nombre de la sede
          delete techniciansData.Headquarter; // Eliminamos el objeto Headquarter 
        }
        return techniciansData;
      });
    
    }
    return []
  }

  static async insert(technician){
    console.log("Tecnico insertado, insert")
      await Technicians.create({
        ...technician
      })
  }

  // Método estático para obtener un técnico por su ID
  static async findById(id_technician) {
    try {
      const technician = await Technicians.findOne({
        where: { id: id_technician }, // Filtrar por ID del técnico
        include: [
          {
            model: Headquarters,
            attributes: ['name'],  
          }
        ],
        attributes: {
          exclude: ['id_sede'], 
        }
      });

      if (technician) {
          const technicianData = technician.dataValues;
          if (technicianData.Headquarter) {
            technicianData.headquarter = technicianData.Headquarter.name; // Extraemos el nombre de la sede
            delete technicianData.Headquarter; // Eliminamos el objeto Headquarter 
          }
          return technicianData;
        };
    } catch (error) {
      console.error('Error al obtener técnico por ID:', error);
      throw error; 
    }
  }

  // Método estático para eliminar un técnico por su ID
  static async deleteById(id_technician) {
    try {
      const deletedCount = await Technicians.destroy({
        where: { id: id_technician },
      });
      if (deletedCount === 0) {
        return "Técnico no encontrado o ya eliminado"; 
      }
      return "Técnico eliminado correctamente"; 
    } catch (error) {
      console.error('Error al eliminar técnico por ID:', error);
      throw new Error("Error interno al eliminar el técnico");
    }
  }

  static async deleteSoftById(id_technician) {
    // ############################################
    // MODIFICAR PARA SEPARA LOGICA EN EL SERVICIO
    // ############################################
    try {
      const technicianUpdate = await Technicians.update(
        { is_active: false },
        { where: { id: id_technician } }
      );

      if (technicianUpdate[0] === 0) {
        throw new Error(`No se encontro el tecnico con id ${id_technician} o ya esta inactivo.`);
      }

      // Paso 2: Eliminar asignaciones con fecha_inicio posterior a la actual
      const currentDate = new Date();
      const deletedAssignments = await Assignments.destroy({
          where: {
              technician: id_technician,
              startDate: { [Op.gt]: currentDate },
          },
      });

      return {
          message: `Tecnico con id ${id_technician} desactivado y ${deletedAssignments} asignaciones eliminadas.`,
      };
    } catch (error) {
        console.error('Error desactivando tecnico y eliminando asignaciones:', error.message);
        throw new Error(
          `Hubo un problema al desactivar el tecnico y eliminar asignaciones: ${error.message}`
      );
    }
  }

}                                                                                                                                                                                                                                                                                                                 