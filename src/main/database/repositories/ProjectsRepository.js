import { Calls, Headquarters, Projects } from "../models";
import "../models/relations";


export class ProjectsRepository {
    // Método estático para obtener un técnico por su nombre de usuario
    static async getAll() {
      const projects = await Projects.findAll({
        include: [
          {
            model: Headquarters,
            attributes: ['name'],  // Solo seleccionamos el nombre de la sede
          },
          {
            model: Calls,
            attributes: ["type"],
          }
        ],
        attributes: {
          exclude: ['id_sede',"id_convocatoria"], // Excluimos id_sede y headquarter de los resultados
        }
      })

      if (projects) {
        return projects.map(project => {
          const projectData = project.dataValues;
          if (projectData.Headquarter) {
            projectData.headquarter = projectData.Headquarter.name; // Extraemos el nombre de la sede
            delete projectData.Headquarter; // Eliminamos el objeto Headquarter 
          }
          if (projectData.Call) {
            projectData.call = projectData.Call.type; // Extraemos el nombre de la sede
            delete projectData.Call; // Eliminamos el objeto Headquarter 
          }

          return projectData;
        });
      }
      
      return []
    }

    static async insert(project){
        
        const duration = (new Date(project.endDate) - new Date(project.startDate))/(1000 * 60 * 60 * 24)  

        await Projects.create({
          ...project,
          duration,
          remaining_budget: project.budget,
          type:"PRUEBA",
          status:"Sin definir"
        })

    }
}