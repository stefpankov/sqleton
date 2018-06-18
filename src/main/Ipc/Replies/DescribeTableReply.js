import connection from '../../Database/Connection'

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
  }
}
