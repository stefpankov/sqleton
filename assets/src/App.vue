<template>
  <div id="app-container" class="window">
    <Connect v-if="!is_connected" @connect="is_connected = true" />
    <DatabaseExplorer v-else :databases="databases" />
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
    }
  },

  methods: {
    requestDatabases () {
      ipcRenderer.send('db-request')
    }
  },

  created () {
    ipcRenderer.on('db-response', (event, dbs) => {
      this.databases = dbs
    })

    this.requestDatabases();
  }
}
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
}
#app-container {
  /* display: flex;
  height: 100vh; */
}
</style>

