import { ipcMain } from 'electron'
import Connection from '../Database/Connection'

const noConnectionResponse = { success: false, message: 'No connection.' }

let connection

let channels = {
  'connect-request': (event, credentials) => {
    connection = new Connection(credentials)

    connection.connect()
      .then(response => {
        event.sender.send('connect-response', response)
      })
      .catch(error => {
        console.log(error)
        event.sender.send('connect-response', { success: false, message: error.message })
      })
  },

  'databases-request': (event) => {
    if (connection) {
      return connection.databases()
        .then(response => {
          event.sender.send('databases-response', response)
        })
        .catch(error => {
          console.log(error)
          event.sender.send('databases-response', { success: false, message: error.sqlMessage })
        })
    }

    event.sender.send('databases-response', noConnectionResponse)
  },

  'tables-request': (event, database) => {
    if (connection) {
      return connection.tablesForDatabase(database)
        .then(response => {
          event.sender.send('tables-response', response)
        })
        .catch(error => {
          console.log(error)
          event.sender.send('tables-response', { success: false, message: error.sqlMessage })
        })
    }

    event.sender.send('tables-response', noConnectionResponse)
  },

  'table-data-request': (event, table) => {
    if (connection) {
      return connection.getTableData(table)
        .then(response => {
          event.sender.send('table-data-response', response)
        })
        .catch(error => {
          console.log(error)
          event.sender.send('table-data-response', { success: false, message: error.message })
        })
    }

    event.sender.send('table-data-response', noConnectionResponse)
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
