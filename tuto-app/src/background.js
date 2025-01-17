'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    paintWhenInitiallyHidden: true,
    backgroundColor: '#1a1a1a',
    frame: false,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      
      enablePreferredSizeMode: true,
      backgroundThrottling: false,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, process.env.WEBPACK_DEV_SERVER_URL ? '../src/preload.js' : 'preload.js')
    }
  })

  win.webContents.on('dom-ready', () => {
    win.show();
  });

  win.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  win.setMinimumSize(1725, 975)

  win.maximize()

  ipcMain.on('window-minimize', () => {
    win.minimize()
  })

  ipcMain.on('window-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })

  ipcMain.on('window-close', () => {
    win.close()
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Ajouter ces options pour le dev
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL, {
      backgroundColor: '#1a1a1a'
    })
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Ajouter ces options pour la prod
    win.loadURL('app://./index.html', {
      backgroundColor: '#1a1a1a'
    })
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
