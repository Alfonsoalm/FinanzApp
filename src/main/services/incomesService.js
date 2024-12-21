import IncomesRepository from '../database/repositories/incomesRepository.js';

async function getIncomes() {
  try {
    // console.log("Entrando getIncomes en incomesService.js");
    const incomes = await IncomesRepository.getAll();
    return { success: true, data: incomes };
  } catch (error) {
    console.error('Error in getIncomes:', error);
    return { success: false, error: 'Error al obtener los ingresos' };
  }
}

async function insertIncome(income) {
  try {
    console.log("Entrando insertIncome en incomesService.js");
    await IncomesRepository.create(income);
    return { success: true };
  } catch (error) {
    console.error('Error in insertIncome:', error);
    return { success: false, error: 'Error al insertar el ingreso' };
  }
}

async function deleteIncome(id) {
  try {
    console.log("Entrando deleteIncome en incomesService.js");
    await IncomesRepository.delete(id);
    return { success: true };
  } catch (error) {
    console.error('Error in deleteIncome:', error);
    return { success: false, error: 'Error al eliminar el ingreso' };
  }
}

async function updateIncome(id, updatedData) {
  try {
    console.log("Entrando updateIncome en incomesService.js");
    await IncomesRepository.update(id, updatedData);
    return { success: true };
  } catch (error) {
    console.error("Error in updateIncome:", error);
    return { success: false, error: "Error al actualizar el ingreso" };
  }
}


async function findIncomesByCategory(category) {
  try {
    console.log("Entrando findIncomesByCategory en incomesService.js");
    const incomes = await IncomesRepository.findByCategory(category);
    return { success: true, data: incomes };
  } catch (error) {
    console.error('Error in findIncomesByCategory:', error);
    return { success: false, error: 'Error al buscar ingresos por categoría' };
  }
}

export function handleIncomes(ipcMain) {
  ipcMain.handle('get-incomes', async () => {
    try {
      return await getIncomes(); 
    } catch (error) {
      console.error('Error in getIncomes:', error); 
      return { success: false, error: "No se pudo cargar los ingresos" };
    }
  });

  ipcMain.handle('insert-income', async (event, income) => {
    try {
      await insertIncome(income);
      return { success: true };
    } catch (error) {
      console.error('Error in insertIncome:', error);
      return { success: false, error: "No se pudo insertar el ingreso" };
    }
  });

  ipcMain.handle('delete-income', async (event, id) => {
    try {
      await deleteIncome(id);
      return { success: true };
    } catch (error) {
      console.error('Error in deleteIncome:', error);
      return { success: false, error: "No se pudo eliminar el ingreso" };
    }
  });

  ipcMain.handle("update-income", async (event, { id, updatedData }) => {
    try {
      return await updateIncome(id, updatedData);
    } catch (error) {
      console.error("Error in updateIncome IPC handler:", error);
      return { success: false, error: "No se pudo actualizar el ingreso" };
    }
  });

  ipcMain.handle('find-incomes-by-category', async (event, category) => {
    try {
      const incomes = await findIncomesByCategory(category);
      return { success: true, data: incomes };
    } catch (error) {
      console.error('Error in findIncomesByCategory:', error);
      return { success: false, error: "No se pudieron cargar los ingresos por categoría" };
    }
  });
}
