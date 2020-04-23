import * as types from '../mutation-types'
import axios from 'axios'
import { post, load } from '../../utils'

function parseJwt (token) {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(window.atob(base64))
}

// function getSeconds () {
//   const secs = Date.now() / 1000
//   return Math.floor(secs)
// }

const state = {
  jwt: null,
  forwardTo: null
}

const getters = {
  jwt: state => state.jwt,
  authenticated: state => state.jwt !== null,
  forwardTo: state => state.forwardTo
}

const mutations = {
  [types.SET_JWT] (state, data) {
    state.jwt = data
  },
  [types.FORWARD_TO] (state, data) {
    state.forwardTo = data
  }
}

const actions = {
  setForwardTo ({commit}, data) {
    commit(types.FORWARD_TO, data)
  },
  setJwt ({commit}, data) {
    console.log('setting JWT in localStorage and state')
    // trim whitespace
    data = data.trim()
    // remove Bearer word
    if (data.indexOf('Bearer ') === 0) {
      data = data.substring('Bearer '.length)
    }
    // save JWT in state
    commit(types.SET_JWT, data)
    // save JWT in browser's localStorage
    window.localStorage.setItem('jwt', data)
    // decode jwt and store as user data
    try {
      commit(types.SET_USER, parseJwt(data))
    } catch (e) {
      // invalid JWT?
      console.error('invalid JWT', data)
      // unset JWT in state
      commit(types.SET_JWT, null)
      // remove JWT from localStorage
      window.localStorage.removeItem('jwt')
      // unset user in state
      commit(types.SET_USER, {})
    }
  },
  unsetJwt ({commit}) {
    // unset JWT in state
    commit(types.SET_JWT, null)
    // remove JWT from localStorage
    window.localStorage.removeItem('jwt')
    // unset user in state
    commit(types.SET_USER, {})
  },
  async logout ({dispatch, commit, getters}) {
    console.log('logging out user')
    try {
      // tell server we're logging out
      const response = await post(getters.instance, getters.jwt, getters.endpoints.logout)
      // did they successfully log out of superuser mode?
      if (response.status >= 200 && response.status < 300) {
        if (response.data.jwt) {
          // store new auth token in localStorage
          dispatch('setJwt', response.data.jwt)
          // load user data using JWT
          // dispatch('loadUser')
          dispatch('successNotification', `Successfully logged out of ${getters.user.username}`)
        } else {
          // remove JWT
          commit(types.SET_JWT, null)
          // remove JWT from localStorage
          window.localStorage.removeItem('jwt')
          // remove user from state
          commit(types.SET_USER, {})
        }
      } else {
        dispatch('errorNotification', `Failed to log out of ${getters.user.username}`)
      }
    } catch (e) {
      console.log(e.message)
    }
  },
  async login ({getters, dispatch}, data) {
    dispatch('setWorking', {group: 'app', type: 'login', value: true})
    // store a local copy of user/pass
    let username = data.username
    let password = data.password
    // try login request
    try {
      const response = await axios.post(getters.endpoints.login, {
        username,
        password
      })
      // console.log(response)
      // if successful
      if (response.status >= 200 && response.status < 300) {
        // store auth token in localStorage
        dispatch('setJwt', response.data.jwt)

        dispatch('successNotification', {
          title: `Logged in Successfully`,
          message: ''
        })

        // load user data using JWT
        // dispatch('loadUser')
        // load the session details - dCloud only
        // dispatch('getSession')
      } else {
        dispatch('errorNotification', {
          title: `Login Failed`,
          message: `${response.status} ${response.statusText}`
        })
      }
    } catch (error) {
      console.log(error)
      dispatch('errorNotification', {
        title: `Login Failed`,
        message: `${error.response.status} ${error.response.statusText}`
      })
      throw error
    } finally {
      dispatch('setWorking', {group: 'app', type: 'login', value: false})
    }
  },
  async checkLogin ({getters, dispatch, commit, rootState}) {
    console.log('checking localstorage for JWT login token')
    // retrieve auth token from localStorage
    const jwt = window.localStorage.getItem('jwt')
    // if we found a token, check the web service to see if it's still valid
    if (jwt !== null) {
      console.log('JWT login token found in localStorage. checking it...')
      // load user. this should validate JWT on server.
      try {
        const response = await load(getters.instance, jwt, getters.endpoints.user)
        //
        console.log('checkLogin get user response =', response)
        dispatch('setJwt', jwt)
      } catch (e) {
        console.log('JWT check failed:', e.response.status, e.response.data)
        if (e.response.status === 401) {
          // JWT invalid - delete it from localStorage
          dispatch('unsetJwt')
        }
      }
    } else {
      console.log('JWT not found in localstorage.')
      // forward user to login page if production
      if (process.env.NODE_ENV === 'production') {
        window.location = '/auth/login?destination=' + window.location
      } else {
        // TODO pop JWT login form for development
      }
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
