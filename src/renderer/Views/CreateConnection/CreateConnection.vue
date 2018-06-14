<template>
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
      <input type="submit" class="btn btn-large btn-positive" value="Connect"
        :disabled="disable"
      >
    </div>
  </form>
</template>

<script>
export default {
  name: 'CreateConnection',

  props: {
    disable: { type: Boolean, default: false }
  },

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
form {
  min-width: 300px;
  margin-top: 40px;
}
</style>

