import { ProjectsRepository } from '../database/repositories';

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
}