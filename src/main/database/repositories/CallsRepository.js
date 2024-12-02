import { Calls } from "../models";
import "../models/relations";


export class CallsRepository {
    // Método estático para obtener un técnico por su nombre de usuario
    static async getAll() {
      const calls = await Calls.findAll()

      if (calls) {
        return calls.map(call => {
          const callData = call.dataValues;
          return callData;
        });
      }
      
      return []
    }

    static async insert(call){
      console.log(call)
      await Calls.create({
        ...call,
        infoURL: "",
      })

  }
}