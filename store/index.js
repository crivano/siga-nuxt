import AuthBL from "../bl/auth.js"

export const state = () => ({
  test: {
    properties: {
      "siga.ambiente": "desenv"
    }
  },
  jwt: {},
  usuario: {}
})

export const mutations = {
  setTest(state, val) {
    state.test = val
  },
  setJwt(state, val) {
    state.jwt = val
  },
  setUsuario(state, val) {
    state.usuario = val
  }
}

export const actions = {
  async login({
    state,
    commit,
    dispatch
  }, val) {
    const userandpass = val.username + ':' + val.password
    const hash = btoa(userandpass)
    const auth = 'Basic ' + hash
    const token = (await this.$axios.$post(
      'siga/api/v1/autenticar', {}, {
        headers: {
          Authorization: auth
        }
      }
    )).token

    // if (!token) {
    //   commit('setJwt', undefined)
    //   return
    // }

    AuthBL.setIdToken(token, this.$axios)
    await dispatch('updateLogged', token)
  },

  async updateLogged({
    commit,
    dispatch
  }, token) {
    commit('setJwt', AuthBL.decodeToken(token))
    await dispatch('carregarUsuario')
    console.log(this.$router.currentRoute)
    if (this.$router.currentRoute && this.$router.currentRoute.name === "login")
      this.$router.push({
        name: 'quadro',
        params: {
          exibirAcessoAnterior: true
        },
      })

  },

  async carregarUsuario({
    state,
    commit
  }, val) {
    const usuario = await this.$axios.$get("siga/api/v1/usuario")
    commit('setUsuario', usuario)
  }
}
