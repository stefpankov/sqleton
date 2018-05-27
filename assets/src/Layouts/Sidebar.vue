<template>
  <div id="sidebar">
    <div class="sidebar-section">
      <div class="database-selector">
        <select v-model="selected_database">
          <option :value="null">Select a database</option>
          <option v-for="(db, index) in databases" :value="index" :key="index">{{ db }}</option>
        </select>
      </div>
    </div>
    <div class="sidebar-section">
      <h5 class="section-title">Tables</h5>
      <nav class="nav-group">
        <span class="nav-item">Item</span>
        <span class="nav-item">Item with more text</span>
        <span class="nav-item">Item</span>
        <span class="nav-item">Item with text</span>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',

  data () {
    return {
      databases: [
        'database1',
        'sqeleton_test',
        'main_db',
      ],
      selected_database: null
    }
  }
}
</script>

<style>
#sidebar {
  max-width: 200px;

  background-color: #f5f5f4;
}

.sidebar-section {
  padding: 10px;
  border-bottom: 1px solid #d6c6d6;
}
.section-title {
  margin: 0px;
}

.database-selector select {
  width: 100%;
  background: #ffffff;
  border-radius: 3px;
}

.nav-group {
  display: flex;
  flex-direction: column;

  font-size: 14px;
}
.nav-item {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-right: 10px;
}
</style>
