<template>
  <div id="app-container" class="window">
    <LoadingIndicator v-if="loading" />

    <Connect v-if="!is_connected" @connect="requestConnection" />
    <DatabaseExplorer v-else
      v-bind="{ databases, tables }"
      @request-tables="requestTables"
    />
  </div>
</template>

<script>
import swal from 'sweetalert'
import LoadingIndicator from './LoadingIndicator'
import Connect from './Views/CreateAConnection/CreateAConnection'
import DatabaseExplorer from './Views/DatabaseExplorer/DatabaseExplorer'

import requestUtils from './Ipc/request-utils'

export default {
  name: 'App',

  components: {
    LoadingIndicator,
    Connect,
    DatabaseExplorer
  },

  data () {
    return {
      is_connected: false,
      databases: [],
      tables: [],
      loading: false,
      channels: [
        {
          name: 'connect-response',
          callback: this.handleConnection,
          errorCallback: this.handleError
        },
        {
          name: 'db-response',
          callback: this.handleDatabases,
          errorCallback: this.handleError
        },
        {
          name: 'tables-response',
          callback: this.handleTables,
          errorCallback: this.handleError
        }
      ]
    }
  },

  methods: {
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

    requestConnection (data) {
      requestUtils.request('connect-request', data)
      this.loading = true
    },

    requestTables (database_name) {
      requestUtils.request('tables-request', database_name)
      this.loading = true
    },

    handleConnection () {
      this.is_connected = true
      requestUtils.request('db-request')
      this.loading = true
    },

    handleDatabases (response) {
      this.databases = response.results.map(res => res[response.fields[0].name])
      this.loading = false
    },

    handleTables (response) {
      this.tables = response.results.map(res => res[response.fields[0].name])
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
  height: 8px;
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

