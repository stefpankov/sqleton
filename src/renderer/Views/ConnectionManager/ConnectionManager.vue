<template>
  <CreateConnection
    v-if="show_create_connection"
    :disable="disable"
    @connect="requestConnect"
    @cancel="show_create_connection = false"
  />
  <div class="card-group" v-else>
    <Card
      v-for="(connection, index) in connections"
      :key="index + connection.name"
    >
      <span slot="title">{{ connection.name }}</span>
      <div slot="body" style="margin: 15px 0">
        <span class="nav-group-item">
          <span class="icon icon-database"></span>
          {{ connection.host }}
        </span>
        <span class="nav-group-item">
          <span class="icon icon-socket"></span>
          {{ connection.port }}
        </span>
        <span class="nav-group-item">
          <span class="icon icon-user"></span>
          {{ connection.user }}
        </span>
      </div>
      <div slot="footer">
        <div class="toolbar-actions">
          <button class="btn btn-negative btn-mini" @click="deleteConnection(index)">
            Delete
          </button>
          <button class="btn btn-positive btn-mini pull-right" @click="connect(connection)">
            Connect
          </button>
        </div>
      </div>
    </Card>

    <Card class="new-connection">
      <span slot="title">New connection</span>
      <span slot="body"
        class="icon icon-plus-circled"
        @click="show_create_connection = true"
      >
      </span>
    </Card>
  </div>
</template>

<script>
import swal from 'sweetalert'
import { mapState, mapActions } from 'vuex'
import Card from '../Layout/Card'
import CreateConnection from './CreateConnection'

export default {
  name: 'ConnectionManager',

  components: {
    Card,
    CreateConnection
  },

  mounted () {
    this.show_create_connection = this.connections.length < 1
  },

  data () {
    return {
      show_create_connection: false
    }
  },

  computed: {
    ...mapState({
      connections: 'saved_connections',
      disable: 'loading'
    })
  },

  methods: {
    ...mapActions([
      'request'
    ]),

    connect (connection) {
      swal({
        title: 'Connection password',
        content: {
          element: 'input',
          attributes: {
            type: 'password'
          }
        },
        button: { text: 'Connect', className: 'btn btn-primary' }
      })
        .then((password) => {
          connection.password = password
          this.requestConnect(connection)
        })
    },

    requestConnect (connection) {
      this.request({ channel: 'connect-request', payload: connection })
    },

    deleteConnection (index) {
      this.request({ channel: 'delete-connection-request', payload: index })
    }
  }
}
</script>

<style>
.card-group {
  padding: 10px;
  width: 100%;
  display: flex;
  align-items: flex-start;
}

.new-connection {
  text-align: center;
  font-size: 70px;
}

.new-connection .icon {
  cursor: pointer;
}
</style>
