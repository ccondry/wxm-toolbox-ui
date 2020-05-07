let baseUrl
let authBaseUrl

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  baseUrl = window.location.origin + '/api/v1/wxm'
  authBaseUrl = window.location.origin + '/api/v1/auth'
} else {
  baseUrl = 'http://localhost:3066/api/v1/wxm'
  authBaseUrl = 'http://localhost:3032/api/v1/auth'
}

const endpoints = {
  login: authBaseUrl + '/login',
  logout: authBaseUrl + '/logout',
  user: authBaseUrl + '/user',
  vertical: 'https://mm.cxdemo.net/api/v1/verticals?all=true',
  cumulus: authBaseUrl + '/cumulus?demo=wxm',
  // do provision
  doProvision: baseUrl + '/provision',
  // get provision status
  provision: authBaseUrl + '/provision',
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
