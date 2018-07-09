export default {
  handle (event) {
    event.sender.send('disconnect-response', { success: true })
  }
}
