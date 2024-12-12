import { WorkDaysRepository } from '../database/repositories';

// Obtener todos los proyectos
async function getWorkdays() {
  try{
    const workdays = await WorkDaysRepository.getAll()
    return {success: true, data: workdays};

  }catch(error){
    console.error('Error in getWorkdays:', error); 
    return {success: false, error: "Error al cargar las jornadas"}
  }
   
}

async function insertWorkday(workday) {

  try{
      await WorkDaysRepository.insert(workday)
      return {success: true};

  }catch(error){
    console.error('Error in insertWorkday:', error); 
    return {success: false, error: "Error al insertar nueva jornada laboral"}
  }
}

async function deleteWorkday(id_workday) {
  try{
    await WorkDaysRepository.deleteById(id_workday)
    return {success: true};

  }catch(error){
    console.error('Error in deleteWorkday:', error); 
    return {success: false, error: "Error al borrar la jornada laboral"}
  }
}

export function handleWorkdays(ipcMain) {
    ipcMain.handle('get-workdays', async () => {
      try {
        return await getWorkdays(); 
      } catch (error) {
        console.error('Error in getWorkdays:', error); 
        return { success: false, error: "No se pudo cargar los jornadas laborales" };
      }
    });

    ipcMain.handle('insert-workday', async (event, workday) => {
      try {
        return await insertWorkday(workday); 
      } catch (error) {
        console.error('Error in insertWorkday:', error); 
        return { success: false, error: "No se pudo añadir la jornada laboral" };
      }
    });

    ipcMain.handle('delete-workday', async (event, id_workday) => {
      try {
        return await deleteWorkday(id_workday); 
      } catch (error) {
        console.error('Error in deleteWorkday:', error); 
        return { success: false, error: "No se pudo eliminar la jornada laboral" };
      }
    });
}