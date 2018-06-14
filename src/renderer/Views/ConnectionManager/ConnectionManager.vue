<template>
  <div class="card-group">
    <div class="card empty" v-if="connections.length < 1">
      <header class="toolbar toolbar-header">
        <h1 class="title">No connections</h1>
      </header>
      <div class="card-body" style="text-align:center;font-size:60px">
        <span class="icon icon-plus-squared" title="Create new connection"
          @click="newConnection"
        ></span>
      </div>
      <footer class="toolbar toolbar-footer">
      </footer>
    </div>

    <template v-else>
      <div class="card"
        v-for="(connection, index) in connections"
        :key="index + connection.name"
      >
        <h5>{{ connection.name }}</h5>
        <p>{{ connection.type }}</p>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ConnectionManager',

  props: {
    connections: Array
  },

  methods: {
    newConnection () {
      //
    }
  }
}
</script>

<style>
.card-group {
  padding: 10px;
  width: 100%;
}
.card {
  background: white;
  border-radius: 3px;
  border: 1px solid #cecece;
  width: 200px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>


