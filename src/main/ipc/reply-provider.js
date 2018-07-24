import { ipcMain } from 'electron'
import ConnectReply from './replies/connect-reply'
import GetConnectionsReply from './replies/get-connections-reply'
import DeleteConnectionReply from './replies/delete-connection-reply'
import DisconnectReply from './replies/disconnect-reply'
import DatabasesReply from './replies/databases-reply'
import TablesReply from './replies/tables-reply'
import TableDataReply from './replies/table-data-reply'
import DescribeTableReply from './replies/describe-table-reply'
import NewRecordReply from './replies/new-record-reply'
import DeleteRecordReply from './replies/delete-record-reply'

/**
 * Define which request channels gets handled by which function.
 */
let channels = {
  'get-connections-request': GetConnectionsReply.handle,
  'get-connections-request-sync': GetConnectionsReply.handleSync,
  'delete-connection-request': DeleteConnectionReply.handle,
  'connect-request': ConnectReply.handle,
  'disconnect-request': DisconnectReply.handle,
  'databases-request': DatabasesReply.handle,
  'tables-request': TablesReply.handle,
  'table-data-request': TableDataReply.handle,
  'describe-table-request': DescribeTableReply.handle,
  'describe-table-request-sync': DescribeTableReply.handleSync,
  'new-record-request': NewRecordReply.handle,
  'delete-record-request': DeleteRecordReply.handle
}

export default {
  /**
   * Register each defined reply handler to it's channel.
   */
  registerReplies () {
    Object.keys(channels)
      .forEach(channel => {
        ipcMain.on(channel, channels[channel])
      })
  }
}
