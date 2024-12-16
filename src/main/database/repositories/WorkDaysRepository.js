import { WorkDays} from '../models';

export class WorkDaysRepository {

    static async getAll() {
        const workdays = await WorkDays.findAll({
        })
        if (workdays) {
        return workdays.map(workday => {
            const workdayData = workday.dataValues;
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

    static async findByTechnicianId(id_technician){
        try {
            const workdays = await WorkDays.findAll({
            where: { technician: id_technician}, // Filtrar por ID del técnico
            });

            if (workdays) {
                const workdayData = workdays.map(workday => {
                const workdayData = workday.dataValues;
                return workdayData;
            });
            return workdayData
            }
        } catch (error) {
            console.error('Error al obtener vacaciones del tecnico:', error);
            throw error; 
        }
    }
}                                                                                                                                                                                                                                                                                                                 