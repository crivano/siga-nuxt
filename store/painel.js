import UtilsBL from "../bl/utils.js";

export const state = () => ({
  primeiraCarga: true,
  quadro: undefined,
  lista: undefined,
  qtd: undefined,
  marcadorId: undefined,
  pessoaOuLotacao: undefined,
  grupoId: undefined,
  filtro: undefined,
  qtds: 'RESUMIDO',
})

export const getters = {
  listDeQuantidades(state) {
    if (state.qtds === 'DETALHADO')
      return [
        { icone: 'user', filtro: 'PESSOA' },
        { icone: 'users', filtro: 'LOTACAO' },
        { icone: 'user-slash', filtro: 'NAO_ATRIBUIDO' }
      ]
    else
      return [{ icone: 'folder-open', filtro: 'TOTAL' }];
  },
}

export const mutations = {
  setPrimeiraCarga(state, val) {
    state.primeiraCarga = val
  },
  setQuadro(state, val) {
    state.quadro = val
  },
  setLista(state, val) {
    state.lista = val
  },
  setQtd(state, val) {
    state.qtd = val
  },
  setMarcadorId(state, val) {
    state.marcadorId = val
  },
  setPessoaOuLotacao(state, val) {
    state.pessoaOuLotacao = val
  },
  setGrupoId(state, val) {
    state.grupoId = val
  },
  setFiltro(state, val) {
    state.filtro = val
  },
  setQtds(state, val) {
    state.qtds = val
  }
}

export const actions = {
  async carregarQuadro({
    state,
    commit,
    dispatch
  }, val) {
    try {
      const data = await this.$axios.$get(
        'siga/api/v1/painel/quadro?estilo=Agrupados'
      )
      const l = data.list.filter(
        (i) =>
          i.marcadorId !== 9 &&
          i.marcadorId !== 8 &&
          i.marcadorId !== 10 &&
          i.marcadorId !== 11 &&
          i.marcadorId !== 12 &&
          i.marcadorId !== 13 &&
          i.marcadorId !== 16 &&
          i.marcadorId !== 18 &&
          i.marcadorId !== 20 &&
          i.marcadorId !== 21 &&
          i.marcadorId !== 22 &&
          i.marcadorId !== 26 &&
          i.marcadorId !== 32 &&
          i.marcadorId !== 62 &&
          i.marcadorId !== 63 &&
          i.marcadorId !== 64 &&
          i.marcadorId !== 7 &&
          i.marcadorId !== 50 &&
          i.marcadorId !== 51
      )
      commit('setPrimeiraCarga', false)
      commit('setQuadro', l)
      window.quadro = l
      if (!state.marcadorId) {
        for (const i of l) {
          const qtdAtendente = i.qtdAtendente ? parseInt(i.qtdAtendente) : 0
          const qtdLotaAtendente = i.qtdLotaAtendente ? parseInt(i.qtdLotaAtendente) : 0
          const pessoaOuLotacao = qtdAtendente ? 'PESSOA' : 'LOTACAO'
          if (qtdAtendente || qtdLotaAtendente) {
            if (state.marcadorId !== i.marcadorId || state.pessoaOuLotacao !== pessoaOuLotacao) {
              commit('setMarcadorId', i.marcadorId)
              commit('setQtd', qtdAtendente ? i.qtdAtendente : i.qtdLotaAtendente)
              commit('setPessoaOuLotacao', pessoaOuLotacao)
              await dispatch('carregarLista')
            }
            break
          }
        }
      }
    } catch (ex) { }
  },

  async carregarLista({
    state, commit, dispatch
  }, token) {
    console.log("vou carregar a lista")
    if (!state.marcadorId && !state.grupoId) return
    const url = `siga/api/v1/painel/lista?${state.marcadorId ? 'idMarcador=' + state.marcadorId : ''}${state.grupoId ? 'idGrupo=' + state.grupoId : ''}&filtroPessoaLotacao=${state.pessoaOuLotacao}`
    console.log(url)
    try {
      const data = await this.$axios.$get(url)
      const l = data.list
      const marcasPorModulo = {}
      l.forEach((i) => {
        i.siglaCompacta = UtilsBL.onlyLettersAndNumbers(i.sigla)
        i.documentoData = UtilsBL.formatDDMMYYYY(i.documentoData)
        i.marcaData = UtilsBL.formatDDMMYYYY(i.marcaData)
        i.tipo = undefined
        if (!marcasPorModulo[i.moduloId])
          marcasPorModulo[i.moduloId] = []
        marcasPorModulo[i.moduloId].push(i.marcaId)
      })
      console.log(marcasPorModulo)
      commit('setLista', l)
      if (marcasPorModulo["1"]) dispatch('complementarLista', { moduloId: "1", idMarcas: marcasPorModulo[1] })
    } catch (ex) { }
  },

  async complementarLista({
    state, commit
  }, val) {
    console.log("vou complementar a lista")

    const url = (val.moduloId === "1" ? 'sigaex' : undefined) + '/api/v1/painel/lista?idMarcas=' + val.idMarcas.join(',')

    console.log(url)

    console.log('state.lista')
    console.log(state.lista)

    // Clona state.lista
    const lista = []
    state.lista.forEach(
      e => lista.push({ ...e })
    )

    console.log('lista')
    console.log(lista)

    try {
      const data = await this.$axios.$get(url)
      const l = data.list

      // Cria um mapa com cada uma das marcas do resultado
      const map = {}
      l.forEach(
        e => (map[e.marcaId] = e)
      )

      for (let i = 0; i < lista.length; i++) {
        const r = map[lista[i].marcaId]
        if (r) lista[i] = r
      }

      commit('setLista', lista)
    } catch (ex) { }
  },


  async trocarLista({
    state,
    commit,
    dispatch
  }, val) {
    if (val.tipo === 'MARCADOR') {
      commit('setMarcadorId', val.id)
      commit('setGrupoId', undefined)
    } else if (val.tipo === 'GRUPO') {
      commit('setGrupoId', val.id)
      commit('setMarcadorId', undefined)
    }
    commit('setPessoaOuLotacao', val.pessoaOuLotacao)
    commit('setQtd', val.qtd)
    await dispatch('carregarLista')
  },

  async trocarQtds({
    state,
    commit,
    dispatch
  }, val) {
    commit('setQtds', val)
    await dispatch('carregarLista')
  },

}
