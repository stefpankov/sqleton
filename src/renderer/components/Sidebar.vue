<template>
  <div class="pane pane-sm sidebar">
    <div class="sidebar-section">
      <div class="database-selector">
        <select v-model="selected_database">
          <option :value="null">Select a database</option>
          <option v-for="(db, index) in databases" :value="index" :key="index">{{ db }}</option>
        </select>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="table-filter">
        <h5 class="nav-group-title">Filter tables by name</h5>
        <input type="text" v-model="table_filter" class="form-control" placeholder="Table name">
      </div>
    </div>

    <div class="sidebar-section">
      <nav class="nav-group">
        <h5 class="nav-group-title">Tables</h5>
        <a v-for="table in filtered_tables" class="nav-group-item"
          :class="{ active: table === selected_table }"
          :key="table"
          :title="`Select ${table}`"
          @click="selectTable(table)"
        >
          <span class="icon icon-search" :title="`Describe ${table}`"
            @click.stop="requestDescribeTable(table)"
          ></span>
          {{ table }}
        </a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Sidebar',

  data () {
    return {
      selected_database: null,
      table_filter: ''
    }
  },

  watch: {
    selected_database: 'requestTables'
  },

  computed: {
    ...mapState([
      'databases',
      'tables',
      'selected_table'
    ]),

    filtered_tables () {
      if (this.table_filter) {
        return this.tables.filter(table => table.includes(this.table_filter))
      }

      return this.tables
    }
  },

  methods: {
    ...mapActions([
      'request',
      'requestTableData',
      'requestDescribeTable'
    ]),

    requestTables () {
      if (this.selected_database !== null) {
        this.request({
          channel: 'tables-request',
          payload: this.databases[this.selected_database]
        })
      }
    },

    selectTable (table) {
      this.requestTableData({ table })
    }
  }
}
</script>

<style>
#sidebar {
  max-width: 200px;
  height: 100%;

  background-color: #f5f5f4;
}

.sidebar-section {
  padding-bottom: 10px;
  border-bottom: 1px solid #d6c6d6;
}

.database-selector {
  padding: 10px 10px 0 10px;
}

.database-selector select {
  width: 100%;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid #ddd;
}

.table-filter {
  padding: 10px 10px 0 10px;
}
.table-filter .nav-group-title {
  padding: 0;
  margin-bottom: 5px;
}
</style>
