import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  login: (username, password) =>
    ipcRenderer.invoke('login', { username, password }),
  getProjects: () => 
    ipcRenderer.invoke('get-projects'),
  getCalls: () =>
    ipcRenderer.invoke("get-calls"),
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