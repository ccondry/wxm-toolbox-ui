import * as types from '../mutation-types'
import { loadToState } from '../actions'

const state = {
  status: null
}

const getters = {
  provisionStatus: state => state.status,
  isProvisioned: state => state.status !== null && Object.keys(state.status).length > 0
}

const mutations = {
  [types.SET_PROVISION_STATUS] (state, data) {
    state.status = data[0]
  }
}

const actions = {
  async getProvisionStatus ({getters, dispatch}, showNotification = true) {
    dispatch('setLoading', {group: 'user', type: 'provision', value: true})
    console.log('loading provision status...')
    try {
      const endpoint = getters.endpoints.provision
      console.log('loading provision status from endpoint', endpoint, '...')
      const response = await dispatch('loadToState', {
        name: 'get provision status',
        endpoint,
        mutation: types.SET_PROVISION_STATUS,
        query: {
          demo: 'wxm',
          version: 'v1'
        }
      })
      console.log('load provision status - response:', response)
      if (showNotification) {
        dispatch('successNotification', 'Successfully loaded provision status')
      }
    } catch (e) {
      console.log('error loading provision status', e)
      dispatch('errorNotification', {title: 'Failed to load provision status', error: e})
    } finally {
      dispatch('setLoading', {group: 'user', type: 'provision', value: false})
    }
  },
  async provisionUser ({getters, dispatch}, showNotification = true) {
    dispatch('setWorking', {group: 'user', type: 'provision', value: true})
    console.log('starting provision...')
    try {
      const endpoint = getters.endpoints.doProvision
      try {
        // send provision request to API
        await dispatch('postData', {
          endpoint
        })
        if (showNotification) {
          dispatch('successNotification', 'Successfully provisioned your account.')
        }
        dispatch('getProvisionStatus', false)
      } catch (e) {
        console.log('error during provision script', e)
        dispatch('errorNotification', {title: 'provision failed', error: e})
      }
    } catch (e) {
      console.log('error during provision script', e)
      dispatch('errorNotification', {title: 'provision script failed', error: e})
    } finally {
      dispatch('setWorking', {group: 'user', type: 'provision', value: false})
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
