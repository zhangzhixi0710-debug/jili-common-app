import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import base from '@/store/modules/base'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    base
  },
  getters
})

export default store
