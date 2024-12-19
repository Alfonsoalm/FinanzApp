import { Phases, Projects } from "../models";
import "../models/relations";


export class PhasesRepository {
    // Método estático para obtener un técnico por su nombre de usuario
    static async getAll() {
        const phases = await Phases.findAll({
            include: [
            {
                model: Projects,
                attributes: ['name'],  
            }
            ],
            attributes: {
            exclude: ['id_project'], 
            }
        })
    
        if (phases) {
            return phases.map(phase => {
            const phaseData = phase.dataValues;
            if (phaseData.Project) {
                phaseData.project = phaseData.Project.name; // Extraemos el nombre de la sede
                delete phaseData.Project; // Eliminamos el objeto Headquarter 
            }
            return phaseData;
            });
        }
        return []
    }

    // Método estático para obtener un técnico por su nombre de usuario
    static async getByProjectId(id_project) {
        try {
            const phases = await Phases.findAll({
                where: { project: id_project }, // Filtramos por el ID del proyecto
            });

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