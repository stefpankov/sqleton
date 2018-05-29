import { ipcMain } from 'electron'
import Connection from '../Database/Connection'

const noConnectionResponse = { success: false, message: 'No connection.' }

let connection

let channels = {
  'connect-request': async (event, credentials) => {
    connection = new Connection(credentials)

    let response
    try {
      response = await connection.connect()
    } catch (error) {
      console.log(error)
      response = { success: false, message: error.message }
    }

    event.sender.send('connect-response', response)
  },

  'db-request': async (event) => {
    // Defensively set the no connection response if the next condition fails
    let response = noConnectionResponse

    if (connection) {
      try {
        response = await connection.databases()
      } catch (error) {
        console.log(error)
        response = { success: false, message: error.sqlMessage }
      }
    }

    event.sender.send('db-response', response)
  },

  'tables-request': async (event, database) => {
    let response = noConnectionResponse

    if (connection) {
      try {
        response = await connection.tablesForDatabase(database)
      } catch (error) {
        console.log(error)
        response = { success: false, message: error.sqlMessage }
      }
    }

    event.sender.send('tables-response', response)
  }
}

export default {
  registerReplies () {
    Object.keys(channels)
      .forEach(channel => {
        ipcMain.on(channel, channels[channel])
      })
  }
}
