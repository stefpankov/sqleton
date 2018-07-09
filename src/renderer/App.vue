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

import WindowContent from './components/layout/WindowContent'
import PaneGroup from './components/layout/PaneGroup'

import LoadingIndicator from './components/widgets/LoadingIndicator'
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'

import ConnectionManager from './components/views/ConnectionManager/ConnectionManager'
import ResultsListing from './components/views/ResultsListing/ResultsListing'

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
