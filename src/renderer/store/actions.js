import requestUtils from '../ipc/request-utils'
import channels from '../ipc/channels'

export default {
  ...requestUtils,

  /**
   * Initialize the application.
   */
  init ({ dispatch, commit }) {
    dispatch('subscribeToChannels', channels)

    dispatch('requestSync', { channel: 'get-connections-request' })
      .then(response => {
        commit('SET_SAVED_CONNECTIONS', response)
      })
  },

  /**
   * Commit saved connections to state.
   *
   * @param {Array} saved_connections
   */
  handleGetConnections ({ commit }, { saved_connections }) {
    commit('SET_SAVED_CONNECTIONS', saved_connections)
  },

  /**
   * Handle a delete connection response.
   *
   * @param {Array} saved_connections
   */
  handleDeleteConnection ({ commit }, { saved_connections }) {
    commit('SET_SAVED_CONNECTIONS', saved_connections)
    commit('SET_LOADING', false)
  },

  /**
   * Grab saved connections and databases for the server connection.
   */
  handleConnection ({ commit, dispatch }) {
    commit('SET_IS_CONNECTED', true)
    commit('SET_LOADING', true)

    dispatch('request', { channel: 'databases-request' })
  },

  /**
   * Handle a disconnect response.
   */
  handleDisconnect ({ commit }) {
    commit('SET_IS_CONNECTED', false)
    commit('RESET_STATE')
    commit('SET_LOADING', false)
  },

  /**
   * Prepare the databases data from the results and fields and commit them to the state.
   *
   * @param {Array} results
   * @param {Array} fields
   */
  handleDatabases({ commit }, { results, fields }) {
    commit('RESET_STATE')

    commit('SET_DATABASES', results.map(res => res[fields[0].name]))

    commit('SET_LOADING', false)
  },

  handleTables({ commit }, { results, fields }) {
    commit('SET_SELECTED_TABLE', '')
    commit('SET_QUERY_RESULTS', [])

    const tables = results.map(res => res[fields[0].name])
    commit('SET_TABLES', tables)

    commit('SET_LOADING', false)
  },

  handleDescribeTable(response) {
    this.query_results.push(Object.assign(response, { type: 'DESCRIBE' }))

    this.loading = false
  },
}
