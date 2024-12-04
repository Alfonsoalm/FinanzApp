import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  login: (username, password) =>
    ipcRenderer.invoke('login', { username, password }),
  getProjects: () => 
    ipcRenderer.invoke('get-projects'),
  insertProject: (project) => 
    ipcRenderer.invoke('insert-project', project),
  getProjectDetails: (id_project) =>
    ipcRenderer.invoke('get-project-details', id_project),
  getTechnicianDetails: (id_technician) => 
    ipcRenderer.invoke('get-technician-details', id_technician),
  deleteProject: (id_project) =>
    ipcRenderer.invoke('delete-project', id_project),
  getCalls: () =>
    ipcRenderer.invoke("get-calls"),
  insertCall: (call) =>
    ipcRenderer.invoke("insert-call", call),
  getHeadquarters: () =>
    ipcRenderer.invoke("get-headquarters"),
  getTechnicians: () =>
    ipcRenderer.invoke('get-technicians'),
  insertTechnician: (technician) =>
    ipcRenderer.invoke('insert-technician', technician),
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