import { Vacation} from '../models';

export class VacationRepository {

    static async getAll() {
        const vacations = await Vacation.findAll({
        })
        if (vacations) {
        return vacations.map(vacation => {
            const vacationData = vacation.dataValues;
            console.log("vacationData: ",vacationData);
            return vacationData;
        });
        }
        return []
    }

    static async insert(vacation){
        console.log("Dia de Vacaciones insertado");
        console.log(vacation);
        await Vacation.create({
            ...vacation
        })
    }

    static async deleteById(id_vacation){
        console.log("Dia de Vacaciones eliminado");
        await Vacation.destroy({
            where:{
            id: id_vacation
            }
        })
    }
}                                                                                                                                                                                                                                                                                                                 