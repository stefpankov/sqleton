import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import mutations from './mutations'
import actions from './actions'

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  state: {
    initialized: false,
    saved_connections: [],
    is_connected: false,
    databases: [],
    tables: [],
    selected_table: '',
    query_results: [],
    loading: false,
    show_new_record_form: false
  },
  mutations,
  actions
})
