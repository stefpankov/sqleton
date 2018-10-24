import connection from '../../database/connection'

export default {
  handle (event, { table, record }) {
    return connection.delete(table, record)
      .then(original_response => {
        const response = { ...original_response, table }
        event.sender.send('delete-record-response', response)
      })
      .catch(error => {
        console.log(error)
        event.sender.send('delete-record-response', error)
      })
  }
}
