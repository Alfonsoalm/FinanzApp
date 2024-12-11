import { ProjectsRepository, TechnicianRepository } from '../database/repositories';
import { AssignmentsRepository } from '../database/repositories/AssignmentsRepository';
import { PhasesRepository } from '../database/repositories/PhasesRepository';

// Obtener todos los proyectos
async function getProjects() {
  try{
    const projects = await ProjectsRepository.getAll()
    return {success: true, data: projects};

  }catch(error){
    console.error('Error in getProjects:', error); 
    return {success: false, error: "Error al cargar los proyectos"}
  }
   
}

async function insertProject(project) {

  try{
      await ProjectsRepository.insert(project)
      return {success: true};

  }catch(error){
    console.error('Error in insertProject:', error); 
    return {success: false, error: "Error al insertar el nuevo proyecto"}
  }
}

async function deleteProject(id_project) {
  try{
    await ProjectsRepository.deleteById(id_project)
    return {success: true};

  }catch(error){
    console.error('Error in deleteProject:', error); 
    return {success: false, error: "Error al borrar el proyecto"}
  }
}

async function getProjectDetails(id_project) {
  try {

    const phases = await PhasesRepository.getByProjectId(id_project)

    if(phases){
      const phasesIds = phases.map(phase => phase.id)

      const assignments = await AssignmentsRepository.getByPhasesIds(phasesIds);

      if(assignments){
        const techIds = assignments.map(assignment => assignment.technician)
        const technicians = await TechnicianRepository.findByIds( [...new Set(techIds)]);
        return {success: true, data: {phases: phases, assignments:assignments, technicians: technicians}};
      }

      return {success: true, data: {phases: phases, assignments:assignments, technicians: []}};
    }
    return {success: true, data: []};

  } catch (error) {
    console.error('Error al obtener asignaciones:', error);
    return {success: false, error: 'Error interno del servidor.' };
  } 
}

async function deleteProjectAssignment(){
  try{

    console.log("Borrar asignacion")

  }catch(error) {
    console.error('Error al borrar asignaciones:', error);
    return {success: false, error: 'Error interno del servidor.' };
  }


}



export function handleProjects(ipcMain) {
    ipcMain.handle('get-projects', async () => {
      try {
        return await getProjects(); 
      } catch (error) {
        console.error('Error in getProjects:', error); 
        return { success: false, error: "No se pudo cargar los proyectos" };
      }
    });

    ipcMain.handle('insert-project', async (event, project) => {
      try {
        return await insertProject(project); 
      } catch (error) {
        console.error('Error in insertProject:', error); 
        return { success: false, error: "No se pudo añadir el nuevo proyecto" };
      }
    });

    ipcMain.handle('delete-project', async (event, id_project) => {
      try {
        return await deleteProject(id_project); 
      } catch (error) {
        console.error('Error in deleteProject:', error); 
        return { success: false, error: "No se pudo eliminar el proyecto" };
      }
    });

    ipcMain.handle('get-project-details', async (event, id_project) => {
      try {
        return await getProjectDetails(id_project); 
      } catch (error) {
        console.error('Error in getDetails:', error); 
        return { success: false, error: "No se pudo obtener los detalles del proyecto" };
      }
    });

    ipcMain.handle('delete-project-assignment', async (event, phase_id, technician_name) => {
      try {
        return await deleteProjectAssignment(phase_id, technician_name); 
      } catch (error) {
        console.error('Error in getDetails:', error); 
        return { success: false, error: "No se pudo obtener los detalles del proyecto" };
      }
    });
}