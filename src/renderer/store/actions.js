import Vue from 'vue'
import errorModal from '../utils/error-modal'
import queryResultExists from '../utils/query-result-exists'
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
   * Send a new table data request for the specified table,
   * or if no table was specified, send a request for each query result to refresh them.
   */
  refreshQueryResults ({ state, dispatch }, table = null) {
    if (table !== null) {
      const index = state.query_results.findIndex(qr => qr.table === table)

      if (index > -1) {
        const query = state.query_results[index]
        dispatch('requestTableData', {
          table: query.table,
          limit: query.limit,
          offset: query.offset
        })
      }
    } else {
      state.query_results.forEach(query => {
        dispatch('requestTableData', {
          table: query.table,
          limit: query.limit,
          offset: query.offset
        })
      })
    }
  },

  showNewRecordForm ({ commit }) {
    commit('SHOW_NEW_RECORD_FORM')
  },

  hideNewRecordForm ({ commit }) {
    commit('HIDE_NEW_RECORD_FORM')
  },

  /**
   * Dispatch a new record request.
   * Data should be an object whose key:value pairs correspond to column_name: column_value.
   *
   * @param {String} table Table name
   * @param {Object} data
   */
  newRecord ({ dispatch }, { table, data }) {
    dispatch('request', {
      channel: 'new-record-request',
      payload: {
        table,
        data
      }
    })
  },

  /**
   * Request a refresh of query results after a new record has been inserted.
   *
   * @param {any} dispatch
   * @param {any} commit
   * @param {Object} response
   */
  handleNewRecord ({ dispatch, commit }, response) {
    dispatch('refreshQueryResults', response.table)

    commit('HIDE_NEW_RECORD_FORM')
  },

  /**
   * Dispath a delete record request.
   *
   * @param {any} dispatch
   * @param {String} table_name
   * @param {Object} record
   */
  deleteRecord ({ dispatch }, { table_name, record }) {
    let recordClone = Vue.util.extend({}, record)
    dispatch('request', {
      channel: 'delete-record-request',
      payload: { table: table_name, record: recordClone }
    })
  },

  /**
   * Reqest a refresh of query results after a deleted record.
   * @param {any} dispatch
   * @param {Object} response
   */
  handleDeleteRecord ({ dispatch }, response) {
    dispatch('refreshQueryResults', response.table)
  },

  /**
   * Delete multiple records.
   *
   * @param {any} dispatch
   * @param {String} table_name
   * @param {Array} records
   */
  deleteRecords ({ dispatch }, { table_name, records }) {
    records.forEach(record => {
      dispatch('deleteRecord', { table_name, record })
    })
  }
}
