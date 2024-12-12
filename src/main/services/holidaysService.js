import { HolidaysRepository } from '../database/repositories';

// Obtener todos los proyectos
async function getHolidays() {
  try{
    const holidays = await HolidaysRepository.getAll()
    return {success: true, data: holidays};

  }catch(error){
    console.error('Error in getHolidays:', error); 
    return {success: false, error: "Error al cargar los festivos"}
  }
}

async function insertHoliday(holiday) {
  try{
      await HolidaysRepository.insert(holiday)
      return {success: true};

  }catch(error){
    console.error('Error in insertHoliday:', error); 
    return {success: false, error: "Error al insertar el festivo"}
  }
}

async function deleteHoliday(id_holiday) {
  try{
    await HolidaysRepository.deleteById(id_holiday)
    return {success: true};

  }catch(error){
    console.error('Error in deleteHoliday:', error); 
    return {success: false, error: "Error al borrar el festivo"}
  }
}

export function handleHolidays(ipcMain) {
    ipcMain.handle('get-holidays', async () => {
      try {
        return await getHolidays(); 
      } catch (error) {
        console.error('Error in getHolidays:', error); 
        return { success: false, error: "No se pudieron cargar los festivos" };
      }
    });

    ipcMain.handle('insert-holiday', async (event, holiday) => {
      try {
        return await insertHoliday(holiday); 
      } catch (error) {
        console.error('Error in insertHoliday:', error); 
        return { success: false, error: "No se pudo añadir el festivo" };
      }
    });

    ipcMain.handle('delete-holiday', async (event, id_holiday) => {
      try {
        return await deleteHoliday(id_holiday); 
      } catch (error) {
        console.error('Error in deleteHoliday:', error); 
        return { success: false, error: "No se pudo eliminar el festivo" };
      }
    });
}