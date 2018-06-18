import connection from '../../Database/Connection'

export default {
  handle (event, { table, limit, offset }) {
    return connection.getTableData(table, limit, offset)
      .then(response => {
        const data = { ...response, table, limit, offset }

        event.sender.send('table-data-response', data)
      })
      .catch(error => {
        console.log(error)
        event.sender.send('table-data-response', error)
      })
  }
}
