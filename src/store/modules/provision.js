import * as types from '../mutation-types'
import Vue from 'vue'

const state = {
  status: {}
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
  [types.SET_PROVISION_STATUS] (state, {vertical, data}) {
    Vue.set(state.status, vertical, data)
  }
}

const actions = {
  async getProvision ({getters, dispatch}, vertical) {
    dispatch('fetch', {
      message: 'get provision status',
      group: 'provision',
      type: vertical,
      url: getters.endpoints.provision,
      mutation: types.SET_PROVISION_STATUS,
      transform: data => {
        return {
          vertical,
          data
        }
      },
      options: {
        query: {
          vertical
        }
      }
    })
  },
  async provisionUser ({getters, dispatch}, vertical) {
    const email = getters.jwtUser.email
    await dispatch('fetch', {
      message: 'provision user',
      group: 'provision',
      type: vertical,
      url: getters.endpoints.provision,
      options: {
        method: 'POST',
        body: {
          email,
          vertical
        }
      }
    })
    // check provision status again now to get updated data from server
    dispatch('getProvision', vertical)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
