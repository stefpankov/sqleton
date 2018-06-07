<template>
  <div id="database-explorer" class="window-content">
    <div class="pane-group">
      <Sidebar
        v-bind="{ databases, tables }"
        @request-tables="$listeners['request-tables']"
        @request-table-data="$listeners['request-table-data']"
        @request-describe-table="$listeners['request-describe-table']"
      />

      <div class="pane">
        <div class="tab-group" v-if="queryResults.length > 0">
          <div class="tab-item"
            :class="{ active: index === show_tab }"
            v-for="(query, index) in queryResults"
            :key="index + query.table"
            @click="showTab(index)"
          >
            <span class="icon icon-cancel icon-close-tab" @click.stop="closeTab(index)"></span>
            {{ query.type }} {{ query.table }}
          </div>
        </div>

        <div class="results-content">
          <Results v-if="queryResults.length > 0"
            v-bind="{
              fields: queryResults[show_tab].fields,
              results: queryResults[show_tab].results
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar'
import Results from './Results'

export default {
  name: 'DatabaseExplorer',

  components: {
    Sidebar,
    Results
  },

  props: {
    databases: Array,
    tables: Array,
    queryResults: Array
  },

  data () {
    return {
      show_tab: 0
    }
  },

  methods: {
    showTab (index) {
      this.show_tab = index
    },

    closeTab (index) {
      if (this.show_tab === index) {
        this.show_tab = index > 0 ? index - 1 : 0
      }

      this.$emit('remove-query', index)
    },

    requestTableData () {
      this.$emit('request-table-data')
    }
  }
}
</script>
