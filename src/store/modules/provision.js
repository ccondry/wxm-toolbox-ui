import * as types from '../mutation-types'
import { post, load } from '../../utils'
// import { DialogProgrammatic as Dialog } from 'buefy'

const state = {
  status: null
}

const getters = {
  provisionStatus: state => state.status,
  isProvisioned: state => state.status !== null && Object.keys(state.status).length > 0
}

const mutations = {
  [types.SET_PROVISION_STATUS] (state, data) {
    state.status = data
  }
}

const actions = {
  async getProvisionStatus ({getters, commit, dispatch}, showNotification = true) {
    dispatch('setLoading', {group: 'user', type: 'provision', value: true})
    console.log('loading provision status...')
    try {
      const endpoint = getters.endpoints.provision
      console.log('loading provision status from endpoint', endpoint, '...')
      const response = await load(getters.instance, getters.jwt, endpoint)
      console.log('load provision status - response:', response)
      commit(types.SET_PROVISION_STATUS, response.data)
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
  async provisionUser ({getters, commit, dispatch}, showNotification = true) {
    dispatch('setWorking', {group: 'user', type: 'provision', value: true})
    console.log('starting provision...')
    try {
      const endpoint = getters.endpoints.provision
      try {
        // send provision request to API
        await post(getters.instance, getters.jwt, endpoint)
        if (showNotification) {
          dispatch('successNotification', 'Successfully provisioning your account.')
          // Dialog.alert({
          //   title: 'Provision Successful',
          //   message: `Your Cisco Webex Contact Center account is now
          //   provisioned, however your routing script is not enabled yet. <br>To
          //   enable your agent to receive calls, you can either wait for the automatic
          //   process to do this at midnight EST tonight, or contact support using the
          //   Webex Teams support room.`,
          //   type: 'is-success',
          //   confirmText: 'I Understand'
          // })
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
