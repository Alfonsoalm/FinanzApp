import SavingsRepository from '../database/repositories/savingsRepository.js';

async function getSavings() {
  try {
    console.log("Entrando getSavings en savingsService.js");
    const savings = await SavingsRepository.getAll();
    return { success: true, data: savings };
  } catch (error) {
    console.error('Error in getSavings:', error);
    return { success: false, error: 'Error al obtener los ahorros' };
  }
}


async function insertSaving(saving) {
  try {
    console.log("Entrando insertSaving en savingsService.js");
    await SavingsRepository.create(saving);
    return { success: true };
  } catch (error) {
    console.error('Error in insertSaving:', error);
    return { success: false, error: 'Error al insertar el ahorro' };
  }
}

async function deleteSaving(id) {
  try {
    console.log("Entrando deleteSaving en savingsService.js");
    await SavingsRepository.delete(id);
    return { success: true };
  } catch (error) {
    console.error('Error in deleteSaving:', error);
    return { success: false, error: 'Error al eliminar el ahorro' };
  }
}

async function findSavingsByCategory(category) {
  try {
    console.log("Entrando findSavingsByCategory en savingsService.js");
    const savings = await SavingsRepository.findByCategory(category);
    return { success: true, data: savings };
  } catch (error) {
    console.error('Error in findSavingsByCategory:', error);
    return { success: false, error: 'Error al buscar ahorros por categoría' };
  }
}

export function handleSavings(ipcMain) {
  ipcMain.handle('get-savings', async () => {
    try {
      return await getSavings();
    } catch (error) {
      console.error('Error in getSavings:', error);
      return { success: false, error: "No se pudieron cargar los ahorros" };
    }
  });

  ipcMain.handle('insert-saving', async (event, saving) => {
    try {
      await insertSaving(saving);
      return { success: true };
    } catch (error) {
      console.error('Error in insertSaving:', error);
      return { success: false, error: "No se pudo insertar el ahorro" };
    }
  });

  ipcMain.handle('delete-saving', async (event, id) => {
    try {
      await deleteSaving(id);
      return { success: true };
    } catch (error) {
      console.error('Error in deleteSaving:', error);
      return { success: false, error: "No se pudo eliminar el ahorro" };
    }
  });

  ipcMain.handle('find-savings-by-category', async (event, category) => {
    try {
      const savings = await findSavingsByCategory(category);
      return { success: true, data: savings };
    } catch (error) {
      console.error('Error in findSavingsByCategory:', error);
      return { success: false, error: "No se pudieron cargar los ahorros por categoría" };
    }
  });
}
