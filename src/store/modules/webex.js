const actions = {
  async joinSupportRoom ({dispatch, getters}, email) {
    dispatch('fetch', {
      group: 'webex',
      type: 'joinSupportRoom',
      url: getters.endpoints.webex,
      options: {
        method: 'POST',
        body: {personEmail: email}
      }
    })
  }
}

export default {
  actions
}