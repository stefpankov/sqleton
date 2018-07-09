import { getSavedConnections } from '../../settings/settings-manager'

export default {
  handle (event) {
    const saved_connections = getSavedConnections()

    event.sender.send('get-connections-response', {
      success: true,
      saved_connections
    })
  },

  handleSync (event) {
    let saved_connections = getSavedConnections()

    event.returnValue = saved_connections
  }
}
