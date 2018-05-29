import { ipcRenderer } from 'electron'

export default {
  /**
   * Send a request to an ipcMain listener.
   *
   * @param {String} channel ipcMain channel
   * @param {any} payload Any data that the channel expects
   */
  request (channel, payload) {
    ipcRenderer.send(channel, payload)
  },

  /**
   * Subscribe to a channel and handle incoming responses.
   *
   * @param {String} channel
   * @param {Function} callback
   */
  subscribe (event_name, callback) {
    ipcRenderer.on(event_name, (event, response) => {
      this.handleResponse(response, callback)
    })
  },

  /**
   * Handle a response.
   *
   * @param {Object} response
   * @param {Function} callback
   * @todo Refactor to use Promises
   */
  handleResponse (response, callback) {
    if (response.success) {
      callback(response)
    } else {
      // Handle this better
      console.log(response.message)
    }
  },

  /**
   * Subscribe to channels defined as:
   *  {
   *    'channel-name': callbackFunction
   *  }
   *
   * @param {Object} channels
   */
  subscribeToChannels(channels) {
    Object.keys(channels)
      .forEach(channel => {
        this.subscribe(channel, channels[channel])
      })
  }
}
