import { CallsRepository } from '../database/repositories';

// Obtener todos los proyectos
export async function getCalls() {
  try{
    const calls = await CallsRepository.getAll()
    return {success: true, data: calls};

  }catch(error){
    console.error('Error in getCalls:', error); 
    return {success: false, error: "Error al cargar las convocatorias"}
  }
   
}


export function handleCalls(ipcMain) {
    ipcMain.handle('get-calls', async () => {
      try {
        return await getCalls(); 
      } catch (error) {
        console.error('Error in getCalls:', error); 
        return { success: false, error: "No se pudo cargar las convocatorias" };
      }
    });
}