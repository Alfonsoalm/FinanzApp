import { ProjectsRepository } from '../database/repositories';

// Obtener todos los proyectos
export async function getProjects() {
  try{
    const projects = await ProjectsRepository.getAll()
    return {success: true, data: projects};

  }catch(error){
    console.error('Error in getProjects:', error); 
    return {success: false, error: "Error al cargar los proyectos"}
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
}