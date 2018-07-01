export default {
  /**
   * Set the initialized value.
   *
   * @param state
   * @param {Boolean} value
   */
  SET_INITIALIZED (state, value) {
    state.initialized = value
  },

  /**
   * Reset the state object to defaults for databases, tables and results.
   *
   * @param state
   */
  RESET_STATE (state) {
    state.databases = []
    state.tables = []
    state.selected_table = ''
    state.query_results = []
  },

  /**
   * Set the loading value.
   *
   * @param state
   * @param {Boolean} value
   */
  SET_LOADING (state, value) {
    state.loading = value
  },

  /**
   * Set the is_connected value.
   *
   * @param state
   * @param {Boolean} value
   */
  SET_IS_CONNECTED (state, value) {
    state.is_connected = value
  },

  /**
   * Set the array of saved connections.
   *
   * @param state
   * @param {Array} saved_connections
   */
  SET_SAVED_CONNECTIONS (state, saved_connections) {
    state.saved_connections = saved_connections
  },

  /**
   * Set the databases array.
   *
   * @param state
   * @param {Array} databases
   */
  SET_DATABASES(state, databases) {
    state.databases = databases
  },

  /**
   * Set the selected table name.
   *
   * @param state
   * @param {String} table_name
   */
  SET_SELECTED_TABLE (state, table_name) {
    state.selected_table = table_name
  },

  /**
   * Set the query results array.
   *
   * @param state
   * @param {Array} results
   */
  SET_QUERY_RESULTS (state, results) {
    state.query_results = results
  },

  /**
   * Append new query results to the existing ones.
   *
   * @param state
   * @param {Array} results
   */
  UPDATE_QUERY_RESULTS (state, results) {
    state.query_results.push(results)
  },

  /**
   * Remove a result object by given index.
   *
   * @param state
   * @param {Number} index
   */
  REMOVE_QUERY_RESULTS (state, index) {
    state.query_results.splice(index, 1)
  },

  /**
   * Replace a query result object with the new provided object by given index.
   *
   * @param state
   * @param {Number} index
   * @param {Array} new_results
   */
  REPLACE_QUERY_RESULTS (state, { index, new_results }) {
    state.query_results.splice(index, 1, new_results)
  },

  /**
   * Set the tables array.
   *
   * @param state
   * @param {Array} tables
   */
  SET_TABLES (state, tables) {
    state.tables = tables
  }
}
