//import connection from '../../Database/Connection'

export default {
  handle (event) {
    event.sender.send('disconnect-response', { success: true })
    // return connection.disconnect()
    //   .then(response => {
    //     event.sender.send('disconnect-response', response)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //     event.sender.send('disconnect-response', error)
    //   })
  }
}
