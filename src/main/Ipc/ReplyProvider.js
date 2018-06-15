import { ipcMain } from 'electron'
import settings from 'electron-settings'
import Connection from '../Database/Connection'

const noConnectionResponse = { success: false, message: 'No connection.' }

const saveConnectionIfNotExists = function (credentials) {
  // We don't store the password in the settings file.
  delete credentials.password

  // Stringify credentials for later use in comparison
  const json_credentials = JSON.stringify(credentials)

  // Grab the saved connections or initialize to an empty array
  const saved_connections = settings.get('saved_connections') || []

  // Check if a connection exists with the same credentials
  const conn_exists = saved_connections.findIndex(con =>
    JSON.stringify(con) === json_credentials) > -1

  if (!conn_exists) {
    saved_connections.push(credentials)
    settings.set('saved_connections', saved_connections)
  }

  return saved_connections
}

let connection

let channels = {
  'get-connections-request': (event) => {
    let saved_connections = []
    if (settings.has('saved_connections')) {
      saved_connections = settings.get('saved_connections')
    }

    event.sender.send('get-connections-response', {
      success: true,
      saved_connections
    })
  },

  'get-connections-request-sync': (event) => {
    let saved_connections = []
    if (settings.has('saved_connections')) {
      saved_connections = settings.get('saved_connections')
    }

    event.returnValue = saved_connections
  },

  'delete-connection-request': (event, connection_index) => {
    let saved_connections = settings.get('saved_connections')
    saved_connections.splice(connection_index, 1)
    settings.set('saved_connections', saved_connections)

    event.sender.send('delete-connection-response', {
      success: true,
      saved_connections
    })
  },

  'connect-request': (event, credentials) => {
    connection = new Connection(credentials)

    connection.connect()
      .then(response => {
        const saved_connections = saveConnectionIfNotExists(credentials)

        event.sender.send('get-connections-response', { success: true, saved_connections })
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
