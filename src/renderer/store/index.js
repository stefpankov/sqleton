import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import mutations from './mutations'
import actions from './actions'

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  state: {
    saved_connections: [],
    is_connected: false,
    databases: [],
    tables: [],
    selected_table: '',
    query_results: [],
    loading: false
  },
  mutations,
  actions
})
