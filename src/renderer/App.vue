<template>
  <div id="app-container" class="window" v-if="initialized">
    <LoadingIndicator v-if="loading" />

    <Toolbar />

    <WindowContent v-if="!is_connected">
      <ConnectionManager />
    </WindowContent>

    <WindowContent v-else>
      <PaneGroup>
        <Sidebar />

        <ResultsListing />
      </PaneGroup>
    </WindowContent>
  </div>
  <div id="app-container" class="window" v-else>
    <LoadingIndicator />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import swal from 'sweetalert'

import WindowContent from './Views/Layout/WindowContent'
import PaneGroup from './Views/Layout/PaneGroup'

import LoadingIndicator from './Components/LoadingIndicator'
import Toolbar from './Components/Toolbar'
import Sidebar from './Components/Sidebar'

import ConnectionManager from './Views/ConnectionManager/ConnectionManager'
import ResultsListing from './Views/ResultsListing/ResultsListing'

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

  computed: {
    ...mapState([
      'initialized',
      'is_connected',
      'loading'
    ])
  },

  methods: {
    ...mapActions([
      'init'
    ])
  },

  created () {
    this.init()
  }
}
</script>

<style>
@import "../../static/css/photon.min.css";
@import "../../static/css/style.css";
</style>
