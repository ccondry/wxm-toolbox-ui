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

const actions = {}

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
