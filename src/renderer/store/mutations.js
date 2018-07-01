export default {
  INITIALIZED (state, value) {
    state.initialized = value
  },

  RESET_STATE (state) {
    state.saved_connections = []
    state.databases = []
    state.tables = []
    state.selected_table = ''
    state.query_results = []
  },

  SET_LOADING (state, value) {
    state.loading = value
  },

  SET_IS_CONNECTED (state, value) {
    state.is_connected = value
  },

  SET_SAVED_CONNECTIONS (state, saved_connections) {
    state.saved_connections = saved_connections
  },

  SET_DATABASES(state, databases) {
    state.databases = databases
  },

  SET_SELECTED_TABLE (state, value) {
    state.selected_table = value
  },

  SET_QUERY_RESULTS (state, results) {
    state.query_results = results
  },

  UPDATE_QUERY_RESULTS (state, results) {
    state.query_results.push(results)
  },

  REMOVE_QUERY_RESULTS (state, index) {
    state.query_results.splice(index, 1)
  },

  REPLACE_QUERY_RESULTS (state, { index, new_results }) {
    state.query_results.splice(index, 1, new_results)
  },

  SET_TABLES (state, tables) {
    state.tables = tables
  }
}
