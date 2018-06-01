<template>
  <div id="create-connection" class="window-content">
    <form @submit.prevent="connect">
      <div class="form-group">
        <label>Host:</label>
        <input type="text" class="form-control" placeholder="localhost"
          v-model="credentials.host"
        >
      </div>
      <div class="form-group">
        <label>Port:</label>
        <input type="text" class="form-control" placeholder="3306"
          v-model="credentials.port"
        >
      </div>
      <div class="form-group">
        <label>Username:</label>
        <input type="text" class="form-control" placeholder="user"
          v-model="credentials.user"
        >
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" class="form-control"
          v-model="credentials.password"
        >
      </div>

      <div class="form-group">
        <label>Database (optional):</label>
        <input type="text" class="form-control"
          v-model="credentials.database"
        >
      </div>

      <div class="form-group">
        <input type="submit" class="btn btn-large btn-positive" value="Connect">
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateAConnection',

  data () {
    return {
      credentials: {
        host: 'localhost',
        port: '3306',
        user: '',
        password: '',
        database: ''
      }
    }
  },

  methods: {
    connect () {
      this.$emit('connect', this.credentials)
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

