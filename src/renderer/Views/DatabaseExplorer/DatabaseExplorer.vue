<template>
  <div id="database-explorer" class="window-content">
    <div class="pane-group">
      <Sidebar
        v-bind="{ databases, tables }"
        @request-tables="$listeners['request-tables']"
        @request-table-data="$listeners['request-table-data']"
      />

      <div class="pane">
        <div class="tab-group" v-if="fields.length > 0">
          <div class="tab-item"
            :class="{ active: resultsType === 'table_data'}"
            @click="requestTableData"
          >
            Select data
          </div>
          <div class="tab-item"
            :class="{ active: resultsType === 'describe_table'}"
            @click="requestDescribeTable"
          >
            Table structure
          </div>
          <div v-show="false" class="tab-item">
            Foreign keys
          </div>
          <div v-show="false" class="tab-item">
            New item
          </div>
        </div>
        <Results v-bind="{ fields, results }" />
      </div>
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
    results: Array,
    resultsType: {
      type: String,
      validator: function (value) {
        return ['table_data', 'describe_table'].indexOf(value) > -1
      }
    }
  },

  methods: {
    requestTableData () {
      if (this.resultsType !== 'table_data') {
        this.$emit('request-table-data')
      }
    },

    requestDescribeTable () {
      if (this.resultsType !== 'describe_table') {
        this.$emit('request-describe-table')
      }
    }
  }
}
</script>
