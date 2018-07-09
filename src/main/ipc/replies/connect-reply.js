import connection from '../../database/connection'
import { saveConnectionIfNotExists } from '../../settings/settings-manager'

export default {
  handle (event, credentials) {
    connection.connect(credentials)
      .then(response => {
        const saved_connections = saveConnectionIfNotExists(credentials)

        event.sender.send('get-connections-response', { success: true, saved_connections })
        event.sender.send('connect-response', response)
      })
      .catch(error => {
        console.error('connect reply', error)
        event.sender.send('connect-response', error)
      })
  }
}
