<template>
  <div class="hello">
    <div class="container-fluid content profile">
      <div v-if="errormsg" class="row pt-5">
        <div class="col col-sm-12">
          <p class="alert alert-danger">
            <strong>Erro!</strong> {{ errormsg }}
          </p>
        </div>
      </div>
      <div v-if="warningmsg" class="row pt-5">
        <div class="col col-sm-12">
          <p class="alert alert-warning">
            <strong>Atenção!</strong> {{ warningmsg }}
          </p>
        </div>
      </div>
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
        <div class="row no-gutters mt-2">
          <!--
                    <div class="col col-auto mr-1" v-if="!$parent.settings.filtrarMovimentos">
                      <button type="button" @click="filtrarMovimentos('')" class="btn btn-secondary d-print-none">
                        <span class="fa fa-filter"></span>
                        Filtrar Movimentos
                      </button>
                    </div>
                    <div class="col col-auto mr-1 mb-3" v-if="filtro !== '#marca'">
                      <button type="button" @click="filtrarMovimentos('#marca')" class="btn btn-secondary d-print-none">
                        <span class="fa fa-filter"></span>
                        Filtrar Marcas
                      </button>
                    </div>
                    -->
        </div>
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
              <my-iframe
                v-if="!doc.conteudoBlobHtmlString"
                :src="pdfSource"
              ></my-iframe>
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
              <span v-for="acao in filteredAcoes" :key="acao.nome">
                <acao :acao="acao" />
              </span>

              <!-- PENDENCIAS -->
              <div v-if="mob.pendencias" class="card text-white bg-danger mb-3">
                <div class="card-header">Pendências</div>
                <div class="card-body">
                  <div v-if="mob.pendenciasDeAnexacao">
                    <p>
                      <b style="color: rgb(195, 0, 0)">Anexos Pendentes:</b>
                    </p>
                    <ul>
                      <li
                        v-for="anexoPendente in mob.pendenciasDeAnexacao"
                        :key="anexoPendente.idMov"
                      >
                        {{ anexoPendente.descricao }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="mob.anexosNaoAssinados">
                    <p>
                      <b style="color: rgb(195, 0, 0)">Anexos não assinados:</b>
                    </p>
                    <ul>
                      <li
                        v-for="naoAssinado in mob.anexosNaoAssinados"
                        :key="naoAssinado.idMov"
                      >
                        {{ naoAssinado.descricao }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="mob.despachosNaoAssinados">
                    <p>
                      <b style="color: rgb(195, 0, 0)"
                        >Despachos não assinados:</b
                      >
                    </p>
                    <ul>
                      <li
                        v-for="naoAssinado in mob.despachosNaoAssinados"
                        :key="naoAssinado.idMov"
                      >
                        {{ naoAssinado.descricao }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="mob.expedientesJuntadosNaoAssinados">
                    <p>
                      <b style="color: rgb(195, 0, 0)"
                        >Expedientes juntados não assinados:</b
                      >
                    </p>
                    <ul></ul>
                  </div>
                  <div v-if="mob.expedientesFilhosNaoJuntados">
                    <p>
                      <b style="color: rgb(195, 0, 0)"
                        >Expedientes não juntados:</b
                      >
                    </p>
                    <ul>
                      <li
                        v-for="naoJuntado in mob.expedientesFilhosNaoJuntados"
                        :key="naoJuntado.idMov"
                      >
                        {{ naoJuntado.sigla }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="mob.pendenciasDeColaboracao">
                    <p>
                      <b style="color: rgb(195, 0, 0)"
                        >Pendências de Colaboração:</b
                      >
                    </p>
                    <ul>
                      <li
                        v-for="colaboracaoPendente in mob.pendenciasDeColaboracao"
                        :key="colaboracaoPendente.idMov"
                      >
                        {{ colaboracaoPendente.descricao }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- RELACAO -->
              <div v-show="relacao" class="card bg-light mb-3">
                <div class="card-header">Documentos Relacionados</div>
                <div class="card-body" v-html="relacao"></div>
              </div>

              <!-- TRAMITACAO -->
              <div v-show="tramitacao" class="card bg-light mb-3">
                <div class="card-header">Tramitação</div>
                <div class="card-body" v-html="tramitacao"></div>
              </div>

              <!-- DETALHES -->
              <div class="card bg-light">
                <div class="card-header">
                  Documento {{ doc.exTipoDocumentoDescricao }}
                </div>
                <div class="card-body" style="font-size: 70%">
                  <p><b>Suporte:</b> {{ doc.fisicoOuEletronico }}</p>
                  <p>
                    <b>Data:</b> {{ doc.dtDocDDMMYY }}
                    <span v-if="doc.originalData"
                      ><b>original:</b> {{ doc.originalData }}</span
                    >
                  </p>
                  <p v-if="doc.originalNumero">
                    <b>Número original:</b> {{ doc.originalNumero }}
                  </p>
                  <p><b>De:</b> {{ doc.subscritorString }}</p>
                  <p><b>Para:</b> {{ doc.destinatarioString }}</p>
                  <p>
                    <b>Cadastrante:</b> {{ doc.cadastranteString }}
                    {{ doc.lotaCadastranteString }}
                  </p>
                  <p><b>Espécie:</b> {{ doc.forma }}</p>
                  <p><b>Modelo:</b> {{ doc.modelo }}</p>
                  <p id="descricao">
                    <b>Descrição:</b> {{ doc.descrDocumento }}
                  </p>
                  <p>
                    <b>Classificação:</b>
                    {{ doc.classificacaoDescricaoCompleta }}
                  </p>
                  <div v-if="doc.dadosComplementares">
                    {{ doc.dadosComplementares }}
                  </div>
                  <div v-if="false &amp;&amp; doc.cossignatarios">
                    <h6>Cossignatários</h6>
                    <ul>
                      <li
                        v-for="cossig in doc.cossignatarios"
                        :key="cossig.idMov"
                      >
                        {{ cossig.key.subscritor.nomePessoa }}
                      </li>
                    </ul>
                  </div>
                  <!--
                              <c:if test="{{not empty doc.doc.perfis}}">
                                <div class="gt-sidebar-content" style="padding-top: 10px">
                                  <h3>Perfis</h3>
                                  <c:forEach var="perfil" items="{{doc.doc.perfis}}">
                                    <p style="margin-bottom: 3px;">
                                      <b>{{perfil.key.descPapel}}:</b>
                                    </p>
                                    <ul>
                                      <c:forEach var="pessoaOuLota" items="{{perfil.value}}">
                                        <li><c:catch var="exception">{{pessoaOuLota.nomePessoa}}</c:catch>
                                          <c:if test="{{not empty exception}}">{{pessoaOuLota.nomeLotacao}}</c:if>
                                        </li>
                                      </c:forEach>
                                    </ul>
                                  </c:forEach>
                                </div>
                              </c:if>
                              -->
                  <div>
                    <h6>Nível de Acesso</h6>
                    <div>
                      <b>{{ doc.nmNivelAcesso }}</b>
                      <div v-if="doc.listaDeAcessos">
                        <div v-if="doc.listaDeAcessos.length == 1">
                          {{
                            doc.listaDeAcessos[0] == 'PUBLICO'
                              ? '(Público)'
                              : acesso.sigla
                          }}
                        </div>
                        <div v-if="doc.listaDeAcessos.length > 1">
                          <ul>
                            <li
                              v-for="acesso in doc.listaDeAcessos"
                              :key="acesso"
                            >
                              {{ acesso.sigla }}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import UtilsBL from '../../../bl/utils.js'
import Acao from '../../../components/Acao'

export default {
  name: 'Documento',

  components: {
    acao: Acao,
  },

  async asyncData({ params, $axios, $store }) {
    const computeGraph = async function (dot) {
      if (!dot) return
      const data = await $axios.$post(
        'siga/public/app/graphviz/svg',
        'digraph G { graph[tooltip="Tramitação"] ' + dot + '}',
        {
          headers: { 'Content-Type': 'text/vnd.graphviz' },
          withCredentials: false,
        }
      )
      if (!data) return
      let result = data.replace(
        /width="\d+pt" height="\d+pt"/gm,
        'style="left:0; top:0; width:100%; height:12em; display:block; margin: auto;"'
      )
      result = result.replace(/<polygon fill="white".+?\/>/gm, '')
      return result
    }

    let numero = params.numero
    const doc = await $axios.$get('sigaex/api/v1/documentos/' + numero)
    const mob = doc.mobs[0]
    if (!mob.isGeral) numero = mob.sigla.replace(/[^a-zA-Z0-9]/gi, '')
    let relacao
    // if ($store.state.test.properties['vizservice.url']) {
    // if (doc) {
    const tramitacao = await computeGraph(doc.vizTramitacao)
    if (doc.vizRelacaoDocs && doc.vizRelacaoDocs.length > 200)
      relacao = await computeGraph(doc.vizRelacaoDocs)
    // }

    return { numero, doc, mob, tramitacao, relacao }
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

    async mostrarCompleto() {
      const data = await this.$axios.$get(
        'sigaex/api/v1/documentos/' +
          this.numero +
          '/arquivo?estampa=true&completo=true'
      )
      this.$root.$emit('prgAsyncStart', 'PDF Completo', data.uuid, () => {
        const jwt = data.jwt
        window.open(
          this.$axios.defaults.baseURL +
            'sigaex/api/v1//download/' +
            jwt +
            '/' +
            this.numero +
            '.pdf'
        )
      })
      UtilsBL.logEvento(
        'consulta-processual',
        'mostrar pdf completo',
        'individual'
      )
    },
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
