<template>
  <header class="toolbar toolbar-header">
    <div class="toolbar-actions">
      <div class="btn-group" v-if="is_connected">
        <button class="btn btn-default" title="Back to connections"
          @click="requestDisconnect"
        >
          <span class="icon icon-left"></span>
        </button>
        <button class="btn btn-default" title="Refresh table data"
          @click="refreshQueryResults"
        >
          <span class="icon icon-cw"></span>
        </button>
      </div>

      <div class="btn-group" v-if="is_connected">
        <button class="btn btn-default" title="New item"
          @click="showNewRecordForm"
        >
          <span class="icon icon-plus-squared icon-text"></span>
          New item
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Toolbar',

  computed: {
    ...mapState([
      'is_connected'
    ])
  },

  methods: {
    ...mapActions([
      'request',
      'refreshQueryResults',
      'showNewRecordForm'
    ]),

    requestDisconnect () {
      this.request({ channel: 'disconnect-request' })
    }
  }
}
</script>

