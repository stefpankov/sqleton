import { deleteConnection } from '../../settings/settings-manager'

export default {
  handle (event, connection_index) {
    let saved_connections = deleteConnection(connection_index)

    event.sender.send('delete-connection-response', {
      success: true,
      saved_connections
    })
  }
}
