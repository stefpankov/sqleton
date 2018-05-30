<template>
  <div id="database-explorer" class="window-content">
    <div class="pane-group">
      <Sidebar
        v-bind="{ databases, tables }"
        @request-tables="$listeners['request-tables']"
        @request-table-data="$listeners['request-table-data']"
      />
      <Results v-bind="{ fields, results }" />
    </div>
  </div>
</template>

<script>
import Sidebar from './Layouts/Sidebar'
import Results from './Layouts/Results'

export default {
  name: 'DatabaseExplorer',

  components: {
    Sidebar,
    Results
  },

  props: {
    databases: Array,
    tables: Array,
    fields: Array,
    results: Array
  }
}
</script>
