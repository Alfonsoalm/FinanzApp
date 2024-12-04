import { formatData } from '../../helpers/formatData';
import { Technicians } from '../models';


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
      // include: [
      //   {
      //     model: Headquarters,
      //     attributes: ['name'],  
      //   }
      // ],
      // attributes: {
      //   exclude: ['id_sede'], 
      // }
      
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
      });

      return technician ? technician.dataValues : "No encontrado"; // Devuelve los datos o null si no se encuentra
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
}                                                                                                                                                                                                                                                                                                                 