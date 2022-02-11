<template>
  <div>
    <div class="container-fluid content profile">
      <div v-if="!errormsg &amp;&amp; doc">
        <div class="row xd-print-block mt-3 mb-3">
          <div class="col-md-12">
            <h4 class="text-center mb-0">Auditando {{ doc.forma }} {{ doc.mobs[0].sigla }}</h4>
          </div>
        </div>
        <div class="row no-gutters mt-2"></div>
        <template v-if="doc">
          <div class="row">
            <div class="col col-12 col-lg-8">
              <div v-for="mobil in filteredMobs" :key="mobil.id">
                <h6 v-html="mobil.descricaoCompleta"></h6>
                <table v-if="mobil.movs && mobil.movs.length" class="table table-sm table-striped mb-4">
                  <thead class="table-dark">
                    <tr>
                      <th>Data/Hora</th>
                      <th>Lotação</th>
                      <th>Evento</th>
                      <th>Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="mov in mobil.movs" :key="mov.idMov" :class="[mov.classe, mov.disabled]">
                      <td>{{ mov.dtRegMovDDMMYYHHMMSS }}</td>
                      <td>{{ mov.lotaCadastranteSigla }}</td>
                      <td>{{ mov.exTipoMovimentacaoSigla }}</td>
                      <td style="padding: 5px 5px; word-break: break-all">
                        {{ mov.descricao }}
                        <span v-if="mov.idTpMov != 2">{{ mov.complemento }}</span>
                        <span v-if="mov.descricao &amp;&amp; mov.acoes &amp;&amp; mov.acoes.length !== 0">|</span>
                        <span v-for="acao in mov.acoes" :key="acao.nome"
                          >{{ acao.pre }} <a v-if="acao.acao" href="" @click.prevent="executar(mov, acao)">{{ acao.nome }}</a
                          ><span v-if="!acao.acao">{{ acao.nome }}</span> {{ acao.pos }}</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="col col-12 col-lg-4">
              <CardMarcas :doc="doc" />
              <CardPendencias :doc="doc" />
              <CardDetalhes :doc="doc" />
              <CardNivelDeAcesso :doc="doc" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios, $store }) {
    const computeGraph = async function (dot) {
      if (!dot) return
      try {
        const data = await $axios.$post('siga/public/app/graphviz/svg', 'digraph G { graph[tooltip="Tramitação"] ' + dot + '}', {
          headers: { 'Content-Type': 'text/vnd.graphviz' },
          withCredentials: false,
        })
        if (!data) return
        let result = data.replace(/width="\d+pt" height="\d+pt"/gm, 'style="left:0; top:0; width:100%; height:12em; display:block; margin: auto;"')
        result = result.replace(/<polygon fill="white".+?\/>/gm, '')
        return result
      } catch (ex) {}
    }

    let numero = params.numero
    try {
      const doc = await $axios.$get('sigaex/api/v1/documentos/' + numero + '?auditar=true')
      const mob = doc.mobs[0]
      if (!mob.isGeral) numero = mob.sigla.replace(/[^a-zA-Z0-9]/gi, '')
      let relacao
      // if ($store.state.test.properties['vizservice.url']) {
      // if (doc) {
      const tramitacao = await computeGraph(doc.vizTramitacao)
      if (doc.vizRelacaoDocs && doc.vizRelacaoDocs.length > 200) relacao = await computeGraph(doc.vizRelacaoDocs)
      // }

      return { numero, doc, mob, tramitacao, relacao }
    } catch (ex) {}
  },

  data() {
    return {
      fixed: undefined,
      modified: undefined,
      numero: undefined,
      orgao: undefined,
      perfil: undefined,
      gui: {},
      filtro: undefined,
      errormsg: undefined,
      warningmsg: undefined,
      partes: false,
      dadosComplementares: false,
      doc: undefined,
      mob: undefined,
      marcadores: [],
      marcasativas: true,
      notas: false,
    }
  },
  computed: {
    filteredMobs() {
      if (!this.doc || !this.doc.mobs) return undefined
      const lista = this.doc.mobs
      return lista.sort((a, b) => (a.isGeral && !b.isGeral ? -1 : b.sigla > a.sigla ? 1 : 0))
    },
    filteredMovs() {
      if (!this.mob || !this.mob.movs || this.mob.movs.length === 0) return undefined
      return this.mob.movs.filter((m) => m.idTpMov !== 14 && !m.cancelada)
    },
    filteredAcoes() {
      if (!this.mob) return undefined
      let acoes = this.doc.mobs.length > 1 ? this.mob.acoes.concat(this.doc.mobs[1].acoes) : this.mob.acoes
      acoes = acoes.sort((a, b) => (a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0))
      return acoes.filter((m) => m.pode)
    },
    pdfSource() {
      if (!this.doc || this.doc.conteudoBlobHtmlString) return undefined
      return this.$axios.defaults.baseURL + 'sigaex/api/v1/documentos/' + this.numero + '/arquivo/produzir?contenttype=application/pdf'
    },
  },
  mounted() {
    this.$on('filtrar', (texto) => {
      this.filtrarMovimentos(texto)
    })
    // this.$nextTick(function () {
    //   this.carregarDocumento(this.$route.params.numero)
    // })
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
