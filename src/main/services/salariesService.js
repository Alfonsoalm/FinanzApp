import { SalariesRepository } from '../database/repositories';
// Obtener todos los proyectos
async function getSalaries() {
  try{
    const salaries = await SalariesRepository.getAll()
    return {success: true, data: salaries};
  }catch(error){
    console.error('Error in getSalaries:', error); 
    return {success: false, error: "Error al cargar los proyectos"}
  }
}

async function insertSalary(salary) {
  try{
      await SalariesRepository.insert(salary)
      return {success: true};
  }catch(error){
    console.error('Error in insertSalary:', error); 
    return {success: false, error: "Error al insertar el nuevo proyecto"}
  }
}

async function deleteSalary(id_salary) {
  try{
    await SalariesRepository.deleteById(id_salary)
    return {success: true};
  }catch(error){
    console.error('Error in deleteSalary:', error); 
    return {success: false, error: "Error al borrar salario del tecnico"}
  }
}

async function editSalary(salary) {
  try{
    await SalariesRepository.edit(salary)
    return {success: true};
  }catch(error){
    console.error('Error in editSalary:', error); 
    return {success: false, error: "Error al editar salario del tecnico"}
  }
}

async function getSalariesByTechnician(id_technician) {
  try{
    const salaries = await SalariesRepository.findByTechnicianId(id_technician)
    return {success: true, data: salaries};
  }catch(error){
    console.error('Error in getSalariesByTechnician:', error); 
    return {success: false, error: "Error al obtener salario del tecnico"}
  }
}

export function handleSalaries(ipcMain) {
    ipcMain.handle('get-salaries', async () => {
      try {
        return await getSalaries(); 
      } catch (error) {
        console.error('Error in getSalaries:', error); 
        return { success: false, error: "No se pudo cargar los salarios" };
      }
    });

    ipcMain.handle('insert-salary', async (event, salary) => {
      try {
        return await insertSalary(salary); 
      } catch (error) {
        console.error('Error in insertSalary:', error); 
        return { success: false, error: "No se pudo añadir el nuevo salario" };
      }
    });

    ipcMain.handle('delete-salary', async (event, id_project) => {
      try {
        return await deleteSalary(id_project); 
      } catch (error) {
        console.error('Error in deleteSalary:', error); 
        return { success: false, error: "No se pudo eliminar el salario" };
      }
    });

    ipcMain.handle('edit-salary', async (event, salary) => {
      try {
        return await editSalary(salary); 
      } catch (error) {
        console.error('Error in editSalary:', error); 
        return { success: false, error: "No se editar el salario" };
      }
    });

    ipcMain.handle('get-salaries-technician', async (event, id_technician) => {
      try {
        return await getSalariesByTechnician(id_technician); 
      } catch (error) {
        console.error('Error in getSalariesByTechnician:', error); 
        return { success: false, error: "No se pudo obtener los salarios del tecnico" };
      }
    });

}