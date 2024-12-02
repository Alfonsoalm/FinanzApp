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
  getDetails: (id_project) => 
    ipcRenderer.invoke('get-details', id_project),
  getCalls: () =>
    ipcRenderer.invoke("get-calls"),
  insertCall: (call) =>
    ipcRenderer.invoke("insert-call", call),
  getHeadquarters: () =>
    ipcRenderer.invoke("get-headquarters"),

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