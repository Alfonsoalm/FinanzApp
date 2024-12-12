import { WorkDays} from '../models';

export class WorkDaysRepository {

    static async getAll() {
        const workdays = await WorkDays.findAll({
        })
        if (workdays) {
        return workdays.map(workday => {
            const workdayData = workday.dataValues;
            console.log("workdayData: ",workdayData);
            return workdayData;
        });
        }
        return []
    }

    static async insert(workday){
        console.log("Jornada insertada")
        await WorkDays.create({
            ...workday
        })
    }

    static async deleteById(id_workday){
        console.log("Jornada eliminada");
        await WorkDays.destroy({
            where:{
            id: id_workday
            }
        })
    }
}                                                                                                                                                                                                                                                                                                                 