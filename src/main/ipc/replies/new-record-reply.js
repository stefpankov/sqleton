import connection from '../../database/connection'

export default {
  handle (event, { table, data }) {
    return connection.insert(table, data)
      .then(original_response => {
        const response = { ...original_response, table }
        event.sender.send('new-record-response', response)
      })
      .catch(error => {
        console.log(error)
        event.sender.send('new-record-response', error)
      })
  }
}
