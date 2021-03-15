import * as types from '../mutation-types'
import {ToastProgrammatic as Toast} from 'buefy/src'

const state = {
  status: {}
}

const getters = {
  provisionStatus: state => state.status
}

const mutations = {
  [types.SET_PROVISION_STATUS] (state, data) {
    console.log('SET_PROVISION_STATUS', data[0])
    state.status = data[0].demo['wxm-v2']
  }
}

const actions = {
  async getProvision ({getters, dispatch}) {
    const response = await dispatch('fetch', {
      message: 'get provision status',
      group: 'provision',
      type: 'list',
      url: getters.endpoints.getProvision,
      mutation: types.SET_PROVISION_STATUS,
      options: {
        query: {
          demo: 'wxm',
          version: 'v2'
        }
      }
    })
    if (response instanceof Error) {
      // error
    } else {
      // success
      // check if provision status is "started" for any agent or supervisor
      let keys
      try {
        keys = Object.keys(response[0].demo['wxm-v2'])
      } catch (e) {
        // no demo information on user, so provision must not be started
        return
      }
      let refresh = false
      for (const key of keys) {
        const provision = response[0].demo['wxm-v2'][key]
        try {
          if (
            provision.agent === 'started' ||
            provision.supervisor === 'started'
          ) {
            refresh = true
          }
        } catch (e) {
          continue
        }
      }
      // and check provision status for them again in a moment
      if (refresh) {
        window.setTimeout(() => {
          dispatch('getProvision')
        }, 10 * 1000)
      }
    }
  },
  async provisionUser ({getters, dispatch}, vertical) {
    const email = getters.jwtUser.email
    const response = await dispatch('fetch', {
      message: 'provision user',
      group: 'provision',
      type: vertical,
      url: getters.endpoints.doProvision,
      message: 'Provision ' + vertical,
      options: {
        method: 'POST',
        body: {
          email,
          vertical
        }
      }
    })
    if (response instanceof Error) {
      Toast.open({
        message: `Failed to provision you for ${vertical}: ${response.message}`,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } else {
      // check provision status again now to get updated data from server
      dispatch('getProvision', vertical)
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
