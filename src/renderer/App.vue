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
import LoadingIndicator from './LoadingIndicator'
import Connect from './Views/CreateAConnection/CreateAConnection'
import DatabaseExplorer from './Views/DatabaseExplorer/DatabaseExplorer'

import messageUtils from './message-utils'

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
    handleError (error) {
      this.loading = false
    },

    requestConnection (data) {
      messageUtils.request('connect-request', data)
      this.loading = true
    },

    requestTables (database_name) {
      messageUtils.request('tables-request', database_name)
      this.loading = true
    },

    handleConnection () {
      this.is_connected = true
      messageUtils.request('db-request')
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
    messageUtils.subscribeToChannels(this.channels)
  }
}
</script>

<style>
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
</style>

