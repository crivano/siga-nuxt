<template>
  <div>
    <div class="container-fluid content profile">
      <div class="row no-gutters mt-3"></div>
      <template v-if="procedimento">
        <div class="row">
          <div class="col col-12 col-lg-8">
             <h4>Procedimento {{ procedimento.sigla }}</h4>
            <WfTarefa :procedimento="procedimento" v-if="procedimento.formulario" />

            <table v-if="filteredMovs && filteredMovs.length" class="table table-sm table-striped">
              <thead class="table-dark">
                <tr>
                  <th>Tempo</th>
                  <th>Lotação</th>
                  <th>Evento</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mov in filteredMovs" :key="mov.eventoId" :class="[mov.classe, mov.disabled]">
                  <td>{{ mov.eventoTempoRelativo }}</td>
                  <td>
                    {{ mov.lotaResponsavel ? mov.lotaResponsavel.sigla : undefined }}
                  </td>
                  <td>{{ mov.eventoTitulo }}</td>
                  <td style="padding: 5px 5px; word-break: break-all">
                    {{ mov.eventoDescr }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col col-12 col-lg-4">
            <h4>Ações</h4>
            <ul class="blog-tags p-0">
              <acao v-for="acao in filteredAcoes" :key="acao.nome" :acao="acao" />
            </ul>
            <CardGraphViz :dot="procedimento.vizProcedimento" titulo="Diagrama" />
            <WfCardVariaveis :procedimento="procedimento" titulo="Variáveis" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Acao from '../../../../components/Acao'

export default {
  name: 'Procedimento',

  components: {
    acao: Acao,
  },

  async asyncData({ params, $axios, $store }) {
    try {
      const data = await $axios.$get(`sigawf/api/v1/procedimentos/${params.numero}`)
      const procedimento = data.procedimento
      return { procedimento }
    } catch (ex) {}
  },

  data() {
    return {}
  },
  computed: {
    filteredMovs() {
      if (!this.procedimento || !this.procedimento.eventos || this.procedimento.eventos.length === 0) return undefined
      return this.procedimento.eventos.filter((m) => !m.cancelada)
    },
    filteredAcoes() {
      if (!this.procedimento) return undefined
      let acoes = this.procedimento.acoes
      acoes = acoes.sort((a, b) => (a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0))
      return acoes.filter((m) => m.pode)
    },
  },
  methods: {
    reler() {
      this.$nuxt.refresh()
    },
  },
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.marca-ref:hover,
.marca-ref:link,
.marca-ref:visited,
.marca-ref:active {
  color: black;
}

.inquebravel {
  white-space: nowrap;
}

.marca {
  padding-left: 0;
  padding-right: 0;
  margin-right: 0.5rem;
  margin-bottom: 0;
  margin-top: 0;
}

.marca-yellow {
  background-color: yellow;
}

.marca-blue {
  background-color: #41f1f4;
}

.marca-green {
  background-color: #0f0;
}

.marca-pink {
  background-color: #faf;
}

.red {
  color: red;
}

.protocolado {
  color: green;
}

.odd {
  background-color: rgba(0, 0, 0, 0.05);
}

.card-body p {
  margin-bottom: 0.2em;
}

.card-body div {
  margin-top: 1em;
}

.card-body div h6 {
  margin-bottom: 0.2em;
}

.card-consulta-processual div p b {
  color: #fff;
}

.card-consulta-processual div p {
  margin-bottom: 0.5rem;
}

.card-consulta-processual div i {
  line-height: 3rem;
  height: 3rem;
  color: #fff;
  float: right;
  font-size: 4rem;
  margin: 0 -0.5rem;
}

.card-text-descr {
  margin-bottom: 0;
}

textarea {
  border: none;
  background: none;
  width: 100%;
  resize: none;
  overflow: hidden;
  min-height: 50px;
}

table.mov tr.despachox {
  background-color: rgb(240, 255, 240);
}

table.mov tr.juntadax,
tr.desentranhamentox {
  background-color: rgb(229, 240, 255);
}

table.mov tr.anotacaox {
  background-color: rgb(255, 255, 255);
}

table.mov tr.anexacaox {
  background-color: rgb(255, 255, 215);
}

table.mov tr.encerramento_volumex {
  background-color: rgb(255, 218, 218);
}

</style>
