<template>
  <div id="app-container" class="window">
    <LoadingIndicator v-if="loading" />

    <Toolbar v-show="is_connected"
      @back="request('disconnect-request')"
      @refresh="refreshQueryResults"
    />

    <WindowContent v-if="!is_connected" class="content-center grey-bg">
      <ConnectionManager
        :connections="saved_connections"
        :disable="loading"
        @connect="request('connect-request', $event)"
      />
    </WindowContent>

    <WindowContent v-else>
      <PaneGroup>
        <Sidebar v-bind="{ databases, tables }"
          @request-tables="request('tables-request', $event)"
          @request-table-data="requestTableData"
          @request-describe-table="requestDescribeTable"
        />

        <ResultsListing
          :databases="databases"
          :tables="tables"
          :query-results="query_results"
          @request-table-data="requestTableData"
          @remove-query="removeQueryResult"
        />
      </PaneGroup>
    </WindowContent>
  </div>
</template>

<script>
import swal from 'sweetalert'

import WindowContent from './Views/Layout/WindowContent'
import PaneGroup from './Views/Layout/PaneGroup'

import LoadingIndicator from './Components/LoadingIndicator'
import Toolbar from './Components/Toolbar'
import Sidebar from './Components/Sidebar'

import ConnectionManager from './Views/ConnectionManager/ConnectionManager'
import ResultsListing from './Views/ResultsListing/ResultsListing'

import requestUtils from './Ipc/request-utils'
import channels from './Ipc/channels'

export default {
  name: 'App',

  components: {
    WindowContent,
    PaneGroup,
    LoadingIndicator,
    Toolbar,
    Sidebar,
    ConnectionManager,
    ResultsListing
  },

  mixins: [
    channels
  ],

  data () {
    return {
      saved_connections: [],
      is_connected: false,
      databases: [],
      tables: [],
      selected_table: '',
      query_results: [],
      loading: false
    }
  },

  methods: {
    resetState () {
      this.databases = []
      this.tables = []
      this.selected_table = ''
      this.query_results = []
    },

    /**
     * Remove a query result by given index.
     *
     * @param {Number} index
     */
    removeQueryResult (index) {
      this.query_results.splice(index, 1)
    },

    /**
     * Check whether table already has results for a specific type of query.
     *
     * @param {String} query_type
     * @param {String} table_name
     *
     * @returns {Boolean}
     */
    queryResultExists (query_type, table_name) {
      return this.query_results
        .findIndex(query_result => {
          return query_result.type === query_type && query_result.table === table_name
        }) > -1
    },

    /**
     * Create a sweetalert error modal with a message from an error object.
     *
     * @param {Object} error
     */
    errorModal (error) {
      swal({
        title: 'Error',
        text: error.message,
        button: { text: 'Close', className: 'btn btn-primary' }
      })
    },

    /**
     * Stop loading and open an error modal.
     *
     * @param {Object} error
     */
    handleError (error) {
      this.loading = false
      this.errorModal(error)
    },

    /**
     * Wrapper around the requestUtils method of the same name.
     * Used to do component specific actions before or after calling that method.
     *
     * @param {String} channel
     * @param {any} payload
     */
    request (channel, payload) {
      requestUtils.request(channel, payload)
      this.loading = true
    },

    /**
     * Send a new table data request for each query result to refresh them.
     */
    refreshQueryResults () {
      this.query_results.forEach(query => {
        this.requestTableData({
          table: query.table,
          limit: query.limit,
          offset: query.offset
        })
      })
    },

    requestTableData ({ table, limit = 10, offset = 0 }) {
      if (table) {
        this.selected_table = table
      } else {
        table = this.selected_table
      }

      this.request('table-data-request', { table, limit, offset })
    },

    requestDescribeTable (table_name) {
      this.selected_table = table_name

      if (!this.queryResultExists('DESCRIBE', table_name)) {
        this.request('describe-table-request', table_name)
      }

    },

    handleGetConnections ({ saved_connections }) {
      this.saved_connections = saved_connections
      this.loading = false
    },

    handleConnection () {
      this.is_connected = true
      requestUtils.request('databases-request')
      this.loading = true
    },

    handleDisconnect () {
      this.is_connected = false
      this.resetState()
      this.loading = false
    },

    handleDatabases (response) {
      this.resetState()
      this.databases = response.results.map(res => res[response.fields[0].name])
      this.loading = false
    },

    handleTables (response) {
      this.selected_table = ''
      this.query_results = []

      this.tables = response.results.map(res => res[response.fields[0].name])
      this.loading = false
    },

    handleDescribeTable (response) {
      this.query_results.push(Object.assign(response, { type: 'DESCRIBE' }))

      this.loading = false
    },

    handleTableData (response) {
      const index = this.query_results.findIndex(result => result.table === response.table)
      const data = Object.assign(response, { type: 'SELECT' })

      if (index > -1) {
        this.query_results.splice(index, 1, data)
      } else {
        this.query_results.push(data)
      }

      this.loading = false
    }
  },

  created () {
    requestUtils.subscribeToChannels(this.channels)

    this.request('get-connections-request')
  }
}
</script>

<style>
@import "../../static/css/photon.min.css";
@import "../../static/css/style.css";
</style>

