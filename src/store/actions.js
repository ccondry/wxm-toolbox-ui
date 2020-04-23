import * as types from './mutation-types'

export const toggleSidebar = ({ commit }, data) => {
  if (data instanceof Object) {
    commit(types.TOGGLE_SIDEBAR, data)
  }
}

export const toggleDevice = ({ commit }, data) => commit(types.TOGGLE_DEVICE, data)

export const expandMenu = ({ commit }, data) => {
  if (data) {
    data.expanded = data.expanded || false
    commit(types.EXPAND_MENU, data)
  }
}

export const switchEffect = ({ commit }, data) => {
  if (data) {
    commit(types.SWITCH_EFFECT, data)
  }
}

export const loadToState = async function ({getters, commit, dispatch}, options) {
  console.log('loadToState:', options)
  if (!options.mutation) {
    const message = 'error during loadToState ' + options.name + ' - options.mutation was undefined. Verify that the mutation type constant is in mutation-types.js'
    console.log(message)
    return
    // throw Error(message)
  }
  try {
    let url = new URL(options.endpoint)
    if (options.query) {
      // append URL query paramenters
      Object.keys(options.query).forEach(key => {
        url.searchParams.append(key, params[key])
      })
    }
    // go
    const response = await fetch(url, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    })
    if (response.ok) {
      const json = await response.json()
      commit(options.mutation, json)
      if (options.showNotification) {
        dispatch('successNotification', `Successfully loaded ${options.name}`)
      }
      return json
    } else if (response.status === 401) {
      // JWT expired
      console.log('JWT expired. logging out user locally.')
      dispatch('unsetJwt')
    } else {
      const text = await response.text()
      throw Error(`${response.status} ${response.statusText} - ${text}`)
    }
  } catch (e) {
    console.error(`error during GET ${options.name}`, e.messaage)
    console.error(`error during GET ${options.name}`, e)
    dispatch('errorNotification', {title: `Failed to GET ${options.name}`, error: e})
  }
}

export const setWorking = function ({commit}, {group, type, value = true}) {
  commit(types.SET_WORKING, {group, type, value})
}

export const setLoading = function ({commit}, {group, type, value = true}) {
  commit(types.SET_LOADING, {group, type, value})
}

// export const putData = async function ({getters, commit, dispatch}, options) {
//   try {
//     console.log(`putData ${options.endpoint}`, options.data)
//     const response = await put(getters.instance, getters.jwt, options.endpoint, options.query, options.data)
//     console.log(`put ${options.name}`, response)
//     if (options.showNotification) {
//       dispatch('successNotification', `Successfully set ${options.name}`)
//     }
//     return response
//   } catch (e) {
//     console.log(`error during PUT ${options.name}`, e)
//     dispatch('errorNotification', {title: `Failed to PUT ${options.name}`, error: e})
//   }
// }

export const postData = async function ({getters, dispatch}, options) {
  try {
    console.log(`postData ${options.endpoint}`, options.data)

    let url = new URL(options.endpoint)
    // append URL query paramenters
    if (options.query) {
      Object.keys(options.query).forEach(key => {
        url.searchParams.append(key, params[key])
      })
    }
    // go
    const response = await fetch(options.endpoint, {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      },
      body: options.data
    })
    // ok?
    if (response.ok) {
      // const text = await response.text()
      const json = await response.json()
      return json
    } else if (response.status === 401) {
      // JWT expired
      console.log('JWT expired. logging out user locally.')
      dispatch('unsetJwt')
    } else {
      const text = await response.text()
      throw Error(`${response.status} ${response.statusText} - ${text}`)
    }
  } catch (e) {
    console.log(`error during POST ${options.name}`, e)
    // dispatch('errorNotification', {title: `Failed to POST ${options.name}`, error: e})
  }
}
