import connection from '../../Database/Connection'
import { saveConnectionIfNotExists } from '../../Settings/SettingsManager'

export default {
  handle (event, credentials) {
    connection.connect(credentials)
      .then(response => {
        const saved_connections = saveConnectionIfNotExists(credentials)

        event.sender.send('get-connections-response', { success: true, saved_connections })
        event.sender.send('connect-response', response)
      })
      .catch(error => {
        console.log(error)
        event.sender.send('connect-response', error)
      })
  }
}
