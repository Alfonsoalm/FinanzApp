import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  login: (username, password) =>
    ipcRenderer.invoke('login', { username, password }),
  // Phases
  getPhases: () => 
    ipcRenderer.invoke('get-phases'),
  // Projects
  getProjects: () => 
    ipcRenderer.invoke('get-projects'),
  insertProject: (project) => 
    ipcRenderer.invoke('insert-project', project),
  getProjectDetails: (id_project) =>
    ipcRenderer.invoke('get-project-details', id_project),
  deleteProject: (id_project) =>
    ipcRenderer.invoke('delete-project', id_project),
  // Calls
  getCalls: () =>
    ipcRenderer.invoke("get-calls"),
  insertCall: (call) =>
    ipcRenderer.invoke("insert-call", call),
  // Headquarters
  getHeadquarters: () =>
    ipcRenderer.invoke("get-headquarters"),
  // Technicians
  deleteTechnician: (id_technician) =>
    ipcRenderer.invoke('delete-technician', id_technician),
  deleteSoftTechnician: (id_technician) =>
    ipcRenderer.invoke('delete-soft-technician', id_technician),
  getTechnicianDetails: (id_technician) => 
    ipcRenderer.invoke('get-technician-details', id_technician),
  getTechnicians: () =>
    ipcRenderer.invoke('get-technicians'),
  insertTechnician: (technician) =>
    ipcRenderer.invoke('insert-technician', technician),
  // Salaries
  getSalaries: () =>
    ipcRenderer.invoke('get-salaries'),
  insertSalary: (salary) =>
    ipcRenderer.invoke('insert-salary',salary),
  deleteSalary: (id_salary) =>
    ipcRenderer.invoke('delete-salary',id_salary),
  editSalary: (salary) =>
    ipcRenderer.invoke('edit-salary',salary),
  getSalariesByTechnician: (id_technician) =>
    ipcRenderer.invoke('get-salaries-technician', id_technician),
  // Assignments
  deleteAssignment: (id_phase, id_technician) => 
    ipcRenderer.invoke("delete-project-assignment", id_phase, id_technician),
  addAssignment: (assignment) =>
    ipcRenderer.invoke("add-project-assignment", assignment),
  getTechnicianAssignments: (id_technician) =>
    ipcRenderer.invoke('get-technician-assignments', id_technician),
  // Holidays
  getHolidays: () =>
    ipcRenderer.invoke('get-holidays'),
  insertHoliday: (holiday) =>
    ipcRenderer.invoke('insert-holiday', holiday),
  deleteHoliday: (id_holiday) =>
    ipcRenderer.invoke('delete-holiday', id_holiday),
  // Vacation
  getVacations: () =>
    ipcRenderer.invoke('get-vacations'),
  insertVacation: (vacation) =>
    ipcRenderer.invoke('insert-vacation', vacation),
  deleteVacation: (id_vacation) =>
    ipcRenderer.invoke('delete-vacation', id_vacation),
  getVacationsByTechnician: (id_technician) =>
    ipcRenderer.invoke('get-vacations-technician', id_technician),
  // WorkDays
  getWorkdays: () =>
    ipcRenderer.invoke('get-workdays'),
  insertWorkday: (workday) =>
    ipcRenderer.invoke('insert-workday', workday),
  deleteWorkday: (id_workday) =>
    ipcRenderer.invoke('delete-workday', id_workday),
  getWorkdaysByTechnician: (id_technician) =>
    ipcRenderer.invoke('get-workdays-technician', id_technician),

  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  resizeWindow: () => ipcRenderer.send('resize-window')
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
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