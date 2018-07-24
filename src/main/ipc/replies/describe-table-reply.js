import connection from '../../database/connection'

export default {
  handle (event, table) {
    return connection.describeTable(table)
      .then(response => {
        const data = { ...response, table }

        event.sender.send('describe-table-response', data)
      })
      .catch(error => {
        console.log(error)
        event.sender.send('describe-table-response', error)
      })
  },

  handleSync (event, table) {
    connection.describeTable(table)
      .then(response => {
        const data = { ...response, table }

        return event.returnValue = data
      })
      .catch(error => {
        console.log(error)
        return event.returnValue = error
      })
  }
}
