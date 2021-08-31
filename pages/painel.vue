<template>
  <div class="container-fluid content">
    <div class="row bg-light pb-3">
      <div class="col col-12 col-md-auto"></div>
      <div class="col col-auto ml-auto">
        <nuxt-link to="/documento/novo" class="btn btn-primary mt-3"
          ><font-awesome-icon
            :icon="['fa', 'plus']"
            class="mr-1"
          />Novo</nuxt-link
        >
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-4 bg-light vh-100">
        <QuadroPainel
          @pesquisar="pesquisar($event)"
          :lista="lista"
          :carregando="carregandoExpediente"
          :primeira-carga="primeiraCarga"
          filtro-expediente-processo="Expediente"
        />
      </div>
      <div class="col-12 col-lg-8 pl-0 pr-0">
        <div class="row">
          <div class="col mt-3 ml-1 mb-3">
            <h4 class="mb-0 mt-0">{{ titulo }}</h4>
          </div>
          <div class="col col-12 col-md-auto ml-auto mb-3 mr-3 mb-0">
            <MyFiltro v-model="filtro" class="input-group-sm" />
          </div>
        </div>

        <DocPesquisa
          v-if="marcadorId"
          ref="pesquisa"
          :idMarcador="marcadorId"
          :filtroPessoaLotacao="filtroPessoaLotacao"
          :filtroExpedienteProcesso="filtroExpedienteProcesso"
          :qtd="qtd"
          :marcadorNome="marcadorNome"
          :filtro="filtro"
          :painel="true"
        />
      </div>
    </div>
    <p
      v-if="acessos &amp;&amp; acessos.length >= 1"
      class="alert alert-success mt-3"
    >
      Último acesso em {{ acessos[1].datahora }} no endereço
      {{ acessos[1].ip }}.
    </p>
  </div>
</template>

<script>
import UtilsBL from '../bl/utils.js'

export default {
  data() {
    return {
      marcadorId: undefined,
      filtroPessoaLotacao: undefined,
      filtroExpedienteProcesso: undefined,
      marcadorNome: undefined,
      qtd: undefined,

      mesa: undefined,
      filtro: undefined,
      lista: window.painel ? window.painel : [],
      primeiraCarga: !!window.quadroExpediente || !!window.quadroProcesso,
      todos: {},
      carregandoExpediente: false,
      carregandoProcesso: false,
      acessos: [],
      errormsg: undefined,
    }
  },

  computed: {
    titulo() {
      return this.marcadorNome + ' (' + this.qtd + ')'
    },
  },

  async fetch() {
    const erros = {}
    if (this.lista && this.lista.length > 0) {
      for (let i = 0; i < this.lista.length; i++) {
        erros[this.lista[i].codigo] = this.lista[i].errormsg
      }
    }
    try {
      const data = await this.$axios.$get(
        'sigaex/api/v1/quadro?filtroExpedienteProcesso=Todos'
      )
      this.lista = data.list.filter(
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
      this.primeiraCarga = false
      window.painel = this.lista
      if (!this.marcadorId) {
        for (const i of this.lista) {
          if (i.qtdAtendente || i.qtdLotaAtendente) {
            this.filtroPessoaLotacao = i.qtdAtendente ? 'Pessoa' : 'Lotacao'
            this.filtroExpedienteProcesso = 'Expediente'
            this.marcadorId = i.marcadorId
            this.marcadorNome = i.marcadorNome
            this.qtd = i.qtdAtendente ? i.qtdAtendente : i.qtdLotaAtendente
            break
          }
        }
      }
    } catch (ex) {}
  },
  methods: {
    async carregarAcessos() {
      this.acessos.length = 0
      try {
        const data = await this.$axios.$get('siga/api/v1/acessos')
        const list = data.list
        for (let i = 0; i < list.length; i++) {
          list[i].datahora = UtilsBL.formatJSDDMMYYYY_AS_HHMM(list[i].datahora)
          this.acessos.push(list[i])
        }
      } catch (ex) {}
    },

    listar(item, pessoa) {
      this.$router.push({
        name: 'Lista',
        pessoa: !!pessoa,
        lotacao: !pessoa,
      })
    },

    pesquisar(params) {
      this.marcadorId = params.marcadorId
      this.filtroPessoaLotacao = params.filtroPessoaLotacao
      this.filtroExpedienteProcesso = params.filtroExpedienteProcesso
      this.marcadorNome = params.marcadorNome
      this.qtd = params.qtd
    },
  },
}
</script>
