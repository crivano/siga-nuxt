<template>
  <div class="container-fluid content">
    <div class="row">
      <div class="col-md-12">
        <h4 v-if="sigla" class="text-center mt-3 mb-0">Editar {{ sigla }}</h4>
        <h4 v-else class="text-center mt-3 mb-0">
          {{ siglaMobilPai ? 'Incluir em ' + siglaMobilPai : siglaMobilFilho ? 'Autuando ' + siglaMobilFilho : 'Criar Documento' }}
        </h4>
      </div>
    </div>
    <validation-observer v-slot="{ invalid }">
      <form>
        <div class="row">
          <div class="form-group col col-sm-12">
            <label for="modelos">Modelo</label>
            <treeselect
              id="modelos"
              v-model="idModelo"
              :options="hierarquiaDeModelos"
              :disable-branch-nodes="true"
              :show-count="true"
              placeholder="Qual o modelo?"
              @input="carregarModeloEProcessarEntrevista"
            />
          </div>
          <div v-if="modelo && !modelo.nivelDeAcesso" class="form-group col col-md-4 col-lg-2">
            <my-select
              id="nivelacesso"
              v-model="nivelacesso"
              label="Nível de Acesso"
              name="nivelacesso"
              validate="required"
              :disabled="false"
              :list="niveisDeAcesso"
              :edit="true"
              chave="nmNivelAcesso"
              descr="nmNivelAcesso"
            ></my-select>
          </div>
        </div>
        <div class="row">
          <div class="form-group col col-sm-12 col-lg-6">
            <my-pessoa v-model="subscritor" label="Subscritor" name="subscritor" />
          </div>
          <div class="form-group col col-sm-4 col-lg-2">
            <validation-provider v-slot="{ errors }" rules="required" :immediate="true">
              <label class="control-label" for="tipoDestinatario" style="width: 100%"> Destinatário </label>
              <select id="tipoDestinatario" v-model="tipoDestinatario" class="form-control">
                <option value="LOTACAO">Lotação</option>
                <option value="PESSOA">Pessoa</option>
              </select>
              <span v-if="false" v-show="errors.length > 0" class="help is-danger">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div v-if="tipoDestinatario === 'LOTACAO'" class="form-group col col-sm-8 col-lg-4">
            <my-lotacao v-model="lotaDestinatario" label="Lotação Destinatária" />
          </div>
          <div v-if="tipoDestinatario === 'PESSOA'" class="form-group col col-sm-8 col-lg-4">
            <my-pessoa v-model="destinatario" label="Matrícula do Destinatário" />
          </div>
        </div>
        <div class="form-group">
          <my-classificacao v-model="classificacao" label="Classificação Documental" name="classificacao" />
        </div>
        <div class="form-group">
          <label>Descrição</label>
          <textarea id="descrDocumento" v-model="descricao" name="exDocumentoDTO.descrDocumento" cols="80" rows="2" class="form-control"></textarea>
          <small class="form-text text-muted">Preencher o campo acima com palavras-chave, sempre usando substantivos, gênero masculino e singular.</small>
        </div>
        <div v-if="capturarPDF" class="form-group">
          <label>Arquivo PDF (limite de 10MB)</label>
          <b-form-file
            v-model="arquivo"
            :state="Boolean(arquivo)"
            accept="application/pdf"
            placeholder="Selecione o arquivo ou solte ele aqui..."
            drop-placeholder="Solte aqui..."
          ></b-form-file>
        </div>
      </form>
      <form ref="form">
        <documento-entrevista :entrevista="entrevistaTemplate" />
      </form>
      <div ref="divEntrevista" style="display: none" />
      <b-button :disabled="invalid" class="mt-4" variant="primary" accesskey="O" @click.prevent="salvar()"><u>O</u>K</b-button>
    </validation-observer>
  </div>
</template>

<script>
import UtilsBL from '../bl/utils.js'
import EntrevistaBL from '../bl/entrevista.js'

export default {
  mounted() {
    const self = this

    this.$nextTick(async function () {
      await this.carregarModelos()
      await this.carregarDocumento(this.$route.params.numero)
    })

    window.sbmt = function () {
      self.processarEntrevista()
    }
  },
  data() {
    return {}
  },
  computed: {
    ...UtilsBL.twoWay('doc', [
      'tipoDestinatario',
      'modelos',
      'modelo',
      'idModelo',
      'entrevista',
      'entrevistaTemplate',
      'subscritor',
      'destinatario',
      'lotaDestinatario',
      'classificacao',
      'descricao',
      'nivelacesso',
      'numero',
      'sigla',
      'siglaMobilPai',
      'siglaMobilFilho',
      'podeCapturarPDF',
      'arquivo',
    ]),
    hierarquiaDeModelos() {
      return this.$store.getters['doc/hierarquiaDeModelos']
    },
    siglaSubscritor() {
      return this.$store.getters['doc/siglaSubscritor']
    },
    siglaDestinatario() {
      return this.$store.getters['doc/siglaDestinatario']
    },
    siglaLotaDestinatario() {
      return this.$store.getters['doc/siglaLotaDestinatario']
    },
    siglaClassificacao() {
      return this.$store.getters['doc/siglaClassificacao']
    },
    capturarPDF() {
      return this.$store.getters['doc/capturarPDF']
    },
    niveisDeAcesso() {
      return this.$store.state.tabelas.ExNivelAcesso
    },
  },
  watch: {
    '$route.params.numero'() {
      this.carregarDocumento()
    },
  },
  methods: {
    getFormParams() {
      return EntrevistaBL.encodeFormParams(EntrevistaBL.getFormResults(this.$refs.form))
    },
    async carregarModelos() {
      await this.$store.dispatch('doc/carregarModelos')
    },
    async carregarDocumento() {
      await this.$store.dispatch('doc/carregarDocumento', this.$route.params.numero)
      if (this.$store.state.doc.conteudoBlobFormString) await this.processarEntrevista(this.$store.state.doc.conteudoBlobFormString)
    },
    async carregarModeloEProcessarEntrevista() {
      if (this.$store.state.doc.idModelo && (!this.$store.state.doc.modelo || this.$store.state.doc.modelo.idModelo !== this.$store.state.doc.idModelo))
        await this.$store.dispatch('doc/carregarModelo')
      await this.processarEntrevista()
    },
    async processarEntrevista(params) {
      await this.$store.dispatch('doc/processarEntrevista', { params, formParams: this.getFormParams() })
      this.$refs.divEntrevista.innerHTML = this.$store.state.doc.entrevista
      this.$store.commit('doc/entrevistaTemplate', this.$refs.divEntrevista.innerHTML)
    },
    async salvar() {
      const rdata = await this.$store.dispatch('doc/salvar', this.getFormParams())
      if (rdata) this.$router.replace({ name: 'documento-numero', params: { numero: rdata.sigladoc } })
    },
  },
}
</script>
