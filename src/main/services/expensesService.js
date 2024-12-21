import ExpensesRepository from '../database/repositories/expensesRepository.js';

async function getExpenses() {
  try {
    console.log("Entrando getExpense en expensesService.js");
    const expenses = await ExpensesRepository.getAll();
    return { success: true, data: expenses };
  } catch (error) {
    console.error('Error in getExpenses:', error);
    return { success: false, error: 'Error al obtener los gastos' };
  }
}

async function insertExpense(expense) {
  try {
    console.log("Entrando insertExpense en expensesService.js");
    await ExpensesRepository.create(expense);
    return { success: true };
  } catch (error) {
    console.error('Error in insertExpense:', error);
    return { success: false, error: 'Error al insertar el gasto' };
  }
}

async function deleteExpense(id) {
  try {
    console.log("Entrando deleteExpense en expensesService.js");
    await ExpensesRepository.delete(id);
    return { success: true };
  } catch (error) {
    console.error('Error in deleteExpense:', error);
    return { success: false, error: 'Error al eliminar el gasto' };
  }
}

async function findExpensesByCategory(category) {
  try {
    console.log("Entrando findExpensesByCategory en expensesService.js");
    const expenses = await ExpensesRepository.findByCategory(category);
    return { success: true, data: expenses };
  } catch (error) {
    console.error('Error in findExpensesByCategory:', error);
    return { success: false, error: 'Error al buscar gastos por categoría' };
  }
}

export function handleExpenses(ipcMain) {
  ipcMain.handle('get-expenses', async () => {
    try {
      return await getExpenses();
    } catch (error) {
      console.error('Error in getExpenses:', error);
      return { success: false, error: "No se pudieron cargar los gastos" };
    }
  });

  ipcMain.handle('insert-expense', async (event, expense) => {
    try {
      await insertExpense(expense);
      return { success: true };
    } catch (error) {
      console.error('Error in insertExpense:', error);
      return { success: false, error: "No se pudo insertar el gasto" };
    }
  });

  ipcMain.handle('delete-expense', async (event, id) => {
    try {
      await deleteExpense(id);
      return { success: true };
    } catch (error) {
      console.error('Error in deleteExpense:', error);
      return { success: false, error: "No se pudo eliminar el gasto" };
    }
  });

  ipcMain.handle('find-expenses-by-category', async (event, category) => {
    try {
      const expenses = await findExpensesByCategory(category);
      return { success: true, data: expenses };
    } catch (error) {
      console.error('Error in findExpensesByCategory:', error);
      return { success: false, error: "No se pudieron cargar los gastos por categoría" };
    }
  });
}
