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
}