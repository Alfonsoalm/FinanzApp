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
}