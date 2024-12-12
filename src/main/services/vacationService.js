import { VacationRepository } from '../database/repositories';
// Obtener todos los proyectos
async function getVacations() {
  try{
    const vacations = await VacationRepository.getAll()
    return {success: true, data: vacations};

  }catch(error){
    console.error('Error in getVacations:', error); 
    return {success: false, error: "Error al cargar dias de vacaciones"}
  }
}

async function insertVacation(vacation) {
  try{
      await VacationRepository.insert(vacation)
      return {success: true};

  }catch(error){
    console.error('Error in insertVacation:', error); 
    return {success: false, error: "Error al insertar nuevo dia de vacaciones"}
  }
}

async function deleteVacation(id_vacation) {
  try{
    await VacationRepository.deleteById(id_vacation)
    return {success: true};

  }catch(error){
    console.error('Error in deleteVacation:', error); 
    return {success: false, error: "Error al borrar dia de vacaciones"}
  }
}

export function handleVacations(ipcMain) {
    ipcMain.handle('get-vacations', async () => {
      try {
        return await getVacations(); 
      } catch (error) {
        console.error('Error in getVacations:', error); 
        return { success: false, error: "No se pudieron cargar los dias de vacaciones" };
      }
    });

    ipcMain.handle('insert-vacation', async (event, vacation) => {
      try {
        return await insertVacation(vacation); 
      } catch (error) {
        console.error('Error in insertVacation:', error); 
        return { success: false, error: "No se pudo añadir el nuevo dia de vacaciones" };
      }
    });

    ipcMain.handle('delete-vacation', async (event, id_vacation) => {
      try {
        return await deleteVacation(id_vacation); 
      } catch (error) {
        console.error('Error in deleteVacation:', error); 
        return { success: false, error: "No se pudo eliminar el dia de vacaciones" };
      }
    });
}