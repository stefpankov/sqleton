<template>
  <Pane>
    <div class="tab-group" v-if="query_results.length > 0">
      <div class="tab-item"
        :class="{ active: index === active_tab }"
        v-for="(query, index) in query_results"
        :key="index + query.table"
        @click="showTab(index)"
      >
        {{ query.type }} {{ query.table }}
        <span class="icon icon-cancel icon-close-tab" @click.stop="closeTab(index)"></span>
      </div>
    </div>

    <div class="new-record" v-if="show_new_record_form">
      <NewRecordForm
        :columns="active_query_columns"
        @cancel="show_new_record_form = false"
        @submit="saveNewRecord"
      />
    </div>

    <div class="results-content" v-else-if="query_results.length > 0">
      <Results
        v-bind="{
          fields: query_results[active_tab].fields,
          results: query_results[active_tab].results
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
        @previous="previousPage"
        @next="nextPage"
      />
    </div>
  </Pane>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Pane from '../../layout/Pane'
import Results from './Results'
import Pagination from './Pagination'
import NewRecordForm from './NewRecordForm'

export default {
  name: 'ResultsListing',

  components: {
    Pane,
    Results,
    Pagination,
    NewRecordForm
  },

  data () {
    return {
      result_count: 0,
      active_tab: 0,
      items_per_page: 10,
      show_new_record_form: false
    }
  },

  watch: {
    /**
     * Handle tab switching when query results get updated.
     * If we get more results than before, it means we have new tabs so we need to switch to the latest tab.
     * If we get less results, it means tabs were removed so we need to be smart about which tab we'll switch to,
     *    if currently active tab is out of bounds, switch to last available tab, else keep active tab.
     *
     * @param {Array} data The query results data
     */
    query_results (data) {
      const old_count = this.result_count

      if (old_count < data.length) {
        this.active_tab = data.length - 1
      } else {
        this.active_tab = this.active_tab >= data.length - 1
          ? data.length - 1
          : this.active_tab
      }

      this.result_count = data.length
    },

    /**
     * When the items per page filter changes, request the table data again.
     *
     * @param {Number} value
     */
    items_per_page (value) {
      this.requestTableData(undefined, value, 1)
    },

    /**
     * @param {Number} value
     */
    active_tab (query_result_index) {
      const result = this.query_results[query_result_index]

      if (result) {
        this.changeSelectedTable(result.table)
      }
    }
  },

  computed: {
    ...mapState([
      'query_results',
      'databases',
      'tables'
    ]),

    /**
     * The query results that are currently shown in the active tab.
     *
     * @returns {Object}
     */
    active_query () {
      if (this.query_results.length > 0) return this.query_results[this.active_tab]

      return {}
    },

    active_query_columns () {
      if (Array.isArray(this.active_query.fields)) {
        return this.active_query.fields.map(field => ({ name: field.name, type: field.type }))
      }

      return []
    },

    /**
     * The table name for the active query results.
     *
     * @returns {String}
     */
    active_table () {
      if (this.query_results.length > 0) return this.active_query.table

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
    ...mapActions({
      requestTableDataAction: 'requestTableData'
    }),
    ...mapActions([
      'removeQueryResult',
      'changeSelectedTable',
      'newRecord'
    ]),

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
      this.removeQueryResult(index)
    },

    /**
     * Request the previous page for the query results.
     */
    previousPage () {
      const page = this.current_page > 1 ? this.current_page - 1 : 1

      this.requestTableData(this.active_table, this.items_per_page, page)
    },

    /**
     * Request the next page for the query results.
     */
    nextPage () {
      const page = this.current_page < this.total_pages
        ? this.current_page + 1
        : this.total_pages

      this.requestTableData(this.active_table, this.items_per_page, page)
    },

    /**
     * Emit an event to request a page of table data.
     *
     * @param {String} table
     * @param {Number} limit
     * @param {Number} page
     */
    requestTableData (table, limit = 10 , page = 1) {
      this.requestTableDataAction({
        table,
        limit,
        offset: (page - 1) * limit
      })
    },

    saveNewRecord (data) {
      const prepared_data = Object.keys(data).reduce((acc, field) => {
        if (data[field] !== '') {
          acc[field] = data[field]
        }

        return acc
      }, {})

      this.newRecord({
        table: this.active_table,
        data: prepared_data
      })

      this.show_new_record_form = false
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

