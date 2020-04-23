import Vue from 'vue'
import Vuex from 'vuex'
// import pkg from 'package'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import modules from './modules'

Vue.use(Vuex)

const isProduction = process.env.NODE_ENV === 'production'

let baseUrl
let authBaseUrl
if (isProduction) {
  baseUrl = '/api/v1/cwcc'
  authBaseUrl = '/api/v1/auth'
} else {
  baseUrl = 'http://localhost:3051/api/v1/cwcc'
  authBaseUrl = 'http://localhost:3032/api/v1/auth'
}

const endpoints = {
  login: authBaseUrl + '/login',
  logout: authBaseUrl + '/logout',
  admin: {
    users: authBaseUrl + '/admin/users',
    user: authBaseUrl + '/admin/user',
    userProvisionMap: authBaseUrl + '/provision',
    su: authBaseUrl + '/su'
  },
  endpoints: baseUrl + '/endpoints',
  user: baseUrl + '/user',
  vertical: baseUrl + '/vertical',
  provision: baseUrl + '/provision',
  session: baseUrl + '/session',
  cumulus: baseUrl + '/cumulus',
  webex: baseUrl + '/webex',
  userDemo: authBaseUrl + '/user/demo',
  virtualTeam: baseUrl + '/crud/virtual-team',
}

const store = new Vuex.Store({
  strict: !isProduction,
  actions,
  getters,
  modules,
  state: {
    demoConfigId: 'cwcc',
    isProduction,
    endpointsLoaded: true,
    endpoints,
    // pkg,
    working: {
      admin: {},
      app: {},
      user: {},
      session: {},
      cwcc: {}
    },
    loading: {
      admin: {},
      app: {},
      user: {},
      session: {},
      cwcc: {}
    }
  },
  mutations
})

export default store
