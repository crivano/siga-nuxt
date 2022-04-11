<template>
  <div class="container-fluid content">
    <div class="row mt-3">
      <div class="col-12 col-md-6">
        <quadro-tabela
          titulo="Expedientes"
          :lista="listaExpediente"
          :carregando="carregandoExpediente"
          :primeira-carga="primeiraCarga"
          filtro-expediente-processo="Expediente"
        />

        <quadro-tabela
          titulo="Processos Administrativos"
          :lista="listaProcesso"
          :carregando="carregandoProcesso"
          :primeira-carga="primeiraCarga"
          filtro-expediente-processo="Processo"
        />

        <div class="row d-print-none">
          <div class="col col-auto ml-auto">
            <nuxt-link to="/documento/novo" class="btn btn-primary"
              >Novo</nuxt-link
            >
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <wf-quadro-tabela
          titulo="Tarefas"
          :lista="listaTarefa"
          :carregando="carregandoTarefas"
          :primeira-carga="primeiraCarga"
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
      mesa: undefined,
      filtro: undefined,
      listaExpediente: window.quadroExpediente ? window.quadroExpediente : [],
      listaProcesso: window.quadroProcesso ? window.quadroProcesso : [],
      listaTarefa: window.quadroTarefa ? window.quadroTarefa : [],
      primeiraCarga:
        !!window.quadroExpediente ||
        !!window.quadroProcesso ||
        !!window.quadroTarefa,
      todos: {},
      carregandoExpediente: false,
      carregandoProcesso: false,
      carregandoTarefas: false,
      acessos: [],
      errormsg: undefined,
    }
  },

  computed: {},
  mounted() {
    this.errormsg = undefined

    setTimeout(() => {
      this.carregarQuadro('Expediente')
      this.carregarQuadro('Processo')
      this.carregarTarefas()
      if (this.$route.params.exibirAcessoAnterior) this.carregarAcessos()
    })
  },

  methods: {
    async carregarQuadro(tipo) {
      this['carregando' + tipo] = true
      const erros = {}
      if (this.lista && this.lista.length > 0) {
        for (let i = 0; i < this.lista.length; i++) {
          erros[this.lista[i].codigo] = this.lista[i].errormsg
        }
      }
      try {
        const data = await this.$axios.$get(
          'sigaex/api/v1/quadro?filtroExpedienteProcesso=' + tipo
        )
        this['carregando' + tipo] = false
        this['lista' + tipo] = data.list.filter(
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
        window['quadro' + tipo] = this['lista' + tipo]
      } catch (ex) {}
    },

    async carregarTarefas() {
      this.carregandoTarefas = true
      try {
        const data = await this.$axios.$get('sigawf/api/v1/ativos')
        this.carregandoTarefas = false
        this.listaTarefa = data.list
        this.primeiraCarga = false
        window.quadroTarefa = this.listaTarefa
      } catch (ex) {}
    },

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
  },
}
</script>
