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
        event.sender.send('connect-response', error)
      })
  },

  'disconnect-request': (event) => {
    if (connection) {
      return connection.disconnect()
        .then(response => {
          event.sender.send('disconnect-response', response)
        })
        .catch(error => {
          console.log(error)
          event.sender.send('disconnect-response', error)
        })
    }

    event.sender.send('disconnect-response', noConnectionResponse)
  },

  'databases-request': (event) => {
    if (connection) {
      return connection.databases()
        .then(response => {
          event.sender.send('databases-response', response)
        })
        .catch(error => {
          console.log(error)
          event.sender.send('databases-response', error)
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
          event.sender.send('tables-response', error)
        })
    }

    event.sender.send('tables-response', noConnectionResponse)
  },

  'table-data-request': (event, { table, limit, offset }) => {
    if (connection) {
      return connection.getTableData(table, limit, offset)
        .then(response => {
          const data = { ...response, table, limit, offset }

          event.sender.send('table-data-response', data)
        })
        .catch(error => {
          console.log(error)
          event.sender.send('table-data-response', error)
        })
    }

    event.sender.send('table-data-response', noConnectionResponse)
  },

  'describe-table-request': (event, table) => {
    if (connection) {
      return connection.describeTable(table)
        .then(response => {
          const data = { ...response, table }

          event.sender.send('describe-table-response', data)
        })
        .catch(error => {
          console.log(error)
          event.sender.send('describe-table-response', error)
        })
    }

    event.sender.send('describe-table-response', noConnectionResponse)
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
