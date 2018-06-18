import connection from '../../Database/Connection'

export default {
  handle (event) {
    return connection.databases()
      .then(response => {
        event.sender.send('databases-response', response)
      })
      .catch(error => {
        console.log(error)
        event.sender.send('databases-response', error)
      })
  }
}
