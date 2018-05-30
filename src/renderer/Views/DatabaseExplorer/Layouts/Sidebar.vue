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
      <nav class="nav-group">
        <h5 class="nav-group-title">Tables</h5>
        <a v-for="table in tables" class="nav-group-item"
          :class="{ active: table === active_table }"
          :key="table"
          @click="selectTable(table)"
        >
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
      active_table: null
    }
  },

  watch: {
    selected_database: 'requestTables'
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
</style>
