import * as types from '../mutation-types'
import {load} from '../../utils'

const state = {
  device: {
    isMobile: false,
    isTablet: false
  },
  sidebar: {
    opened: false,
    hidden: false
  },
  effect: {
    translate3d: true
  },
  sessionId: '',
  datacenter: ''
}

const mutations = {
  [types.TOGGLE_DEVICE] (state, device) {
    state.device.isMobile = device === 'mobile'
    state.device.isTablet = device === 'tablet'
  },

  [types.TOGGLE_SIDEBAR] (state, config) {
    if (state.device.isMobile && config.hasOwnProperty('opened')) {
      state.sidebar.opened = config.opened
    } else {
      state.sidebar.opened = true
    }

    if (config.hasOwnProperty('hidden')) {
      state.sidebar.hidden = config.hidden
    }
  },

  [types.SWITCH_EFFECT] (state, effectItem) {
    for (let name in effectItem) {
      state.effect[name] = effectItem[name]
    }
  }
}

const actions = {
  async getEndpoints ({getters, commit, dispatch}, showNotification = true) {
    // production / development base API URL
    const url = getters.isProduction ? '/api/v1/cwcc/endpoints' : 'http://localhost:3051/api/v1/cwcc/endpoints'
    // mark loading started
    dispatch('setLoading', {group: 'app', type: 'endpoints', value: true})
    try {
      console.log('getting endpoints')
      // get endpoints from API server
      const response = await load(getters.instance, getters.jwt, url)
      // set the endpoints data in state
      await commit(types.SET_ENDPOINTS, response.data)
      // mark endpoints as loaded
      commit(types.SET_ENDPOINTS_LOADED, true)
    } catch (e) {
      console.log(e)
      // failed to get endpoints
      if (e.response.status === 401 || e.response.status === 403) {
        // JWT expired
        console.log('JWT expired. logging out user locally.')
        dispatch('unsetJwt')
      } else {
        // other error
        console.error(`error during GET endpoints`, e)
        dispatch('errorNotification', {title: `Failed to GET endpoints`, error: e})
      }
    } finally {
      // mark loading done
      dispatch('setLoading', {group: 'app', type: 'endpoints', value: false})
    }
  }
}


// return domain name part from client
const getters = {
  domain: state => {
    try {
      // get current hostname of the browser location
      const hostname = window.location.hostname
      // console.log('hostname', hostname)

      // split FQDN into parts
      const parts = hostname.split('.')

      // get the subdomain
      const subdomain = parts.shift()
      console.log('subdomain', subdomain)

      // get the domain name
      const domain = parts.shift()
      console.log('domain', domain)

      return domain
    } catch (e) {
      console.log('failed to parse hostname:', e)
      return false
    }
  },
  // is this a cisco.com address? assume dcloud
  isDcloud: (state, getters) => getters.domain === 'cisco',
  // is this a cxdemo.net address? it is cxdemo
  isCxdemo: (state, getters) => getters.domain === 'cxdemo'
}

export default {
  state,
  actions,
  getters,
  mutations
}
