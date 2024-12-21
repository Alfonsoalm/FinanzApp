import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const api = {
  // Incomes API
  getIncomes: () => ipcRenderer.invoke('get-incomes'),
  insertIncome: (income) => ipcRenderer.invoke('insert-income', income),
  deleteIncome: (id) => ipcRenderer.invoke('delete-income', id),
  updateIncome: (id, updatedData) => ipcRenderer.invoke("update-income", { id, updatedData }), // Nueva función
  // Expenses API
  getExpenses: () => ipcRenderer.invoke('get-expenses'),
  insertExpense: (expense) => ipcRenderer.invoke('insert-expense', expense),
  deleteExpense: (id) => ipcRenderer.invoke('delete-expense', id),
  updateExpense: (id, updatedData) => ipcRenderer.invoke("update-expense", { id, updatedData }), // Nueva función
  // Savings API
  getSavings: () => ipcRenderer.invoke('get-savings'),
  insertSaving: (saving) => ipcRenderer.invoke('insert-saving', saving),
  deleteSaving: (id) => ipcRenderer.invoke('delete-saving', id),
  updateSaving: (id, updatedData) => ipcRenderer.invoke("update-saving", { id, updatedData }), // Nueva función
  
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  resizeWindow: () => ipcRenderer.send('resize-window')
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}