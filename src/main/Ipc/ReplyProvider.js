import { ipcMain } from 'electron'
import ConnectReply from './Replies/ConnectReply'
import GetConnectionsReply from './Replies/GetConnectionsReply'
import DeleteConnectionReply from './Replies/DeleteConnectionReply'
import DisconnectReply from './Replies/DisconnectReply'
import DatabasesReply from './Replies/DatabasesReply'
import TablesReply from './Replies/TablesReply'
import TableDataReply from './Replies/TableDataReply'
import DescribeTableReply from './Replies/DescribeTableReply'

let channels = {
  'get-connections-request': (event) => {
    GetConnectionsReply.handle(event)
  },

  'get-connections-request-sync': (event) => {
    GetConnectionsReply.handleSync(event)
  },

  'delete-connection-request': (event, connection_index) => {
    DeleteConnectionReply.handle(event, connection_index)
  },

  'connect-request': (event, credentials) => {
    ConnectReply.handle(event, credentials)
  },

  'disconnect-request': (event) => {
    DisconnectReply.handle(event)
  },

  'databases-request': (event) => {
    DatabasesReply.handle(event)
  },

  'tables-request': (event, database) => {
    TablesReply.handle(event, database)
  },

  'table-data-request': (event, payload) => {
    TableDataReply.handle(event, payload)
  },

  'describe-table-request': (event, table) => {
    DescribeTableReply.handle(event, table)
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
