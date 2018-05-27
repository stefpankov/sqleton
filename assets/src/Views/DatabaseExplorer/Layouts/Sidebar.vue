<template>
  <div class="pane-sm sidebar">
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
        <a class="nav-group-item active">
          companies
        </a>
        <a class="nav-group-item">
          users
        </a>
        <a class="nav-group-item">
          company_user
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
  },

  data () {
    return {
      selected_database: null
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
