import { Phases } from "../models";
import "../models/relations";


export class PhasesRepository {
    // Método estático para obtener un técnico por su nombre de usuario
    static async getByProjectId(id_project) {
        try {
            const phases = await Phases.findAll({
                where: { project: id_project }, // Filtramos por el ID del proyecto
            });
            console.log(phases)
            if (phases) {
                return phases.map(phase => {
                const phaseData = phase.dataValues;
                return phaseData;
                });
            }
        
            return [];
        } catch (error) {
            console.error('Error al obtener fases del proyecto:', error);
            return [];
        }
    }  
}