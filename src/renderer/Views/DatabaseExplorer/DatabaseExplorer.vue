<template>
  <div id="database-explorer" class="window-content">
    <div class="pane-group">
      <Sidebar
        v-bind="{ databases, tables }"
        @request-tables="$listeners['request-tables']"
        @request-table-data="requestTableData"
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

        <div class="results-content" v-if="queryResults.length > 0">
          <Results
            v-bind="{
              fields: queryResults[active_tab].fields,
              results: queryResults[active_tab].results
            }"
          />

          <div class="filters" v-if="active_query.type === 'SELECT'">
            <div class="items-per-page">
              <span>Items per page:</span>
              <select v-model="items_per_page">
                <option v-for="n in [10, 20, 50, 100]" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </div>

          <Pagination v-if="active_query.type === 'SELECT'"
            :current-page="current_page"
            :items-per-page="items_per_page"
            :total-items="active_query.total_results"
            :total-pages="total_pages"
            @go-to-page="requestTableData(active_table, items_per_page, $event)"
            @previous="previousPage(active_table, items_per_page)"
            @next="nextPage(active_table, items_per_page)"
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
      active_tab: 0,
      items_per_page: 10
    }
  },

  watch: {
    queryResults (data) {
      if (data.length > 0) {
        this.active_tab = this.active_tab >= data.length - 1
          ? data.length - 1
          : this.active_tab
      }
    },

    items_per_page (value) {
      this.requestTableData(undefined, value, 1)
    }
  },

  computed: {
    /**
     * The query results that are currently shown in the active tab.
     *
     * @returns {Object}
     */
    active_query () {
      if (this.queryResults.length > 0) return this.queryResults[this.active_tab]

      return {}
    },

    /**
     * The table name for the active query results.
     *
     * @returns {String}
     */
    active_table () {
      if (this.queryResults.length > 0) return this.active_query.table

      return ''
    },

    /**
     * The current page in the pagination.
     *
     * @returns {Number}
     */
    current_page () {
      return Math.floor(this.active_query.offset / this.active_query.limit) + 1
    },

    /**
     * The total number of pages in the pagination.
     *
     * @returns {Number}
     */
    total_pages () {
      return Math.ceil(this.active_query.total_results / this.active_query.limit)
    }
  },

  methods: {
    /**
     * Change the active tab.
     *
     * @param {Number} index
     */
    showTab (index) {
      this.active_tab = index
    },

    /**
     * Emit a remove query event which the parent component will use to remove a query
     * effectively removing the tab showing the results.
     *
     * @param {Number} index
     */
    closeTab (index) {
      this.$emit('remove-query', index)
    },

    /**
     * Request the previous page for the query results.
     *
     * @param {String} table
     * @param {Number} limit
     */
    previousPage (table, limit = 10) {
      const page = this.current_page > 1 ? this.current_page - 1 : 1

      this.requestTableData(table, limit, page)
    },

    /**
     * Request the next page for the query results.
     *
     * @param {String} table
     * @param {Number} limit
     */
    nextPage (table, limit = 10) {
      const page = this.current_page < this.total_pages
        ? this.current_page + 1
        : this.total_pages

      this.requestTableData(table, limit, page)
    },

    /**
     * Emit an event to request a page of table data.
     *
     * @param {String} table
     * @param {Number} limit
     * @param {Number} page
     */
    requestTableData (table, limit = 10 , page = 1) {
      this.$emit('request-table-data', {
        table,
        limit,
        offset: (page - 1) * limit
      })
    }
  }
}
</script>

<style>
.filters {
  margin: 10px 10px 0;
}

.items-per-page select {
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid #ddd;
}
</style>

