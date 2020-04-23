let baseUrl
let authBaseUrl
if (isProduction) {
  baseUrl = '/api/v1/wxm'
  authBaseUrl = '/api/v1/auth'
} else {
  baseUrl = 'http://localhost:3066/api/v1/wxm'
  authBaseUrl = 'http://localhost:3032/api/v1/auth'
}

const endpoints = {
  login: authBaseUrl + '/login',
  logout: authBaseUrl + '/logout',
  user: authBaseUrl + '/user',
  vertical: 'https://mm.cxdemo.net/api/v1/vertical',
  provision: baseUrl + '/provision',
  webex: baseUrl + '/webex'
}


const state = {
  endpoints
}

const getters = {
  endpoints: state => state.endpoints
}

export default {
  state,
  getters
}
