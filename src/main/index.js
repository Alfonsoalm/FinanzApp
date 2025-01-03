import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell, screen } from 'electron'
import path, { join } from 'path'
import { handleExpenses } from './services/expensesService.js'
import { handleIncomes } from './services/incomesService.js'
import { handleSavings } from './services/savingsService.js'
import icon from '../../resources/icon.png?asset'

function createWindow() {
  // Obtener las dimensiones de la pantalla principal
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Crear la ventana del navegador con el tamaño de la pantalla
  const mainWindow = new BrowserWindow({
    width, // Usar el ancho de la pantalla
    height, // Usar la altura de la pantalla
    resizable: true, // Permitir redimensionar la ventana si es necesario
    fullscreenable: true, // Permitir pantalla completa
    maximizable: true, // Permitir maximizar la ventana
    autoHideMenuBar: true, // Oculta el menú automáticamente
    show: false, // Ventana no visible hasta que esté lista
    ...(process.platform === 'linux' ? { icon } : {}),
    icon: path.join(__dirname, './resources/finanzapp_icon.ico'), // Ruta relativa
    webPreferences: {
      preload: process.env.NODE_ENV === 'development'
        ? join(__dirname, '../preload/index.mjs') // Para desarrollo
        : join(app.getAppPath(), '../preload/index.mjs'), // Para producción
      sandbox: false,
      nodeIntegration: true,
    }
  });


  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })


  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })


  // HMR for renderer base on electron-vite cli.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(app.getAppPath(), '../renderer/index.html'))
  }
  // Cambiar la ventana a maximizable y redimensionable
  ipcMain.on('maximize-window', () => {
    mainWindow.maximize();
    mainWindow.setResizable(true);
    mainWindow.setMaximizable(true);
  });
  // Cambiar la ventana para permitir redimensionar
  ipcMain.on('resize-window', () => {
    mainWindow.setResizable(true);
  });
}

app.whenReady().then(() => {
  handleExpenses(ipcMain);
  handleIncomes(ipcMain); 
  handleSavings(ipcMain);

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  
})