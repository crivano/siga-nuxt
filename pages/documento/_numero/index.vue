<template>
  <div>
    <div class="container-fluid content profile">
      <div v-if="!errormsg &amp;&amp; doc">
        <div class="row xd-print-block mt-3 mb-3">
          <div class="col-md-12">
            <h4 class="text-center mb-0">
              {{ doc.forma }} {{ doc.mobs[0].sigla }}
            </h4>
          </div>
          <div class="col-md-12">
            <h6
              class="text-center mb-0 mt-2"
              v-html="doc.mobs[0].marcadoresEmHtml"
            ></h6>
          </div>
        </div>
        <div class="row no-gutters mt-2"></div>
        <template v-if="doc">
          <div class="row">
            <div class="col col-12 col-lg-8">
              <div
                v-if="errormsg === undefined &amp;&amp; doc.conteudoBlobHtmlString"
                class="d-print-none"
              >
                <div class="card-deck">
                  <div class="card card-consulta-processual mb-3">
                    <div class="card-body">
                      <p class="card-text">
                        <span v-html="doc.conteudoBlobHtmlString"></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <MyIFrame v-if="!doc.conteudoBlobHtmlString" :src="pdfSource" />
              <table
                v-if="filteredMovs && filteredMovs.length"
                class="table table-sm table-striped"
              >
                <thead class="table-dark">
                  <tr>
                    <th>Tempo</th>
                    <th>Lotação</th>
                    <th>Evento</th>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="mov in filteredMovs"
                    :key="mov.idMov"
                    :class="[mov.classe, mov.disabled]"
                  >
                    <td>{{ mov.tempoRelativo }}</td>
                    <td>{{ mov.lotaCadastranteSigla }}</td>
                    <td>{{ mov.exTipoMovimentacaoSigla }}</td>
                    <td style="padding: 5px 5px; word-break: break-all">
                      {{ mov.descricao }}
                      <span v-if="mov.idTpMov != 2">{{ mov.complemento }}</span>
                      <span
                        v-if="mov.descricao &amp;&amp; mov.acoes &amp;&amp; mov.acoes.length !== 0"
                        >|</span
                      >
                      <span v-for="acao in mov.acoes" :key="acao.nome"
                        >{{ acao.pre }}
                        <a
                          v-if="acao.acao"
                          href=""
                          @click.prevent="executar(mov, acao)"
                          >{{ acao.nome }}</a
                        ><span v-if="!acao.acao">{{ acao.nome }}</span>
                        {{ acao.pos }}</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col col-12 col-lg-4">
              <h4>Ações</h4>
              <acao
                :acao="acao"
                v-for="acao in filteredAcoes"
                :key="acao.nome"
              />

              <CardMarcas :doc="doc" />
              <CardPendencias :doc="doc" />

              <CardGraphViz :dot="doc.vizTramitacao" titulo="Tramitação" />
              <CardGraphViz
                :dot="doc.vizRelacao"
                titulo="Tramitação"
                v-if="doc.vizRelacaoDocs && doc.vizRelacaoDocs.length > 200"
              />

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
import Acao from '../../../components/Acao'

export default {
  name: 'Documento',

  components: {
    acao: Acao,
  },

  async asyncData({ params, $axios, $store }) {
    let numero = params.numero
    try {
      const doc = await $axios.$get('sigaex/api/v1/documentos/' + numero)
      const mob = doc.mobs[0]
      if (!mob.isGeral) numero = mob.sigla.replace(/[^a-zA-Z0-9]/gi, '')
      return { numero, doc, mob }
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
    filteredMovs() {
      if (!this.mob || !this.mob.movs || this.mob.movs.length === 0)
        return undefined
      return this.mob.movs.filter((m) => m.idTpMov !== 14 && !m.cancelada)
    },
    filteredAcoes() {
      if (!this.mob) return undefined
      let acoes =
        this.doc.mobs.length > 1
          ? this.mob.acoes.concat(this.doc.mobs[1].acoes)
          : this.mob.acoes
      acoes = acoes.sort((a, b) =>
        a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0
      )
      return acoes.filter((m) => m.pode)
    },
    pdfSource() {
      if (!this.doc || this.doc.conteudoBlobHtmlString) return undefined
      return (
        this.$axios.defaults.baseURL +
        'sigaex/api/v1/documentos/' +
        this.numero +
        '/arquivo/produzir?contenttype=application/pdf'
      )
    },
  },
  // watch: {
  //   '$route.params.numero'() {
  //     this.carregarDocumento(this.$route.params.numero)
  //   },
  // },
  mounted() {
    this.$on('filtrar', (texto) => {
      this.filtrarMovimentos(texto)
    })
    // this.$nextTick(function () {
    //   this.carregarDocumento(this.$route.params.numero)
    // })
  },
  methods: {
    executar(mov, acao) {
      if (
        mov.descrTipoMovimentacao === 'Anexação' &&
        (acao.nome === 'Assinar/Autenticar' || acao.nome === 'Excluir')
      ) {
        this.$router.push({
          name: 'Anexo',
          params: { numero: this.numero, id: mov.idMov },
        })
      } else if (
        mov.descrTipoMovimentacao.includes('Inclusão de Cossignatário') &&
        acao.nome === 'Excluir'
      ) {
        this.$root.$emit(
          'excluirMovimentacao',
          [{ codigo: this.numero, sigla: this.doc.sigla }],
          this.$nuxt.refresh()
        )
        this.emitir()
      } else if (acao.acao === 'exibir') {
        this.$router.push({
          name: 'Documento',
          params: { numero: acao.params.sigla.replace(/[^a-z0-9]/gi, '') },
        })
      }
    },

    reler() {
      this.$nuxt.refresh()
    },

    // async mostrarCompleto() {
    //   const data = await this.$axios.$get(
    //     'sigaex/api/v1/documentos/' +
    //       this.numero +
    //       '/arquivo?estampa=true&completo=true'
    //   )
    //   this.$root.$emit('prgAsyncStart', 'PDF Completo', data.uuid, () => {
    //     const jwt = data.jwt
    //     window.open(
    //       this.$axios.defaults.baseURL +
    //         'sigaex/api/v1//download/' +
    //         jwt +
    //         '/' +
    //         this.numero +
    //         '.pdf'
    //     )
    //   })
    //   UtilsBL.logEvento(
    //     'consulta-processual',
    //     'mostrar pdf completo',
    //     'individual'
    //   )
    // },

    filtrarMovimentos(texto) {
      this.$parent.$emit('setting', 'filtrarMovimentos', texto !== undefined)
      const f = this.filtro
      if (texto) {
        if (
          texto.length > 0 &&
          texto.substring(0, 1) === '#' &&
          f &&
          f.length > 0 &&
          f.substring(0, 1) === '#'
        ) {
          this.filtro = f + ' ' + texto
          return
        }
      }
      this.filtro = texto
      this.$nextTick(() => this.$refs.filtro.focus())
    },
    mostrarPartes(ativo) {
      this.$parent.$emit('setting', 'mostrarPartes', ativo)
    },
    imprimir() {
      window.print()
    },
    formatDDMMYYYHHMM(s) {
      if (s === undefined) {
        return
      }
      let r =
        s.substring(6, 8) +
        '/' +
        s.substring(4, 6) +
        '/' +
        s.substring(0, 4) +
        ' ' +
        s.substring(8, 10) +
        ':' +
        s.substring(10, 12)
      r = r.replace(' ', '&nbsp;')
      return r
    },

    exibirProcessoPecaDetalhes(movdoc, marca) {
      this.currentMovDoc = movdoc
      this.currentMarca = marca
      this.$refs.processoPecaDetalhes.show(
        marca,
        this.marcadores,
        movdoc.doc && movdoc.doc.outroParametro
          ? movdoc.doc.outroParametro.paginaInicial
          : undefined,
        movdoc.doc && movdoc.doc.outroParametro
          ? movdoc.doc.outroParametro.paginaFinal
          : undefined
      )
    },

    cotar() {
      this.$refs.Assinatura.show()
    },

    cotaEnviada(msg) {
      this.$root.$emit('message', 'Sucesso', 'Cota enviada com sucesso. ' + msg)
    },

    cotaNaoEnviada(msg, texto) {
      this.$root.$emit(
        'message',
        'Erro',
        'Não foi possível enviar a cota "' +
          texto +
          '". Ocorreu o erro: "' +
          msg +
          '"'
      )
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