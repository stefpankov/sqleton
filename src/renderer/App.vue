<template>
  <div id="app-container" class="window">
    <LoadingIndicator v-if="loading" />

    <Toolbar v-show="is_connected"
      @back="request('disconnect-request')"
      @refresh="requestTableData(selected_table)"
    />

    <CreateConnection
      v-if="!is_connected"
      @connect="request('connect-request', $event)"
    />

    <DatabaseExplorer v-else
      :databases="databases"
      :tables="tables"
      :query-results="query_results"
      @request-tables="request('tables-request', $event)"
      @request-table-data="requestTableData"
      @request-describe-table="requestDescribeTable"
      @remove-query="removeQueryResult"
    />
  </div>
</template>

<script>
import swal from 'sweetalert'
import LoadingIndicator from './Components/LoadingIndicator'
import Toolbar from './Components/Toolbar'
import CreateConnection from './Views/CreateConnection/CreateConnection'
import DatabaseExplorer from './Views/DatabaseExplorer/DatabaseExplorer'

import requestUtils from './Ipc/request-utils'
import channels from './Ipc/channels'

export default {
  name: 'App',

  components: {
    LoadingIndicator,
    CreateConnection,
    DatabaseExplorer,
    Toolbar
  },

  mixins: [
    channels
  ],

  data () {
    return {
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

    requestTableData ({ table, limit, offset }) {
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
  }
}
</script>

<style>
@import "../../static/css/photon.min.css";
@import "../../static/css/style.css";
</style>

