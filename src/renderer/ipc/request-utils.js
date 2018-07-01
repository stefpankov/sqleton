import { ipcRenderer } from 'electron'

export default {
  /**
   * Send a request to an ipcMain listener.
   *
   * @param {String} channel ipcMain channel
   * @param {any} payload Any data that the channel expects
   */
  request ({ commit }, { channel, payload }) {
    if (channel === undefined) {
      throw '[request] The channel param is required.'
    }

    ipcRenderer.send(channel, payload)

    commit('SET_LOADING', true)
  },

  /**
   * Send a synchronous request to an ipcMain sync listener.
   *
   * @param {String} channel ipcMain channel
   * @param {any} payload Any data that the channel expects
   */
  requestSync (context, { channel, payload }) {
    return ipcRenderer.sendSync(`${channel}-sync`, payload)
  },

  /**
   * Subscribe to a channel and handle incoming responses.
   *
   * @param {String} channel
   * @param {Function} callback
   */
  subscribe ({ dispatch }, { channel, callback, errorCallback }) {
    ipcRenderer.on(channel, (event, response) => {
      dispatch('handleResponse', { response, callback, errorCallback })
    })
  },

  /**
   * Handle a response.
   *
   * @param {Object} response
   * @param {Function} callback
   * @param {Function} errorCallback
   */
  handleResponse ({ dispatch }, { response, callback, errorCallback }) {
    if (response.success) {
      dispatch(callback, response)
    } else {
      dispatch(errorCallback, response)
    }
  },

  /**
   * Subscribe to channels.
   * Each channel is an object that looks like this:
   *  {
        name: 'channel-name',
        callback: responseHandler,
        errorCallback: errorHandler
   *  }
   *
   * @param {Object} channels
   */
  subscribeToChannels({ dispatch }, channels) {
    channels.forEach(channel => {
      dispatch('subscribe', {
        channel: channel.name,
        callback: channel.callback,
        errorCallback: channel.errorCallback
      })
    })
  }
}
