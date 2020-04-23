import { ToastProgrammatic as Toast } from 'buefy'

const actions = {
  async inviteToSupportRoom ({getters, commit, dispatch}, {email, showNotification = true}) {
    // metadata
    const group = 'webex'
    const type = 'invite'
    const action = 'Add user to the WXM Demo Support Webex Teams room'
    // set working state on
    dispatch('setWorking', {group, type, value: true})
    console.log('starting', action, 'using email', email, '...')
    // REST API endpoint URL
    try {
      let url = new URL(getters.endpoints.webex)
      // append URL query paramenters
      const params = {email}
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key])
      })
      const options = {
        headers: {
          Authorization: 'Bearer ' + getters.jwt,
          instance: getters.instance
        },
        method: 'post'
      }
      await fetch(url, options)
      // show a Toast notification on success, if not disabled
      if (showNotification) {
        Toast.open({
          duration: 8000,
          message: `${action} successful.`,
          type: 'is-success'
        })
      }
    } catch (e) {
      console.log(action, 'failed:', e)
      // show a Toast notification on error
      Toast.open({
        duration: 14000,
        message: `${action} failed with this error: ` + e.response.data,
        type: 'is-danger'
      })
    } finally {
      // set working state off
      dispatch('setWorking', {group, type, value: false})
    }
  }
}

export default {
  actions
}
