const getters = {
  endpoints: (state, getters) => {
    let urlBase
    let authUrlBase

    if (getters.isProduction) {
      urlBase = '/api/v1/wxm'
      authUrlBase = '/api/v1/auth'
    } else {
      // auth API
      authUrlBase = 'http://localhost:3032/api/v1/auth'
      // direct to wxm-toolbox-api
      urlBase = 'http://localhost:3066/api/v1/wxm'
    }

    return {
      webex: authUrlBase + '/resource/joinWxmSupportRoom',
      version: urlBase + '/version',
      provision: urlBase + '/provision',
      logout: authUrlBase + '/logout'
    }
  },
  defaultRestOptions: (state, getters) => {
    return {
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
  }
}

export default {
  getters
}