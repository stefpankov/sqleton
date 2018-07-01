<template>
  <div id="app-container" class="window" v-if="initialized">
    <LoadingIndicator v-if="loading" />

    <Toolbar
      :is-connected="is_connected"
      @back="request('disconnect-request')"
      @refresh="refreshQueryResults"
    />

    <WindowContent v-if="!is_connected">
      <ConnectionManager
        :connections="saved_connections"
        :disable="loading"
        @connect="request('connect-request', $event)"
        @delete-connection="request('delete-connection-request', $event)"
      />
    </WindowContent>

    <WindowContent v-else>
      <PaneGroup>
        <Sidebar v-bind="{ databases, tables, activeTable: selected_table }"
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
          @active-query-result-changed="changeSelectedTable"
        />
      </PaneGroup>
    </WindowContent> -->
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
      'saved_connections',
      'is_connected',
      'databases',
      'tables',
      'selected_table',
      'query_results',
      'loading'
    ])
  },

  methods: {
    ...mapActions([
      'init',
      'requestTableData',
      'requestDescribeTable',
      'refreshQueryResults',
      'removeQueryResult',
      'changeSelectedTable'
    ]),
    ...mapActions({
      storeRequest: 'request'
    }),

    request (channel, payload) {
      this.storeRequest({ channel, payload })
    }
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
