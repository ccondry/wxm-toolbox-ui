import * as types from '../mutation-types'
import {ToastProgrammatic as Toast} from 'buefy'
import pkg from '../../../package.json'

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
  datacenter: '',
  apiVersion: 'loading...',
  authApiVersion: 'loading...'
}

// return domain name part from client
const getters = {
  domain: () => {
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
  isCxdemo: (state, getters) => getters.domain === 'cxdemo',
  uiVersion: () => pkg.version,
  apiVersion: (state, getters) => state.apiVersion,
  authApiVersion: (state, getters) => state.authApiVersion
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
  },

  [types.SET_SERVER_INFO] (state, data) {
    state.apiVersion = data.version
  },

  [types.SET_AUTH_API_INFO] (state, data) {
    state.authApiVersion = data.version
  }
}

const actions = {
  async loadServerInfo ({getters, dispatch}) {
    dispatch('setLoading', {group: 'app', type: 'serverInfo', value: true})
    console.log('loading API server info...')
    try {
      const endpoint = getters.endpoints.info
      console.log('loading API server info endpoint', endpoint, '...')
      const response = await dispatch('loadToState', {
        name: 'get API server info',
        endpoint,
        mutation: types.SET_SERVER_INFO
      })
      console.log('load API server info - response:', response)
    } catch (e) {
      console.log('error loading API server info', e)
      dispatch('errorNotification', {title: 'Failed to load API server info', error: e})
    } finally {
      dispatch('setLoading', {group: 'app', type: 'serverInfo', value: false})
    }
  },
  async getAuthApiInfo ({getters, dispatch}) {
    dispatch('setLoading', {group: 'app', type: 'authApiInfo', value: true})
    const operation = 'auth API info'
    console.log('getting', operation, '...')
    try {
      const endpoint = getters.endpoints.authApiInfo
      console.log('getting', operation, 'endpoint', endpoint, '...')
      const response = await dispatch('loadToState', {
        name: 'get' + operation,
        endpoint,
        mutation: types.SET_AUTH_API_INFO
      })
      console.log('get', operation, '- response:', response)
    } catch (e) {
      console.log('error getting', operation, e)
      dispatch('errorNotification', {title: 'Failed to get ' + operation, error: e})
    } finally {
      dispatch('setLoading', {group: 'app', type: 'authApiInfo', value: false})
    }
  },
  copyToClipboard (options, {string, type = 'Text'}) {
    console.log('copyToClipboard', type, string)
    // copy text to clipboard
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.value = string
    // input.focus()
    input.select()
    // console.log('input field', input)
    // const range = document.createRange()
    // range.selectNode(input)
    // window.getSelection().addRange(range)
    // console.log('range', range)
    const result = document.execCommand('copy')
    if (result === 'unsuccessful') {
      // failed
      console.error('Failed to copy text.')
    } else {
      // success
      // this.$snackbar.open({
      //   message: 'Text Copied',
      //   type: 'is-success',
      //   position: 'is-top'
      // })
      Toast.open({
        // duration: 5000,
        // message: `load brands failed`,
        // position: 'is-bottom',
        // type: 'is-danger'
        message: type + ' Copied to Your Clipboard',
        queue: false
      })
    }

    // Remove the selections - NOTE: Should use
    // removeRange(range) when it is supported
    window.getSelection().removeAllRanges()
    // remove the input field
    input.remove()
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
