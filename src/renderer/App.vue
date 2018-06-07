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

    requestTableData (table_name) {
      if (table_name) {
        this.selected_table = table_name
      } else {
        table_name = this.selected_table
      }

      if (!this.queryResultExists('SELECT', table_name)) {
        this.request('table-data-request', table_name)
      }
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
      this.query_results.push({
        type: 'DESCRIBE',
        table: this.selected_table,
        fields: response.fields,
        results: response.results
      })

      this.loading = false
    },

    handleTableData (response) {
      this.query_results.push({
        type: 'SELECT',
        table: this.selected_table,
        fields: response.fields,
        results: response.results
      })

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

.my-ui-text {
  -webkit-user-select: none;
  user-select: none;
}

body {
  font-family: 'Roboto', sans-serif;
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background: #aaaaaa
}
::-webkit-scrollbar-thumb {
  background: #757272;
}
/* #app-container {
  display: flex;
  height: 100vh;
} */

.swal-modal .swal-title {
  border-bottom: 1px solid #c2c0c2;
  min-height: 22px;
  box-shadow: inset 0 1px 0 #f5f4f5;
  background-color: #e8e6e8;
  background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0,#e8e6e8),color-stop(100%,#d1cfd1));
  background-image: -webkit-linear-gradient(top,#e8e6e8 0,#d1cfd1 100%);
  background-image: linear-gradient(to bottom,#e8e6e8 0,#d1cfd1 100%);

  margin: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-size: 16px;
  margin-bottom: 30px;
  font-weight: normal;
  padding: 5px;
}

.swal-footer {
  border-top: 1px solid #c2c0c2;
  min-height: 22px;
  box-shadow: inset 0 1px 0 #f5f4f5;
  background-color: #e8e6e8;
  background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0,#e8e6e8),color-stop(100%,#d1cfd1));
  background-image: -webkit-linear-gradient(top,#e8e6e8 0,#d1cfd1 100%);
  background-image: linear-gradient(to bottom,#e8e6e8 0,#d1cfd1 100%);

  padding: 0;
  margin-top: 30px;
}
</style>

