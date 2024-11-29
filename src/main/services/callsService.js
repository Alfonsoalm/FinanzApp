import { CallsRepository } from '../database/repositories';

// Obtener todos los proyectos
async function getCalls() {
  try{
    const calls = await CallsRepository.getAll()
    return {success: true, data: calls};

  }catch(error){
    console.error('Error in getCalls:', error); 
    return {success: false, error: "Error al cargar las convocatorias"}
  }
   
}

async function insertCall(call) {
  try{
      await CallsRepository.insert(call)
      return {success: true};

  }catch(error){
    console.error('Error in insertCall:', error); 
    return {success: false, error: "Error al insertar la nueva convocatoria"}
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

    ipcMain.handle('insert-call', async (event, call) => {
      try {
        return await insertCall(call); 
      } catch (error) {
        console.error('Error in insertCall,:', error); 
        return { success: false, error: "Error al insertar la nueva convocatoria"};
      }
    });
}