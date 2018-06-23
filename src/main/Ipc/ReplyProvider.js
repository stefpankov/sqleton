import { ipcMain } from 'electron'
import ConnectReply from './Replies/ConnectReply'
import GetConnectionsReply from './Replies/GetConnectionsReply'
import DeleteConnectionReply from './Replies/DeleteConnectionReply'
import DisconnectReply from './Replies/DisconnectReply'
import DatabasesReply from './Replies/DatabasesReply'
import TablesReply from './Replies/TablesReply'
import TableDataReply from './Replies/TableDataReply'
import DescribeTableReply from './Replies/DescribeTableReply'

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
