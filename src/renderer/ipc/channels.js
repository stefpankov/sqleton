export default [
  {
    name: 'get-connections-response',
    callback: 'handleGetConnections',
    errorCallback: 'handleError'
  },
  {
    name: 'delete-connection-response',
    callback: 'handleDeleteConnection',
    errorCallback: 'handleError'
  },
  {
    name: 'connect-response',
    callback: 'handleConnection',
    errorCallback: 'handleError'
  },
  {
    name: 'disconnect-response',
    callback: 'handleDisconnect',
    errorCallback: 'handleError'
  },
  {
    name: 'databases-response',
    callback: 'handleDatabases',
    errorCallback: 'handleError'
  },
  {
    name: 'tables-response',
    callback: 'handleTables',
    errorCallback: 'handleError'
  },
  {
    name: 'table-data-response',
    callback: 'handleTableData',
    errorCallback: 'handleError'
  },
  {
    name: 'describe-table-response',
    callback: 'handleDescribeTable',
    errorCallback: 'handleError'
  }
]
