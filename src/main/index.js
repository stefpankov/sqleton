import path from 'path'
import { formatUrl } from 'url'
import { app, BrowserWindow, Menu } from 'electron'
import settings from 'electron-settings'
import ReplyProvider from './ipc/reply-provider'

const isDevelopment = process.env.NODE_ENV === 'development'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const createWindow = () => {
  // Load window state or set defaults
  let windowState = {
    isMaximized: false,
    bounds: { x: undefined, y: undefined, width: 1200, height: 600 }
  }

  if (settings.has('window_state')) {
    windowState = settings.get('window_state')
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Sqleton',
    ...windowState.bounds,
    icon: path.join(__static, '/skeleton128.png'),
  })

  if (windowState.isMaximized) {
    mainWindow.maximize()
  }

  // Open the DevTools.
  if (isDevelopment) {
    require('devtron').install()
    mainWindow.webContents.openDevTools()
  }

  // and load the index.html of the app.
  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    mainWindow.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

  ['resize', 'move', 'close'].forEach(e => {
    mainWindow.on(e, () => {
      windowState.isMaximized = mainWindow.isMaximized()

      if (!windowState.isMaximized) {
        // only update bounds if the window isn’t currently maximized
        windowState.bounds = mainWindow.getBounds()
      }

      settings.set('window_state', windowState)
    })
  })

  // Remove application menu
  Menu.setApplicationMenu(null)

  ReplyProvider.registerReplies()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

process.on('uncaughtException', function (error) {
  console.error('uncaught', error)
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
