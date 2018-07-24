import connection from '../../database/connection'

export default {
  handle (event, { table, data }) {
    return connection.delete(table, data)
      .then(response => {
        event.sender.send('delete-record-response', response)
      })
      .catch(error => {
        console.log(error)
        event.sender.send('delete-record-response', error)
      })
  }
}
