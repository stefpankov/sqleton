<template>
  <div id="create-connection" class="window-content">
    <form>
      <div class="form-group">
        <label>Host:</label>
        <input type="text" class="form-control" placeholder="localhost">
      </div>
      <div class="form-group">
        <label>Port:</label>
        <input type="text" class="form-control" placeholder="3360">
      </div>
      <div class="form-group">
        <button type="button"
          class="btn btn-large btn-positive"
          @click="connect"
        >
          Connect
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateAConnection',

  methods: {
    connect () {
      this.$emit('connect')
    }
  }
}
</script>

<style scoped>
#create-connection {
  background-color: #f5f5f4;
  justify-content: center;
}
#create-connection form {
  min-width: 300px;
  margin-top: 40px;
}
</style>

