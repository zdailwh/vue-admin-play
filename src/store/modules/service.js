import { getInputs, getOutputs, addInput, addOutput, getInput, updateInput, delInput, getOutput, updateOutput, delOutput, getChannels, getChannel, addChannel, updateChannel, channelStart, channelStop, channelDisable, channelEnable, delChannel, getLogos, addLogo, logoUpload, getLogs, delLogo } from '@/api/service'
const state = {
  inputs: [],
  outputs: [],
  channels: [],
  channel: {},
  logos: [],
  type: 0
}

const getters = {
  inputsTypeNot2: (state) => {
    var res = []
    if (state.inputs.length) {
      res = state.inputs.filter(function(item, idx, inputs) {
        return item.type !== 2
      })
    }
    return res
  },
  outputsTypeNot2: (state) => {
    var res = []
    if (state.outputs.length) {
      res = state.outputs.filter(function(item, idx, outputs) {
        return item.type !== 2
      })
    }
    return res
  }
}

const mutations = {
  SET_TYPE: (state, type) => {
    state.type = type
  },
  SET_INPUTS: (state, inputs) => {
    state.inputs = inputs
  },
  SET_OUTPUTS: (state, outputs) => {
    state.outputs = outputs
  },
  SET_CHANNELS: (state, channels) => {
    state.channels = channels
  },
  SET_CHANNEL: (state, channel) => {
    state.channel = channel
  },
  SET_LOGOS: (state, logos) => {
    state.logos = logos
  }
}

const actions = {
  changeType({ dispatch, commit }, type) {
    commit('SET_TYPE', type)
    dispatch('getChannels')
  },
  getInputs({ commit }) {
    return new Promise((resolve, reject) => {
      getInputs({ per_page: 100 }).then(response => {
        const items = response.data.items || []
        commit('SET_INPUTS', items.reverse())
        resolve(items)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  addInput({ dispatch, state, commit }, params) {
    return new Promise((resolve, reject) => {
      addInput(params).then(response => {
        // const item = response.data
        // commit('SET_INPUTS', state.inputs.concat([item]))
        // resolve(response.data)
        dispatch('getInputs')
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getInput({ state, commit }, params) {
    return new Promise((resolve, reject) => {
      getInput({ id: params.id }).then(response => {
        const item = response.data
        state.inputs.splice(params.index, 1, item)
        resolve(item)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  updateInput({ dispatch, state, commit }, params) {
    return new Promise((resolve, reject) => {
      updateInput(params).then(response => {
        // const item = response.data
        // state.inputs.splice(params.index, 1, item)
        // resolve(item)
        dispatch('getInputs')
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  delInput({ dispatch, state, commit }, params) {
    return new Promise((resolve, reject) => {
      delInput({ id: params.id }).then(response => {
        // const item = response.data
        // state.inputs.splice(params.index, 1)
        // resolve(item)
        dispatch('getInputs')
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getOutputs({ commit }) {
    return new Promise((resolve, reject) => {
      getOutputs({ per_page: 100 }).then(response => {
        const items = response.data.items || []
        commit('SET_OUTPUTS', items)
        resolve(items)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  addOutput({ dispatch, state, commit }, params) {
    return new Promise((resolve, reject) => {
      addOutput(params).then(response => {
        // const item = response.data
        // commit('SET_OUTPUTS', state.outputs.concat([item]))
        // resolve(response.data)
        dispatch('getOutputs')
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getOutput({ state, commit }, params) {
    return new Promise((resolve, reject) => {
      getOutput({ id: params.id }).then(response => {
        const item = response.data
        state.outputs.splice(params.index, 1, item)
        resolve(item)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  updateOutput({ dispatch, state, commit }, params) {
    return new Promise((resolve, reject) => {
      updateOutput(params).then(response => {
        // const item = response.data
        // state.outputs.splice(params.index, 1, item)
        // resolve(item)
        dispatch('getOutputs')
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  delOutput({ dispatch, state, commit }, params) {
    return new Promise((resolve, reject) => {
      delOutput({ id: params.id }).then(response => {
        // const item = response.data
        // state.outputs.splice(params.index, 1)
        // resolve(item)
        dispatch('getOutputs')
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getChannels({ state, commit }) {
    return new Promise((resolve, reject) => {
      getChannels({ type: state.type, per_page: 100 }).then(response => {
        const items = response.data.items || []
        commit('SET_CHANNELS', items)
        resolve(items)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getChannel({ commit }, params) {
    return new Promise((resolve, reject) => {
      getChannel({ id: params.id }).then(response => {
        const item = response.data
        commit('SET_CHANNEL', item)
        resolve(item)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  addChannel({ dispatch, state, commit }, params) {
    return new Promise((resolve, reject) => {
      addChannel(params).then(response => {
        // const item = response.data
        // commit('SET_CHANNELS', state.channels.concat([item]))
        // resolve(item)
        dispatch('getChannels')
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  updateChannel({ dispatch, state, commit }, params) {
    return new Promise((resolve, reject) => {
      updateChannel(params).then(response => {
        const item = response.data
        commit('SET_CHANNEL', item)
        dispatch('getChannels')
        resolve(item)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  channelStart({ state, commit }, params) {
    return new Promise((resolve, reject) => {
      channelStart({ id: params.id }).then(response => {
        const item = response.data
        state.channels.splice(params.index, 1, item)
        resolve(item)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  channelStop({ state, commit }, params) {
    return new Promise((resolve, reject) => {
      channelStop({ id: params.id }).then(response => {
        const item = response.data
        state.channels.splice(params.index, 1, item)
        resolve(item)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  channelDisable({ state, commit }, params) {
    return new Promise((resolve, reject) => {
      channelDisable({ id: params.id }).then(response => {
        const item = response.data
        state.channels.splice(params.index, 1, item)
        resolve(item)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  channelEnable({ state, commit }, params) {
    return new Promise((resolve, reject) => {
      channelEnable({ id: params.id }).then(response => {
        const item = response.data
        state.channels.splice(params.index, 1, item)
        resolve(item)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  delChannel({ dispatch, state, commit }, params) {
    return new Promise((resolve, reject) => {
      delChannel({ id: params.id }).then(response => {
        // const item = response.data
        // state.channels.splice(params.index, 1)
        // resolve(item)
        dispatch('getChannels')
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getLogos({ commit }) {
    return new Promise((resolve, reject) => {
      getLogos().then(response => {
        const items = response.data.items || []
        commit('SET_LOGOS', items)
        resolve(items)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  addLogo({ state, commit }, params) {
    return new Promise((resolve, reject) => {
      addLogo(params).then(response => {
        const item = response.data
        commit('SET_LOGOS', state.logos.concat([item]))
        resolve(response.data)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  logoUpload({ state, commit }, params) {
    return new Promise((resolve, reject) => {
      logoUpload(params).then(response => {
        const item = response.data
        resolve(item)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getLogs({ commit }, params) {
    return new Promise((resolve, reject) => {
      getLogs(params).then(response => {
        resolve(response.data)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  delLogo({ dispatch, state, commit }, params) {
    return new Promise((resolve, reject) => {
      delLogo({ id: params.id }).then(response => {
        // const item = response.data
        // state.channels.splice(params.index, 1)
        // resolve(item)
        dispatch('getLogos')
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

