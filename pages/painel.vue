<template>
  <div class="container-fluid content">
    <div class="row">
      <div class="col-12 col-xl-3 col-md-6 bg-light pt-2">
        <QuadroPainel
          :carregando="carregandoExpediente"
          :primeira-carga="primeiraCarga"
          @pesquisar="pesquisar($event)"
        />
      </div>
      <div class="col-12 col-xl-9 col-md-6">
        <div class="row" v-if="false">
          <div class="col col-12 col-md-9 mt-3 mb-3">
            <h4 class="mb-0 mt-0">{{ titulo }}</h4>
          </div>
          <div class="col col-12 col-md-3 mb-3 mb-0">
            <MyFiltro v-model="filtro" class="input-group-sm" />
          </div>
        </div>

        <b-tabs
          class="mt-3 mb-0"
          content-class="mt-0"
          active-nav-item-class="font-weight-bold bg-dark text-white"
          lazy
        >
          <b-tab
            v-for="tm in tabs"
            :key="tm.id"
            :title="tm.nome + (tm.id ? ' (' + tm.count + ')' : '')"
            @click="$store.dispatch('painel/trocarTab', tm.id)"
          >
            <template v-if="false" #title>
              <span>{{ tm.nome }} </span>
              <span
                class="
                  position-absolutex
                  badge
                  rounded-pillx
                  bg-light
                  text-dark
                  top-0
                  start-100
                  translate-middle
                "
                style="margin-top: -0.5em"
              >
                {{ tm.count }}
              </span>
            </template>
            <DocPesquisa
              v-if="$store.state.painel.lista"
              ref="pesquisa"
              :id-marcador="marcadorId"
              :filtro-pessoa-lotacao="filtroPessoaLotacao"
              :filtro-expediente-processo="filtroExpedienteProcesso"
              :qtd="qtd"
              :marcador-nome="marcadorNome"
              :filtro="filtro"
              :painel="true"
            />
          </b-tab>
        </b-tabs>
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

  async fetch() {
    await this.$store.dispatch('painel/iniciar')
  },

  mounted() {
    if (this.$route.params.item) {
      this.$store.dispatch('painel/trocarItemEFiltro', {
        item: this.$route.params.item,
        filtro: 'TOTAL',
      })
    }
  },

  computed: {
    titulo() {
      if (this.marcadorNome && this.qtd)
        return this.marcadorNome + ' (' + this.qtd + ')'
      return ''
    },

    tabs() {
      let a = [{ id: undefined, nome: 'Todos' }]
      this.$store.state.painel.tiposDeMarca.forEach((e) => {
        a.push({ ...e })
      })
      if (this.$store.state.painel.item)
        a.forEach((e) => {
          e.count =
            this.$store.state.painel.item.qtd[
              this.$store.state.painel.pessoaOuLotacao +
                (e.id ? ':' + e.id : '')
            ]
        })
      a = a.filter((e) => e.count)
      return a
    },
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
