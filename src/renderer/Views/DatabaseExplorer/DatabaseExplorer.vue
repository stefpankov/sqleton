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
            :class="{ active: index === active_tab }"
            v-for="(query, index) in queryResults"
            :key="index + query.table"
            @click="showTab(index)"
          >
            {{ query.type }} {{ query.table }}
            <span class="icon icon-cancel icon-close-tab" @click.stop="closeTab(index)"></span>
          </div>
        </div>

        <div class="results-content">
          <Results v-if="queryResults.length > 0"
            v-bind="{
              fields: queryResults[active_tab].fields,
              results: queryResults[active_tab].results
            }"
          />

          <Pagination v-if="queryResults.length > 0 && active_query.type === 'SELECT'"
            :current-page="current_page"
            :items-per-page="10"
            :total-items="active_query.total_results"
            :total-pages="total_pages"
            @go-to-page="requestTableDataPage(active_table, 10, $event)"
            @previous="previousPage(active_table)"
            @next="nextPage(active_table)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar'
import Results from './Results'
import Pagination from './Pagination'

export default {
  name: 'DatabaseExplorer',

  components: {
    Sidebar,
    Results,
    Pagination
  },

  props: {
    databases: Array,
    tables: Array,
    queryResults: Array
  },

  data () {
    return {
      active_tab: 0
    }
  },

  watch: {
    queryResults (data) {
      if (data.length > 0) {
        this.active_tab = this.active_tab >= data.length - 1
          ? data.length - 1
          : this.active_tab
      }
    }
  },

  computed: {
    active_query () {
      if (this.queryResults.length > 0) return this.queryResults[this.active_tab]

      return {}
    },

    active_table () {
      if (this.queryResults.length > 0) return this.active_query.table

      return ''
    },

    current_page () {
      return Math.floor(this.active_query.offset / this.active_query.limit) + 1
    },

    total_pages () {
      return Math.ceil(this.active_query.total_results / this.active_query.limit)
    }
  },

  methods: {
    showTab (index) {
      this.active_tab = index
    },

    closeTab (index) {
      this.$emit('remove-query', index)
    },

    previousPage (table, limit = 10) {
      const page = this.current_page > 1 ? this.current_page - 1 : 1

      this.requestTableDataPage(table, limit, page)
    },

    nextPage (table, limit = 10) {
      const page = this.current_page < this.total_pages ? this.current_page + 1 : this.total_pages

      this.requestTableDataPage(table, limit, page)
    },

    requestTableDataPage (table, limit = 10 , page = 1) {
      this.$emit('request-table-data-page', {
        table,
        limit,
        offset: (page - 1) * limit
      })
    }
  }
}
</script>
