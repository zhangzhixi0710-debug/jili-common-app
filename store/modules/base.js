const state = {
  token: '',
  direction: '',
  isDesktop: false
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_DIRECTION: (state, direction) => {
    state.direction = direction
  },
  SET_IS_DESKTOP: (state, isDesktop) => {
    state.isDesktop = isDesktop
  }
}

const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
    uni.setStorageSync('token', token)
  },
  setDirection({ commit }, direction) {
    commit('SET_DIRECTION', direction)
  },
  setIsDesktop({ commit }, isDesktop) {
    commit('SET_IS_DESKTOP', isDesktop)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

