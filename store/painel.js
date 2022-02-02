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
  tab: undefined,
  item: undefined,
  qtds: 'RESUMIDO',
  tiposDeMarca: [
    { id: 'SIGA_EX', nome: 'Documentos' },
    { id: 'SIGA_SR', nome: 'Serviços' },
    { id: 'SIGA_GC', nome: 'Conhecimentos' },
  ]
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
  mapTiposDeMarca(state) {
    const r = {}
    for (let i = 0; i < state.tiposDeMarca.length; i++) {
      const tm = state.tiposDeMarca[i]
      r[tm.id] = tm
    }
    return r
  },
  arvore(state, getters) {
    const sumQtd = function (a) {
      if (!a.qtd) return 0
      return a.qtd.TOTAL
    }
    const compareQtd = function (a, b) {
      return sumQtd(b) - sumQtd(a)
    }
    const addQtd = function (qtd, para) {
      if (para.qtd[qtd.filtro] === undefined) para.qtd[qtd.filtro] = 0
      para.qtd[qtd.filtro] += parseInt(qtd.qtd)

      if (para.qtd[qtd.tipo] === undefined) para.qtd[qtd.tipo] = 0
      para.qtd[qtd.tipo] += parseInt(qtd.qtd)

      const key = qtd.filtro + ':' + qtd.tipo
      if (para.qtd[key] === undefined) para.qtd[key] = 0
      para.qtd[key] += parseInt(qtd.qtd)
    }

    if (!state.quadro) return []
    const r = []

    const todos = {
      escopo: 'TUDO',
      id: 1,
      nome: 'Tudo',
      qtd: {},
      filhos: [],
      filho: {},
    }

    r.push(todos)

    let tipo
    let grupo
    // let marcador
    for (let i = 0; i < state.quadro.length; i++) {
      const x = {
        ...state.quadro[i],
        escopo: 'MARCADOR',
        id: state.quadro[i].marcadorId,
        nome: state.quadro[i].marcadorNome,
        qtd: {},
      }

      // se não existir um este "tipo" no resultado, incluir
      if (x.tipoId && (!tipo || tipo.id !== x.tipoId)) {
        tipo = {
          escopo: 'TIPO',
          id: x.tipoId,
          nome: x.tipoNome,
          qtd: {},
          filhos: [],
        }
        r.push(tipo)
      }

      // se não existir um filho de "tipo" que represente esse grupo, incluir
      if (tipo.filhos.length === 0 || grupo.id !== x.grupoId) {
        grupo = {
          escopo: 'GRUPO',
          id: x.grupoId,
          nome: x.grupoNome,
          qtds: [],
          qtd: {},
          filhos: [],
        }
        tipo.filhos.push(grupo)
      }

      // se não existir um filho de "grupo" que represente esse marcador, incluir
      // if (grupo.filhos.length === 0 || marcador.id !== x.grupoId) {
      //   grupo = {
      //     escopo: 'GRUPO',
      //     id: x.grupoId,
      //     nome: x.grupoNome,
      //     qtds: [],
      //     qtd: {},
      //     filhos: [],
      //   }
      //   tipo.filhos.push(grupo)
      // }

      if (x.qtds) {
        for (let q = 0; q < x.qtds.length; q++) {
          const qtd = x.qtds[q]

          // se não existir um filho de "todos" que represente esse tipoDeMarca, incluir
          if (!todos.filho[qtd.tipo]) {
            const tipoDaMarca = {
              escopo: 'TIPO_MARCA',
              id: qtd.tipo,
              nome: getters.mapTiposDeMarca[qtd.tipo].nome,
              qtd: {},
            }
            todos.filhos.push(tipoDaMarca)
            todos.filho[qtd.tipo] = tipoDaMarca
          }

          addQtd(qtd, x)
          addQtd(qtd, grupo)
          addQtd(qtd, tipo)
          addQtd(qtd, todos.filho[qtd.tipo])
          addQtd(qtd, todos)
        }
      }
      // grupo.qtds[]
      // grupo.qtdAtendente += parseInt(x.qtdAtendente)
      // grupo.qtdLotaAtendente += parseInt(x.qtdLotaAtendente)
      grupo.filhos.push(x)
    }

    todos.filhos.sort((a, b) => compareQtd(a, b))

    return r
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
  setTab(state, val) {
    state.tab = val
  },
  setItem(state, val) {
    state.item = val
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
    commit('setItem', val.item)
    if (val.item.escopo === 'MARCADOR') {
      commit('setMarcadorId', val.item.id)
      commit('setGrupoId', undefined)
    } else if (val.item.escopo === 'GRUPO') {
      commit('setGrupoId', val.item.id)
      commit('setMarcadorId', undefined)
    }
    commit('setPessoaOuLotacao', val.filtro)
    commit('setQtd', val.item.qtd[val.filtro])
    await dispatch('carregarLista')
  },

  async trocarTab({
    state,
    commit,
    dispatch
  }, val) {
    commit('setTab', val)
    await dispatch('carregarQuadro')
  },

}
