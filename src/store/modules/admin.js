import * as types from '../mutation-types'
import { post } from '../../utils'

const state = {
  users: [],
  userProvisionMap: []
}

const getters = {
  users: state => state.users,
  userProvisionMap: state => state.userProvisionMap
}

const mutations = {
  [types.SET_USERS] (state, data) {
    state.users = data
  },
  [types.SET_USER_PROVISION_MAP] (state, data) {
    state.userProvisionMap = data
  }
}

const actions = {
  async loadUsers ({getters, commit, dispatch}, showNotification = true) {
    dispatch('setLoading', {group: 'admin', type: 'users', value: true})
    try {
      await dispatch('loadToState', {
        name: 'users',
        endpoint: getters.endpoints.admin.users,
        mutation: types.SET_USERS,
        showNotification
      })
    } catch (e) {
      console.log('error loading users', e)
      dispatch('errorNotification', {title: 'Failed to load users', error: e})
    } finally {
      dispatch('setLoading', {group: 'admin', type: 'users', value: false})
    }
  },
  async loadUserProvisionMap ({getters, commit, dispatch}, showNotification = true) {
    dispatch('setLoading', {group: 'admin', type: 'userProvisionMap', value: true})
    try {
      await dispatch('loadToState', {
        name: 'user provision map',
        endpoint: getters.endpoints.admin.userProvisionMap,
        mutation: types.SET_USER_PROVISION_MAP,
        showNotification
      })
    } catch (e) {
      console.log('error loading user provision map', e)
      dispatch('errorNotification', {title: 'Failed to load user provision map', error: e})
    } finally {
      dispatch('setLoading', {group: 'admin', type: 'userProvisionMap', value: false})
    }
  },
  async su ({getters, commit, dispatch}, {showNotification = true, user}) {
    const type = 'su'
    try {
      dispatch('setWorking', {group: 'admin', type: 'su', value: true})
      const endpoint = getters.endpoints.admin.su
      const response = await post(getters.instance, getters.jwt, endpoint, null, {username: user.username})
      // store auth token in localStorage
      dispatch('setJwt', response.data.jwt)

      // reload new user data using JWT
      dispatch('loadUser')
      if (showNotification) {
        dispatch('successNotification', `Successfully logged in as ${user.username}`)
      }
    } catch (e) {
      console.log(`error posting ${type}`, e)
      dispatch('errorNotification', {title: `Failed to log in as ${user.username}`, error: e})
    } finally {
      dispatch('setWorking', {group: 'admin', type: 'su', value: false})
    }
  },
  async updateUser ({getters, commit, dispatch}, {showNotification = true, user, body}) {
    const type = 'updateUser'
    try {
      dispatch('setWorking', {group: 'admin', type, value: true})
      const endpoint = getters.endpoints.admin.user + '/' + user.id
      // updating only the cwcc demo portion of user data from here
      await post(getters.instance, getters.jwt, endpoint, {demo: 'cwcc'}, body)
      // reload new user data using JWT
      if (showNotification) {
        dispatch('successNotification', `Successfully updated user ${user.username}`)
      }
    } catch (e) {
      console.log(`error posting ${type}`, e)
      dispatch('errorNotification', {title: `Failed to update user ${user.username}`, error: e})
    } finally {
      dispatch('setWorking', {group: 'admin', type, value: false})
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
