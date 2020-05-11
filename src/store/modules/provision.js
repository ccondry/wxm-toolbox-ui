import * as types from '../mutation-types'
import { loadToState } from '../actions'

const state = {
  status: null
}

const getters = {
  provisionStatus: state => state.status,
  isProvisioned: state => {
    try {
      return Object.keys(state.status).length > 0
    } catch (e) {
      return false      
    }
  }
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
  async provisionUser ({getters, dispatch}, {showNotification = true, email}) {
    dispatch('setWorking', {group: 'user', type: 'provision', value: true})
    console.log('starting provision...')
    try {
      // go REST
      const response = await fetch(getters.endpoints.doProvision, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + getters.jwt
        },
        body: JSON.stringify({
          email
        })
      })
      // REST ok?
      if (response.ok) {
        console.log('successfully provisioned user account.')
        // show success message to user
        if (showNotification) {
          dispatch('successNotification', 'Successfully provisioned your account.')
        }
      } else if (response.status === 401) {
        // JWT expired
        console.log('JWT expired. logging out user locally.')
        dispatch('unsetJwt')
      } else {
        // not a 401 error
        console.log('Failed to provisioned user account:', `${response.status} ${response.statusText} - ${text}`)
        const text = await response.text()
        // throw Error(`${response.status} ${response.statusText} - ${text}`)
        dispatch('errorNotification', {
          title: 'Failed provision',
          message: `${response.status} ${response.statusText} - ${text}`
        })
      }
    } catch (e) {
      console.log('error during provision script', e)
      dispatch('errorNotification', {title: 'Error during provision', error: e})
    } finally {
      // check provision status again now to get updated data from server
      dispatch('getProvisionStatus', false)
      // reset working state
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
