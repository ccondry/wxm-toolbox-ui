import * as types from '../mutation-types'
import { ToastProgrammatic as Toast } from 'buefy'
import { post, load, httpDelete } from '../../utils'

const state = {
  virtualTeams: []
}

const getters = {
  virtualTeams: state => state.virtualTeams
}

const mutations = {
  [types.SET_VIRTUAL_TEAMS] (state, data) {
    state.virtualTeams = data
  },
  [types.DELETE_VIRTUAL_TEAM] (state, data) {
    // find index of exising team
    const index = state.virtualTeams.findIndex(v => v.id === data.id)
    // if found
    if (index >= 0) {
      // remove team from list
      state.virtualTeams.splice(index, 1)
    }
  },
  [types.DISABLE_VIRTUAL_TEAM] (state, data) {
    // find index of exising team
    const index = state.virtualTeams.findIndex(v => v.id === data.id)
    // if found
    if (index >= 0) {
      // get team object
      const team = state.virtualTeams[index]
      // mark it disabled
      team.attributes.status__i = 0
      // replace team in list
      state.virtualTeams.splice(index, 1, team)
    }
  },
  [types.ENABLE_VIRTUAL_TEAM] (state, data) {
    // find index of exising team
    const index = state.virtualTeams.findIndex(v => v.id === data.id)
    // if found
    if (index >= 0) {
      // get team object
      const team = state.virtualTeams[index]
      // mark it disabled
      team.attributes.status__i = 1
      // replace team in list
      state.virtualTeams.splice(index, 1, team)
    }
  }
}

const actions = {
  async getVirtualTeams ({getters, commit, dispatch}, showNotification = true) {
    console.log('getVirtualTeams...')
    dispatch('setLoading', {group: 'cwcc', type: 'virtualTeam', value: true})
    try {
      const endpoint = getters.endpoints.virtualTeam
      const response = await load(getters.instance, getters.jwt, endpoint, {})
      console.log('getVirtualTeams successful', response.data)
      commit(types.SET_VIRTUAL_TEAMS, response.data)
      // notify user
      if (showNotification) {
        Toast.open({
          message: `Successfully retrieved list of virtual teams`,
          type: 'is-success'
        })
      }
    } catch (e) {
      console.error('error loading virtual teams', e.message)
      // notify user
      Toast.open({
        duration: 5000,
        message: `Failed to virtual teams: ${e.message}`,
        // position: 'is-bottom',
        type: 'is-danger'
      })
    } finally {
      dispatch('setLoading', {group: 'cwcc', type: 'virtualTeam', value: false})
    }
  },
  async disableVirtualTeam ({getters, commit, dispatch}, {team, showNotification = true}) {
    if (!team || !team.id) {
      throw new Error('disableVirtualTeam requires team object as input')
    }
    console.log('disableVirtualTeam', team.id, '...')
    dispatch('setWorking', {group: 'cwcc', type: 'virtualTeam', value: true})
    try {
      const endpoint = getters.endpoints.virtualTeam + '/' + team.id + '/disable'
      await post(getters.instance, getters.jwt, endpoint, {})
      console.log('disableVirtualTeam successful')
      // notify user
      Toast.open({
        message: `Successfully disabled virtual team ${team.id}`,
        type: 'is-success'
      })
      // update team in state array
      commit(types.DISABLE_VIRTUAL_TEAM, team)
    } catch (e) {
      console.error('error disabling virtual team', team.id, e.message)
      // notify user
      Toast.open({
        duration: 8000,
        message: `Failed to disable virtual team ${team.id}: ${e.message}`,
        // position: 'is-bottom',
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'cwcc', type: 'virtualTeam', value: false})
    }
  },
  async enableVirtualTeam ({getters, commit, dispatch}, {team, showNotification = true}) {
    if (!team || !team.id) {
      throw new Error('enableVirtualTeam requires team object as input')
    }
    console.log('enableVirtualTeam', team.id, '...')
    dispatch('setWorking', {group: 'cwcc', type: 'virtualTeam', value: true})
    try {
      const endpoint = getters.endpoints.virtualTeam + '/' + team.id + '/enable'
      await post(getters.instance, getters.jwt, endpoint, {})
      console.log('enableVirtualTeam successful')
      // notify user
      Toast.open({
        message: `Successfully enabled virtual team ${team.id}`,
        type: 'is-success'
      })
      console.log('enableVirtualTeam successful')
      // update team in state array
      commit(types.ENABLE_VIRTUAL_TEAM, team)
    } catch (e) {
      console.error('enableVirtualTeam', team.id, 'failed', e.message)
      // notify user
      Toast.open({
        duration: 8000,
        message: `Failed to enable virtual team ${team.id}: ${e.message}`,
        // position: 'is-bottom',
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'cwcc', type: 'virtualTeam', value: false})
    }
  },
  async deleteVirtualTeam ({getters, commit, dispatch}, {team, showNotification = true}) {
    if (!team || !team.id) {
      throw new Error('deleteVirtualTeam requires team object as input')
    }
    console.log('deleteVirtualTeam', team.id, '...')
    dispatch('setWorking', {group: 'cwcc', type: 'virtualTeam', value: true})
    try {
      const endpoint = getters.endpoints.virtualTeam + '/' + team.id
      await httpDelete(getters.instance, getters.jwt, endpoint, {})
      console.log('deleteVirtualTeam successful')
      // update state
      commit(types.DELETE_VIRTUAL_TEAM, team)
      // notify user
      Toast.open({
        message: `Successfully deleted virtual team ${team.id}`,
        type: 'is-success'
      })
    } catch (e) {
      console.error('deleteVirtualTeam', team.id, 'failed:', e.message)
      // notify user
      Toast.open({
        duration: 8000,
        message: `Failed to delete virtual team ${team.id}: ${e.message}`,
        // position: 'is-bottom',
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'cwcc', type: 'virtualTeam', value: false})
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
