<template>
  <div id="database-explorer" class="window-content">
    <div class="pane-group">
      <Sidebar :databases="databases" />
      <div class="pane"></div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Layouts/Sidebar'

export default {
  name: 'DatabaseExplorer',

  components: {
    Sidebar
  },

  props: {
    databases: Array,
  },
}
</script>
