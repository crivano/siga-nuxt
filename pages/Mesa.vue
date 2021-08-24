<template>
  <div class="container-fluid content">
    <div class="row">
      <div class="col-md-12">
        <h4 class="text-center mt-3 mb-0">Mesa Virtual</h4>
      </div>
      <div v-if="errormsg" class="col col-sm-12">
        <p class="alert alert-danger"><strong>Erro!</strong> {{ errormsg }}</p>
      </div>
    </div>

    <div v-if="lista &amp;&amp; lista.length > 0" class="row d-print-none">
      <div class="col col-12 col-md-auto">
        <div class="input-group mt-3">
          <div class="input-group-prepend">
            <span id="basic-addon1" class="input-group-text"
              ><span class="fa fa-search"></span
            ></span>
          </div>
          <input
            v-model="filtro"
            type="text"
            class="form-control"
            placeholder="Filtrar"
            ng-model-options="{ debounce: 200 }"
          />
        </div>
      </div>
      <div class="col col-auto ml-auto">
        <nuxt-link to="/documento/novo" class="btn btn-primary mt-3"
          >Novo</nuxt-link
        >
        <button
          v-if="(filtradosEMarcadosEAnotaveis || []).length"
          type="button"
          class="btn btn-primary mt-3"
          title=""
          @click="anotarEmLote()"
        >
          <span class="fa fa-sticky-note-o d-none d-md-inline"></span>
          Anotar&nbsp;
          <span class="badge badge-pill badge-warning">{{
            filtradosEMarcadosEAnotaveis.length
          }}</span>
        </button>
        <button
          v-if="(filtradosEMarcadosEAssinaveis || []).length"
          type="button"
          class="btn btn-primary mt-3"
          title=""
          @click="assinarComSenhaEmLote()"
        >
          <span class="fa fa-shield d-none d-md-inline"></span> Assinar&nbsp;
          <span class="badge badge-pill badge-warning">{{
            filtradosEMarcadosEAssinaveis.length
          }}</span>
        </button>
        <button
          v-if="(filtradosEMarcadosETramitaveis || []).length"
          type="button"
          class="btn btn-primary mt-3"
          title=""
          @click="tramitarEmLote()"
        >
          <span class="fa fa-paper-plane-o d-none d-md-inline"></span>
          Tramitar&nbsp;
          <span class="badge badge-pill badge-warning">{{
            filtradosEMarcadosETramitaveis.length
          }}</span>
        </button>
      </div>
    </div>

    <div v-if="carregando &amp;&amp; primeiraCarga" class="row mt-3">
      <div class="col col-12">
        <p class="alert alert-warning">
          <strong>Aguarde,</strong> carregando documentos...
        </p>
      </div>
    </div>

    <div
      v-if="!carregando &amp;&amp; !primeiraCarga &amp;&amp; filtrados.length == 0"
      class="row mt-3"
    >
      <div class="col col-12">
        <p class="alert alert-warning">
          <strong>Atenção!</strong> Nenhum documento na mesa.
        </p>
      </div>
    </div>

    <div v-if="filtrados.length > 0" class="row">
      <div class="col-sm-12">
        <table class="table table-sm table-borderless">
          <tbody>
            <template v-for="f in filtrados">
              <tr
                v-if="f.grupoExibir"
                :key="f.sigla + ':grupo1'"
                class="table-group"
              >
                <th colspan="6" class="pt-3 pb-0 pl-0">
                  <h4 class="mb-1">{{ f.grupoNome }}</h4>
                </th>
              </tr>
              <tr
                v-if="f.grupoExibir"
                :key="f.sigla + ':grupo2'"
                class="table-head"
              >
                <th style="text-align: center">
                  <input
                    id="progress_checkall"
                    v-model="todos[f.grupo]"
                    type="checkbox"
                    name="progress_checkall"
                    @change="marcarTodos(f.grupo)"
                  />
                </th>
                <th class="d-none d-md-block">Tempo</th>
                <th>Código</th>
                <th class="d-none d-md-block">Descrição</th>
                <th>Origem</th>
                <th class="d-none d-md-block">Etiquetas</th>
                <th v-show="filtradosTemAlgumErro">Atenção</th>
              </tr>
              <tr :key="f.sigla + ':titulo'" :class="{ odd: f.odd }">
                <td style="text-align: center">
                  <input
                    v-model="f.checked"
                    type="checkbox"
                    :disabled="f.disabled"
                  />
                </td>
                <td class="d-none d-md-block" :title="f.datahora">
                  {{ f.tempoRelativo }}
                </td>
                <td>
                  <router-link
                    :to="{ name: 'Documento', params: { numero: f.codigo } }"
                    >{{ f.sigla }}</router-link
                  ><span class="d-inline d-md-none"> - {{ f.descr }}</span>
                </td>
                <td class="d-none d-md-block">{{ f.descr }}</td>
                <td>{{ f.origem }}</td>
                <td class="d-none d-md-block" style="padding: 0">
                  <div class="xrp-label-container">
                    <!-- class="list-unstyled blog-tags" -->
                    <span
                      v-for="m in f.list"
                      :key="f.sigla + ':tag:' + m.marcaId"
                      :title="m.titulo"
                      ><button class="btn btn-default btn-sm xrp-label">
                        <i :class="'fa fa-' + m.icone"></i> {{ m.nome
                        }}<span v-if="m.pessoa &amp;&amp; !m.daPessoa">
                          - {{ m.pessoa }}</span
                        ><span
                          v-if="m.unidade &amp;&amp; (!m.daLotacao || (!m.daPessoa && !m.deOutraPessoa))"
                        >
                          / {{ m.unidade }}</span
                        >
                      </button></span
                    >
                  </div>
                </td>
                <td v-show="filtradosTemAlgumErro" style="color: red">
                  {{ f.errormsg }}
                </td>
              </tr>
              <tr
                v-if="f.grupoEspacar"
                :key="f.sigla + ':grupo3'"
                class="table-group"
              >
                <th colspan="6" class="pb-2 pb-0 pl-0"></th>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <p
      v-if="acessos &amp;&amp; acessos.length >= 1"
      class="alert alert-success"
    >
      Último acesso em {{ acessos[1].datahora }} no endereço
      {{ acessos[1].ip }}.
    </p>
  </div>
</template>

<script>
import UtilsBL from '../bl/utils.js'

export default {
  components: {},

  async asyncData({ $axios }) {
    const fixItem = function (item) {
      UtilsBL.applyDefauts(item, {
        checked: false,
        disabled: false,
        grupo: undefined,
        grupoNome: undefined,
        grupoExibir: undefined,
        grupoEspacar: undefined,
        datahora: undefined,
        datahoraFormatada: undefined,
        sigla: undefined,
        codigo: undefined,
        descr: undefined,
        origem: undefined,
        situacao: undefined,
        errormsg: undefined,
        odd: undefined,
      })
      if (item.datahora !== undefined) {
        item.datahoraFormatada = UtilsBL.formatJSDDMMYYYYHHMM(item.datahora)
      }
      return item
    }

    // const erros = {}
    // if (lista && lista.length > 0) {
    //   for (let i = 0; i < lista.length; i++) {
    //     erros[lista[i].codigo] = lista[i].errormsg
    //   }
    // }
    const data = await $axios.$get('sigaex/api/v1/mesa')
    const lista = []
    const list = data.list
    for (let i = 0; i < list.length; i++) {
      // list[i].errormsg = erros[list[i].codigo]
      lista.push(fixItem(list[i]))
    }
    window.listaDaMesa = lista
    return { lista }
  },

  data() {
    return {
      mesa: undefined,
      filtro: undefined,
      lista: window.listaDaMesa ? window.listaDaMesa : [],
      primeiraCarga: !window.listaDaMesa,
      todos: {},
      carregando: false,
      acessos: [],
      errormsg: undefined,
    }
  },

  computed: {
    filtrados() {
      let a = this.lista
      let grupo
      let odd = false
      a = UtilsBL.filtrarPorSubstring(
        a,
        this.filtro,
        'grupoNome,tempoRelativo,sigla,codigo,descr,origem,situacao,errormsg,list.nome'.split(
          ','
        )
      )
      a = a.filter(function (item) {
        return item.grupo !== 'NENHUM'
      })
      for (let i = 0; i < a.length; i++) {
        a[i].grupoExibir = a[i].grupo !== grupo
        grupo = a[i].grupo
        if (a[i].grupoExibir) odd = false
        if (a[i].grupoExibir && i > 0) a[i - 1].grupoEspacar = true
        odd = !odd
        a[i].odd = odd
      }
      return a
    },

    filtradosTemAlgumErro() {
      if (!this.filtrados || this.filtrados.length === 0) return false
      for (let i = 0; i < this.filtrados.length; i++) {
        if (this.filtrados[i].errormsg) return true
      }
      return false
    },

    filtradosEAnotaveis() {
      return this.filtrados.filter((item) => item.podeAnotar)
    },

    filtradosEAssinaveis() {
      return this.filtrados.filter((item) => item.podeAssinarEmLote)
    },

    filtradosETramitaveis() {
      return this.filtrados.filter((item) => item.podeTramitar)
    },

    filtradosEMarcadosEAnotaveis() {
      return this.filtradosEAnotaveis.filter(function (item) {
        return item.checked
      })
    },

    filtradosEMarcadosEAssinaveis() {
      return this.filtradosEAssinaveis.filter(function (item) {
        return item.checked
      })
    },

    filtradosEMarcadosETramitaveis() {
      return this.filtradosETramitaveis.filter(function (item) {
        return item.checked
      })
    },
  },

  mounted() {
    this.errormsg = undefined
    console.log('mesa-mounted')

    setTimeout(() => {
      if (this.$route.params.exibirAcessoAnterior) this.carregarAcessos()
    })
  },

  methods: {
    async carregarAcessos() {
      this.acessos.length = 0
      const data = await this.$axios.$get('siga/api/v1/acessos')
      const list = data.list
      for (let i = 0; i < list.length; i++) {
        list[i].datahora = UtilsBL.formatJSDDMMYYYY_AS_HHMM(list[i].datahora)
        this.acessos.push(list[i])
      }
    },

    assinarComSenhaEmLote() {
      const a = this.filtradosEMarcadosEAssinaveis
      this.$root.$emit(
        'assinarComSenha',
        a,
        undefined,
        undefined,
        this.carregarMesa
      )
    },

    anotarEmLote() {
      const a = this.filtradosEMarcadosEAnotaveis
      this.$root.$emit('iniciarAnotacao', a)
    },

    tramitarEmLote() {
      const a = this.filtradosEMarcadosETramitaveis
      this.$root.$emit('iniciarTramite', a, this.carregarMesa)
    },

    marcarTodos(grupo) {
      const docs = this.filtrados
      for (let i = 0; i < docs.length; i++) {
        const doc = docs[i]
        if (doc.grupo === grupo) doc.checked = this.todos[grupo]
      }
    },

    mostrarDocumento(item, disposition) {
      const form = document.createElement('form')
      form.action =
        this.$parent.test.properties['siga-le.assijus.endpoint'] +
        '/api/v1/view' +
        (disposition === 'attachment' ? '?disposition=attachment' : '')
      form.method = 'POST'
      form.target = '_blank'
      form.style.display = 'none'

      const cpf = document.createElement('input')
      cpf.type = 'text'
      cpf.name = 'cpf'
      cpf.value = this.$parent.jwt.cpf

      const system = document.createElement('input')
      system.type = 'text'
      system.name = 'system'
      system.value = item.docsystem

      const docid = document.createElement('input')
      docid.type = 'text'
      docid.name = 'id'
      docid.value = item.docid

      const docsecret = document.createElement('input')
      docsecret.type = 'text'
      docsecret.name = 'secret'
      docsecret.value = item.docsecret

      const submit = document.createElement('input')
      submit.type = 'submit'
      submit.id = 'submitView'

      form.appendChild(cpf)
      form.appendChild(system)
      form.appendChild(docid)
      form.appendChild(docsecret)
      form.appendChild(submit)
      document.body.appendChild(form)

      /* global $ */
      $('#submitView').click()

      document.body.removeChild(form)
    },

    criarAssinavel(item) {
      return {
        id: item.docid,
        system: item.docsystem,
        code: item.codigo,
        descr: item.docdescr,
        kind: item.dockind,
        origin: 'Balcão Virtual',
      }
    },

    assinarDocumento(item) {
      this.chamarAssijus([this.criarAssinavel(item)])
    },

    assinarDocumentos() {
      const list = []
      for (let i = 0; i < this.filtradosEMarcadosEAssinaveis.length; i++) {
        list.push(this.criarAssinavel(this.filtradosEMarcadosEAssinaveis[i]))
      }
      if (list.length > 0) this.chamarAssijus(list)
    },

    editar() {
      this.$refs.etiqueta.show()
    },

    exibirProcessosMultiplos() {
      this.$refs.processosMultiplos.show()
    },

    acrescentarProcessosNaLista(arr) {
      if (!arr || arr.length === 0) return
      this.pasta = 'inbox'
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '') continue
        const p = this.fixProcesso({
          numero: arr[i],
          inbox: true,
        })
        this.processos.push(p)
      }
      this.validarEmLoteSilenciosamente()
    },
  },
}
</script>

<style scoped>
.destaque {
  color: red;
}

.td-middle {
  vertical-align: middle;
}

table .table-group th {
  border-top: 0;
}

table .table-head th {
  border-top: 0;
}

.odd {
  background-color: rgba(0, 0, 0, 0.05);
}

.xrp-label-container {
  margin-top: 4px;
  margin-bottom: 0;
}

.xrp-label {
  font-size: 13px;
  margin-bottom: 4px;
  margin-right: 8px;
  line-height: 1.1;
  padding-left: 7px;
  padding-right: 7px;
  border-radius: 0;
  border: 1px solid #ccc;
}
</style>
