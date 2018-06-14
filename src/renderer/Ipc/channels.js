export default {
  data () {
    return {
      channels: [
        {
          name: 'get-connections-response',
          callback: this.handleGetConnections,
          errorCallback: this.handleError
        },
        {
          name: 'connect-response',
          callback: this.handleConnection,
          errorCallback: this.handleError
        },
        {
          name: 'disconnect-response',
          callback: this.handleDisconnect,
          errorCallback: this.handleError
        },
        {
          name: 'databases-response',
          callback: this.handleDatabases,
          errorCallback: this.handleError
        },
        {
          name: 'tables-response',
          callback: this.handleTables,
          errorCallback: this.handleError
        },
        {
          name: 'table-data-response',
          callback: this.handleTableData,
          errorCallback: this.handleError
        },
        {
          name: 'describe-table-response',
          callback: this.handleDescribeTable,
          errorCallback: this.handleError
        }
      ]
    }
  }
}
