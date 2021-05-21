import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || "",
    username: localStorage.getItem("username") || "",
  },
  mutations: {
    login(state, data) {
      for (let key in data) {
        state[key] = data[key]
        localStorage.setItem(key, data[key])
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
