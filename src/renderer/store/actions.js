import swal from 'sweetalert'
import requestUtils from '../ipc/request-utils'
import channels from '../ipc/channels'

/**
 * Create a sweetalert error modal with a message from an error object.
 *
 * @param {Object} error
 */
const errorModal = function (error) {
  swal({
    title: 'Error',
    text: error.message,
    button: { text: 'Close', className: 'btn btn-primary' }
  })
}

/**
 * Check whether a table already has results for a specific type of query.
 *
 * @param {Array} query_results
 * @param {String} query_type
 * @param {String} table_name
 *
 * @returns {Boolean}
 */
const queryResultExists = function (query_results, query_type, table_name) {
  return query_results
    .findIndex(query_result => {
      return query_result.type === query_type && query_result.table === table_name
    }) > -1
}

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
        commit('SET_INITIALIZED', true)
      })
  },

  handleError({ commit }, error) {
    commit('SET_LOADING', false)

    errorModal(error)
  },

  changeSelectedTable ({ commit }, table_name) {
    commit('SET_SELECTED_TABLE', table_name)
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

  handleTableData({ state, commit }, response) {
    const index = state.query_results.findIndex(result => result.table === response.table)
    const data = Object.assign(response, { type: 'SELECT' })

    if (index > -1) {
      commit('REPLACE_QUERY_RESULTS', {
        index,
        new_results: data
      })
    } else {
      commit('UPDATE_QUERY_RESULTS', data)
    }

    commit('SET_LOADING', false)
  },

  handleDescribeTable({ commit }, response) {
    commit('UPDATE_QUERY_RESULTS', Object.assign(response, { type: 'DESCRIBE' }))

    commit('SET_LOADING', false)
  },

  requestTableData({ state, commit, dispatch }, { table, limit = 10, offset = 0 }) {
    if (table) {
      commit('SET_SELECTED_TABLE', table)
    } else {
      table = state.selected_table
    }

    dispatch('request', {
      channel: 'table-data-request',
      payload: { table, limit, offset }
    })
  },

  /**
   * Request a DESCRIBE table query.
   *
   * @param {String} table_name
   */
  requestDescribeTable({ state, commit, dispatch }, table_name) {
    commit('SET_SELECTED_TABLE', table_name)

    if (!queryResultExists(state.query_results, 'DESCRIBE', table_name)) {
      dispatch('request', { channel: 'describe-table-request', payload: table_name })
    }
  },

  /**
   * Remove a query result by given index.
   *
   * @param {Number} index
   */
  removeQueryResult({ commit }, index) {
    commit('REMOVE_QUERY_RESULTS', index)
  },

  /**
   * Send a new table data request for each query result to refresh them.
   */
  refreshQueryResults ({ state, dispatch }) {
    state.query_results.forEach(query => {
      dispatch('requestTableData', {
        table: query.table,
        limit: query.limit,
        offset: query.offset
      })
    })
  }
}
