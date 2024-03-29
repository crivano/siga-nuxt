import AuthBL from "../bl/auth.js"

export const state = () => ({
  test: {
    properties: {
      "siga.ambiente": "desenv"
    }
  },
  enums: {},
  tabelas: {},
  usuario: {},
  home: (process.server) ? 'painel' : localStorage.getItem('home')||'painel'
 // home: 'painel'
})

export const mutations = {
  setTest(state, val) {
    state.test = val
  },
  setEnums(state, val) {
    state.enums = val
  },
  setTabelas(state, val) {
    state.tabelas = val
  },
  setUsuario(state, val) {
    state.usuario = val
  },
  setHome(state, val) {
    state.home = val
    localStorage.setItem('home', val)
  }
}

export const actions = {
  async init({ commit }) {
    try {
      const dadosEstaticos = (await this.$axios.$get('sigaex/api/v1/dados-estaticos'))
      // console.log('carreguei dados estáticos')
      // console.log(dadosEstaticos)
      // console.log(JSON.parse(dadosEstaticos.enumsAsJson))
      commit('setEnums', JSON.parse(dadosEstaticos.enumsAsJson))
      commit('setTabelas', JSON.parse(dadosEstaticos.tabelasAsJson))
    } catch (ex) { }
  },
  async login({
    state,
    commit,
    dispatch
  }, val) {
    const userandpass = val.username + ':' + val.password
    const hash = btoa(userandpass)
    const auth = 'Basic ' + hash
    try {
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

      AuthBL.setIdToken(token)
      await dispatch('updateLogged', token)
    } catch (ex) { }
  },

  async logout({
    state,
    commit,
    dispatch
  }, val) {
    try {
      await this.$axios.$post(
        'siga/api/v1/sair', {}, {}
      )

      commit('setUsuario', {})
      AuthBL.logout()
    } catch (ex) { }
  },


  async updateLogged({
    commit,
    dispatch
  }, token) {
    await dispatch('carregarUsuario')
    dispatch('painel/iniciar')
    // console.log(this.$router.currentRoute)
    if (this.$router.currentRoute && this.$router.currentRoute.name === "login")
      this.$router.push({
        name: 'painel',
        params: {
          exibirAcessoAnterior: true
        },
      })
  },

  async carregarUsuario({
    state,
    commit
  }, val) {
    try {
      const usuario = await this.$axios.$get("siga/api/v1/usuario")
      commit('setUsuario', usuario.usuario)
    } catch (ex) { }
  },

  async substituir({
    state,
    commit,
    dispatch
  }, val) {
    try {
      console.log('substituir')
      console.log(val)
      const usuario = await this.$axios.$post("siga/api/v1/usuario/substituir", { substituicaoId: val })
      commit('setUsuario', usuario.usuario)
      await dispatch('carregarUsuario')
    } catch (ex) { }
  }

}
