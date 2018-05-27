<template>
  <div id="app-container">
    <Sidebar />
  </div>
</template>

<script>
import Sidebar from './Layouts/Sidebar'

export default {
  name: 'App',

  components: {
    Sidebar
  },

  data () {
    return {}
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Roboto, sans-serif;
}

#app-container {
  display: flex;
  height: 100vh;
}
</style>

