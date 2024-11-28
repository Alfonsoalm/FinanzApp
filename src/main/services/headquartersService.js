import { HeadquartersRepository } from '../database/repositories';

// Obtener todos los proyectos
export async function getHeadquarters() {
  try{
    const headquarters = await HeadquartersRepository.getAll()
    return {success: true, data: headquarters};

  }catch(error){
    console.error('Error in getHeadquarters:', error); 
    return {success: false, error: "Error al cargar las sedes"}
  }
   
}


export function handleHeadquarters(ipcMain) {
    ipcMain.handle('get-headquarters', async () => {
      try {
        return await getHeadquarters(); 
      } catch (error) {
        console.error('Error in getHeadquarters:', error); 
        return { success: false, error: "No se pudo cargar las sedes" };
      }
    });
}