import { VacationView } from '../../../renderer/src/projectsManager/views/VacationView';
import { Vacation} from '../models';

export class VacationRepository {

    static async getAll() {
        const vacations = await Vacation.findAll({
        })
        if (vacations) {
        return vacations.map(vacation => {
            const vacationData = vacation.dataValues;
            return vacationData;
        });
        }
        return []
    }

    static async insert(vacation){
        console.log("Dia de Vacaciones insertado");
        await Vacation.create({
            ...vacation,
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

    static async findByTechnicianId(id_technician){
        try {
            const vacations = await Vacation.findAll({
            where: { technician: id_technician}, // Filtrar por ID del técnico
            });

            if (vacations) {
                const vacationData = vacations.map(vacation => {
                const vacationData = vacation.dataValues;
                return vacationData;
            });
            return vacationData
            }
        } catch (error) {
            console.error('Error al obtener vacaciones del tecnico:', error);
            throw error; 
        }
    }
}                                                                                                                                                                                                                                                                                                                 