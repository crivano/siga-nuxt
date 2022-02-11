import UtilsBL from "../bl/utils.js";
import EntrevistaBL from '../bl/entrevista.js'

const getDefaultState = () => {
  return {
    tipoDestinatario: 'LOTACAO',
    modelo: undefined,
    idModelo: undefined,
    entrevista: undefined,
    entrevistaTemplate: undefined,
    conteudoBlobFormString: undefined,
    subscritor: undefined,
    destinatario: undefined,
    lotaDestinatario: undefined,
    classificacao: undefined,
    descricao: undefined,
    nivelacesso: undefined,
    numero: undefined,
    sigla: undefined,
    siglaMobilPai: undefined,
    siglaMobilFilho: undefined,
    podeCapturarPDF: false,
    arquivo: undefined,
  }
}

export const state = () => ({ modelos: [], modelosUrl: undefined, ...getDefaultState() })

export const getters = {
  hierarquiaDeModelos(state) {
    if (!state.modelos) return
    return UtilsBL.buildHierarchy(state.modelos, 'idModelo', 'nome')
  },
  siglaSubscritor(state) {
    if (!state.subscritor) return undefined
    return state.subscritor.split(' - ')[0]
  },
  siglaDestinatario(state) {
    if (!state.destinatario || state.tipoDestinatario !== 'PESSOA') return undefined
    return state.destinatario.split(' - ')[0]
  },
  siglaLotaDestinatario(state) {
    if (!state.lotaDestinatario || state.tipoDestinatario !== 'LOTACAO') return undefined
    return state.lotaDestinatario.split(' - ')[0]
  },
  siglaClassificacao(state) {
    if (!state.classificacao) return undefined
    return state.classificacao.split(' - ')[0]
  },
  capturarPDF(state) {
    return (
      state.modelo &&
      state.modelo.tipoDeDocumento.includes('Capturado') &&
      (!state.numero || state.podeCapturarPDF)
    )
  },
}

export const mutations = {
  resetDocumento(state) {
    Object.assign(state, getDefaultState())
  },
  tipoDestinatario(state, val) {
    state.tipoDestinatario = val
  },
  modelos(state, val) {
    state.modelos = val
  },
  modelosUrl(state, val) {
    state.modelosUrl = val
  },
  modelo(state, val) {
    state.modelo = val
  },
  idModelo(state, val) {
    state.idModelo = val
  },
  entrevista(state, val) {
    state.entrevista = val
  },
  entrevistaTemplate(state, val) {
    state.entrevistaTemplate = val
  },
  conteudoBlobFormString(state, val) {
    state.conteudoBlobFormString = val
  },
  subscritor(state, val) {
    state.subscritor = val
  },
  destinatario(state, val) {
    state.destinatario = val
  },
  lotaDestinatario(state, val) {
    state.lotaDestinatario = val
  },
  classificacao(state, val) {
    state.classificacao = val
  },
  descricao(state, val) {
    state.descricao = val
  },
  nivelacesso(state, val) {
    state.nivelacesso = val
  },
  numero(state, val) {
    state.numero = val
  },
  sigla(state, val) {
    state.sigla = val
  },
  siglaMobilPai(state, val) {
    state.siglaMobilPai = val
  },
  siglaMobilFilho(state, val) {
    state.siglaMobilFilho = val
  },
  podeCapturarPDF(state, val) {
    state.podeCapturarPDF = val
  },
  arquivo(state, val) {
    state.arquivo = val
  },
}

export const actions = {
  async carregarDocumento({ state, commit, dispatch }, numero) {
    commit('resetDocumento')
    if (!numero) return
    commit('numero', numero)
    try {
      const doc = await this.$axios.$get(
        'sigaex/api/v1/documentos/' + state.numero
      )
      commit('podeCapturarPDF', doc.podeCapturarPDF)
      commit('sigla', doc.sigla)
      commit('idModelo', doc.idModelo)
      commit('descricao', doc.descrDocumento)
      commit('subscritor', (doc.subscritorSigla ? doc.subscritorSigla + ' - ' : '') +
        doc.subscritorNome)
      if (doc.destinatarioTipo === 'PESSOA')
        commit('destinatario',
          (doc.destinatarioSigla ? doc.destinatarioSigla + ' - ' : '') +
          doc.destinatarioNome)
      else if (doc.destinatarioTipo === 'LOTACAO')
        commit('lotaDestinatario',
          (doc.destinatarioSigla ? doc.destinatarioSigla + ' - ' : '') +
          doc.destinatarioNome)

      commit('classificacao',
        (doc.classificacaoSigla ? doc.classificacaoSigla + ' - ' : '') +
        doc.classificacaoNome)

      commit('conteudoBlobFormString', doc.conteudoBlobFormString)
    } catch (ex) { }
  },

  async carregarModelos({ state, commit, dispatch }) {
    let url = 'sigaex/api/v1/modelos'
    if (this.siglaMobilPai)
      url =
        'sigaex/api/v1/documentos/' +
        UtilsBL.onlyLettersAndNumbers(this.siglaMobilPai) +
        '/modelos-para-incluir'
    else if (this.siglaMobilFilho)
      url =
        'sigaex/api/v1/documentos/' +
        UtilsBL.onlyLettersAndNumbers(this.siglaMobilFilho) +
        '/modelos-para-autuar'
    if (state.modelos.length !== 0 && state.modelosUrl === url) return
    try {
      const data = await this.$axios.$get(url)
      commit('modelosUrl', url)
      commit('modelos', data.list)
    } catch (ex) { }
  },

  async carregarModelo({ state, commit, dispatch }) {
    if (state.modelo && state.idModelo === state.modelo.idModelo) return
    try {
      commit('modelo', await this.$axios.$get(
        'sigaex/api/v1/modelos/' + state.idModelo
      ))
      commit('nivelacesso', state.modelo.nivelDeAcesso)
    } catch (ex) { }
  },


  async processarEntrevista({ state, commit, dispatch }, val) {
    // const formParams = EntrevistaBL.encodeFormParams(
    //   EntrevistaBL.getFormResults(this.$refs.form)
    // )
    try {
      const data = await this.$axios.$post(
        'sigaex/api/v1/modelos/' + state.idModelo + '/processar-entrevista',
        { entrevista: val.params || val.formParams || '{}' }
      )
      commit('entrevista', EntrevistaBL.fix(data))
      // self.$refs.divEntrevista.innerHTML = self.entrevista
      // self.entrevistaTemplate = self.$refs.divEntrevista.innerHTML
    } catch (ex) { }
  },

  async salvar({ state, commit, dispatch }, formParams) {
    const data = new FormData()
    if (state.modelo) data.append('modelo', state.idModelo)
    if (state.siglaSubscritor) data.append('subscritor', state.siglaSubscritor)
    data.append('eletronico', true)
    data.append('descricaotipodoc', 'Interno Produzido')
    if (state.classificacao) data.append('classificacao', state.classificacao)
    if (state.siglaDestinatario)
      data.append('pessoadestinatario', state.siglaDestinatario)
    if (state.siglaLotaDestinatario)
      data.append('lotadestinatario', state.siglaLotaDestinatario)
    if (state.descricao) data.append('descricaodocumento', state.descricao)
    if (state.nivelacesso) data.append('nivelacesso', state.nivelacesso)
    if (formParams) data.append('entrevista', formParams)
    if (state.sigla) data.append('sigla', state.sigla)
    if (state.siglaMobilPai) data.append('siglamobilpai', state.siglaMobilPai)
    if (state.siglaMobilFilho)
      data.append('siglamobilfilho', state.siglaMobilFilho)
    if (state.arquivo) data.append('arquivo', state.arquivo)

    try {
      const rdata = await this.$axios.$post('sigaex/api/v1/documentos', data)
      return rdata
    } catch (ex) { }
  },

  async trocarPagina({ state, commit, dispatch }, val) {
    commit('setPagina', val)
    await dispatch('ajustarSelecaoDeItem')
    await dispatch('carregarLista')
  }
}
