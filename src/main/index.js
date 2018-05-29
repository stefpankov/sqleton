import { app, BrowserWindow, BrowserView, Menu, ipcMain } from 'electron'
import Connection from './Database/Connection'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let connection

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Sqleton',
    width: 1200,
    height: 600,
    icon: `${__dirname}/../../static/skeleton128.png`,
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/../index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // Remove application menu
  Menu.setApplicationMenu(null)

  BrowserWindow.addDevToolsExtension('/home/stefan/.config/google-chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/4.1.4_0')
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('connect-request', async (event, credentials) => {
  connection = new Connection(credentials)

  let response
  try {
    response = await connection.connect()
  } catch (error) {
    console.log(error)
    response = { success: false, message: error.message }
  }

  event.sender.send('connect-response', response)
})

ipcMain.on('db-request', async (event) => {
  let response

  if (connection) {
    try {
      response = await connection.databases()
    } catch (error) {
      console.log(error)
      response = { success: false, message: error.sqlMessage }
    }
  } else {
    response = { success: false, message: 'No connection.' }
  }

  event.sender.send('db-response', response)
})

ipcMain.on('tables-request', async (event, database) => {
  let response

  if (connection) {
    try {
      response = await connection.tablesForDatabase(database)
    } catch (error) {
      console.log(error)
      response = { success: false, message: error.sqlMessage }
    }
  } else {
    response = { success: false, message: 'No connection.' }
  }

  event.sender.send('tables-response', response)
})
