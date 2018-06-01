<template>
  <div id="app-container" class="window">
    <LoadingIndicator v-if="loading" />

    <Toolbar v-show="is_connected"
      @back="request('disconnect-request')"
      @refresh="requestTableData(selected_table)"
    />

    <Connect v-if="!is_connected" @connect="request('connect-request', $event)" />
    <DatabaseExplorer v-else
      :databases="databases"
      :tables="tables"
      :fields="table_data_fields"
      :results="table_data_results"
      :results-type="results_type"
      @request-tables="request('tables-request', $event)"
      @request-table-data="requestTableData"
      @request-describe-table="request('describe-table-request', selected_table)"
    />
  </div>
</template>

<script>
import swal from 'sweetalert'
import LoadingIndicator from './LoadingIndicator'
import Toolbar from './Toolbar'
import Connect from './Views/CreateAConnection/CreateAConnection'
import DatabaseExplorer from './Views/DatabaseExplorer/DatabaseExplorer'

import requestUtils from './Ipc/request-utils'
import channels from './Ipc/channels'

export default {
  name: 'App',

  components: {
    LoadingIndicator,
    Connect,
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
      results_type: 'table_data',
      table_data_fields: [],
      table_data_results: [],
      loading: false
    }
  },

  methods: {
    resetState () {
      this.databases = []
      this.tables = []
      this.selected_table = ''
      this.table_data_fields = []
      this.table_data_results = []
    },

    errorModal (error) {
      swal({
        title: 'Error',
        text: error.message,
        button: { text: 'Close', className: 'btn btn-primary' }
      })
    },

    handleError (error) {
      this.loading = false
      this.errorModal(error)
    },

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

      requestUtils.request('table-data-request', table_name)
      this.loading = true
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
      this.table_data_fields = []
      this.table_data_results = []
      this.results_type = 'table_data'

      this.tables = response.results.map(res => res[response.fields[0].name])
      this.loading = false
    },

    handleDescribeTable (response) {
      this.results_type = 'describe_table'
      this.table_data_fields = response.fields
      this.table_data_results = response.results

      this.loading = false
    },

    handleTableData (response) {
      this.results_type = 'table_data'
      this.table_data_fields = response.fields
      this.table_data_results = response.results

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

