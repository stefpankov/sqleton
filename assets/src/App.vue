<template>
  <div id="app-container" class="window">
    <Connect v-if="!is_connected" @connect="requestConnection" />
    <DatabaseExplorer v-else
      v-bind="{ databases, tables }"
      @request-tables="requestTables"
    />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import Connect from './Views/CreateAConnection/CreateAConnection'
import DatabaseExplorer from './Views/DatabaseExplorer/DatabaseExplorer'

export default {
  name: 'App',

  components: {
    Connect,
    DatabaseExplorer
  },

  data () {
    return {
      is_connected: false,
      databases: [],
      tables: []
    }
  },

  methods: {
    requestConnection (data) {
      ipcRenderer.send('connect-request', data)
    },

    requestDatabases () {
      ipcRenderer.send('db-request')
    },

    requestTables (database_name) {
      ipcRenderer.send('tables-request', database_name)
    }
  },

  created () {
    ipcRenderer.on('connect-response', (event, response) => {
      if (response.success) {
        this.is_connected = true
        this.requestDatabases()
      } else {
        console.log(response.message)
      }
    })

    ipcRenderer.on('db-response', (event, response) => {
      if (response.success) {
        this.databases = response.results.map(res => res[response.fields[0].name])
      } else {
        console.log(response)
      }
    })

    ipcRenderer.on('tables-response', (event, response) => {
      if (response.success) {
        this.tables = response.results.map(res => res[response.fields[0].name])
      } else {
        console.log(response)
      }
    })
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
#app-container {
  /* display: flex;
  height: 100vh; */
}
</style>

