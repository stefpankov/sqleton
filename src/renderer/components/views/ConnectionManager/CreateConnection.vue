<template>
  <div id="create-connection" class="grey-bg">
    <form @submit.prevent="connect">
      <div class="form-group">
        <label>Connection name:</label>
        <input type="text" class="form-control"
          v-model="credentials.name"
          required
        >
      </div>
      <div class="form-group">
        <label>SQL Server:</label>
        <select class="form-control" v-model="credentials.type">
          <option value="mysql">MySQL</option>
          <option value="sqlite">SQLite</option>
        </select>
      </div>
      <div v-show="credentials.type==='sqlite'">
        <div class="form-group">
          <label>DB File:</label>
          <input type="text" class="form-control"
          @click="chooseFile"
            v-model="credentials.host"
          >
        </div>
      </div>

      <div v-show="credentials.type==='mysql'">
        <div class="form-group">
          <label>Host:</label>
          <input type="text" class="form-control"
            v-model="credentials.host"
          >
        </div>
        <div class="form-group">
          <label>Port:</label>
          <input type="text" class="form-control"
            v-model="credentials.port"
          >
        </div>
        <div class="form-group">
          <label>Username:</label>
          <input type="text" class="form-control"
            v-model="credentials.user"
          >
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input type="password" class="form-control"
            v-model="credentials.password"
          >
        </div>
      </div>

      <div class="form-group">
        <button type="button" class="btn btn-large btn-negative"
          @click="$emit('cancel')"
        >
          Cancel
        </button>

        <input type="submit" class="btn btn-large btn-positive pull-right" value="Connect"
          :disabled="disable"
        >
      </div>
    </form>
  </div>
</template>

<script>
const { dialog } = require('electron').remote
export default {
  name: 'CreateConnection',

  props: {
    disable: { type: Boolean, default: false }
  },

  data () {
    return {
      credentials: {
        name: 'My Connection',
        type: 'mysql',
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
    },
    chooseFile() {
      this.credentials.host=dialog.showOpenDialog({ 
        properties: ['openFile'],
        filters: [{name:'DB Files',extensions:['db']}, {name:'All Files', extensions:['*']}]
        })[0]

    }
  }
}
</script>

<style scoped>
#create-connection {
  display: flex;
  width: 100%;
  justify-content: center;
}
form {
  min-width: 300px;
  margin-top: 40px;
}
</style>
