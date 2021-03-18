import {ToastProgrammatic as Toast} from 'buefy/src'

const actions = {
  async joinSupportRoom ({dispatch, getters}, email) {
    const response = await dispatch('fetch', {
      group: 'webex',
      type: 'joinSupportRoom',
      url: getters.endpoints.webex,
      message: 'Join Webex support room',
      options: {
        method: 'POST',
        body: {personEmail: email}
      }
    })
    if (response instanceof Error) {
      // error
      if (response.status === 409) {
        // user already in the room
        Toast.open({
          type: 'is-success',
          message: 'You are already in the support room.'
        })
      } else {
        // other errors
        Toast.open({
          type: 'is-danger',
          message: `Failed to add your to the support room in webex: ${response.message}`
        })
      }
    } else {
      // success
      Toast.open({
        type: 'is-success',
        message: `You have been added to the support room in Webex.`
      })
    }
    
    // return the response
    return response
  }
}

export default {
  actions
}