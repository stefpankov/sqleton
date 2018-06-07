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
          :class="{ active: table === active_table }"
          :key="table"
          :title="`Select ${table}`"
          @click="selectTable(table)"
        >
          <span class="icon icon-search" :title="`Describe ${table}`"
            @click.stop="$emit('request-describe-table', table)"
          ></span>
          {{ table }}
        </a>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',

  props: {
    databases: Array,
    tables: Array,
  },

  data () {
    return {
      selected_database: null,
      active_table: null,
      table_filter: ''
    }
  },

  watch: {
    selected_database: 'requestTables'
  },

  computed: {
    filtered_tables () {
      if (this.table_filter) {
        return this.tables.filter(table => table.includes(this.table_filter))
      }

      return this.tables
    }
  },

  methods: {
    requestTables () {
      if (this.selected_database !== null) {
        this.$emit('request-tables', this.databases[this.selected_database])
      }
    },

    selectTable (table) {
      this.active_table = table
      this.$emit('request-table-data', table)
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
}

.table-filter {
  padding: 10px 10px 0 10px;
}
.table-filter .nav-group-title {
  padding: 0;
  margin-bottom: 5px;
}
</style>
