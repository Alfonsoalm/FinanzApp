import {Headquarters} from "../models";
import "../models/relations";


export class HeadquartersRepository {
    // Método estático para obtener un técnico por su nombre de usuario
    static async getAll() {
      const headquarters = await Headquarters.findAll()

      if (headquarters) {
        return headquarters.map(headquarter => {
          const headquarteData = headquarter.dataValues;
          return headquarteData;
        });
      }
      
      return []
    }
}