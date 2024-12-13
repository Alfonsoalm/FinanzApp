import { Assignments, Phases } from "../models";
import "../models/relations";

export class AssignmentsRepository {
    // Método estático para obtener un técnico por su nombre de usuario
    static async getByPhasesIds(phasesIds) {
        try {
            // Luego buscamos las asignaciones asociadas a esas fases
            const assignments = await Assignments.findAll({
                where: { phase: phasesIds }, // Filtramos por los IDs de las fases
            });

            
            if (assignments) {
                return assignments.map(assignment => {
                const assignmentData = assignment.dataValues;
                return assignmentData;
                });
            }

            return [];
        } catch (error) {
            console.error('Error al obtener asignaciones del proyecto:', error);
            return [];
        }
    }

    static async delete(id_phase, id_technician) {
        await Assignments.destroy({
            where:{
              phase: id_phase,
              technician: id_technician 
            }
        })
    
    }

    
  static async getAssignments(id_technician) {
    try {
      const assignments = await Assignments.findAll({
        where: { technician: id_technician }, // Filtrar por ID del técnico
        include: [
          {
            model: Phases,
            attributes: ['name'],  
          }
        ],
        attributes: {
          exclude: ['id_fase'], 
        }
      });

      if (assignments) {
        return assignments.map(assignment => {
          const assignmentsData = assignment.dataValues;
          if (assignmentsData.phase) {
            assignmentsData.phase = assignmentsData.phase.name;
            delete assignmentsData.phase;
          }
          return assignmentsData;
        });
      }; 

    } catch (error) {
      console.error('Error al obtener asignaciones del tecnico:', error);
      throw new Error("Error interno al obtener asignaciones");
    }
  }
    static async insert(assignment){

        await Assignments.create({
          ...assignment,
        })

    }
}