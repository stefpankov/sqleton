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
  subscribe (channel, callback, errorCallback) {
    ipcRenderer.on(channel, (event, response) => {
      this.handleResponse(response, callback, errorCallback)
    })
  },

  /**
   * Handle a response.
   *
   * @param {Object} response
   * @param {Function} callback
   * @param {Function} errorCallback
   */
  handleResponse (response, callback, errorCallback) {
    if (response.success) {
      callback(response)
    } else {
      errorCallback(response)
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
    channels.forEach(channel => {
      this.subscribe(channel.name, channel.callback, channel.errorCallback)
    })
  }
}
