<template>
  <div class="container-fluid content">
    <div class="row">
      <div class="col-md-12">
        <h4 v-if="sigla" class="text-center mt-3 mb-0">Editar {{ sigla }}</h4>
        <h4 v-else class="text-center mt-3 mb-0">
          {{
            siglaMobilPai
              ? 'Incluir em ' + siglaMobilPai
              : siglaMobilFilho
              ? 'Autuando ' + siglaMobilFilho
              : 'Criar Documento'
          }}
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
              @input="carregarModeloEProcessarEntrevista()"
            />
          </div>
          <div v-if="false" class="form-group col col-sm-12">
            <my-select
              id="modelo"
              v-model="idModelo"
              label="Modelo"
              name="modelo"
              validate="required"
              :disabled="false"
              :list="modelos"
              :edit="true"
              chave="idModelo"
              descr="nome"
              @change="carregarModeloEProcessarEntrevista()"
            ></my-select>
          </div>
        </div>
        <div class="row">
          <div class="form-group col col-sm-12 col-lg-6">
            <my-pessoa
              v-model="subscritor"
              label="Subscritor"
              name="subscritor"
            />
          </div>
          <div class="form-group col col-sm-4 col-lg-2">
            <validation-provider
              v-slot="{ errors }"
              rules="required"
              :immediate="true"
            >
              <label
                class="control-label"
                for="tipoDestinatario"
                style="width: 100%"
              >
                Destinatário
              </label>
              <select
                id="tipoDestinatario"
                v-model="tipoDestinatario"
                class="form-control"
              >
                <option value="LOTACAO">Lotação</option>
                <option value="PESSOA">Pessoa</option>
              </select>
              <span
                v-if="false"
                v-show="errors.length > 0"
                class="help is-danger"
                >{{ errors[0] }}</span
              >
            </validation-provider>
          </div>
          <div
            v-if="tipoDestinatario === 'LOTACAO'"
            class="form-group col col-sm-8 col-lg-4"
          >
            <my-lotacao
              v-model="lotaDestinatario"
              label="Lotação Destinatária"
            />
          </div>
          <div
            v-if="tipoDestinatario === 'PESSOA'"
            class="form-group col col-sm-8 col-lg-4"
          >
            <my-pessoa
              v-model="destinatario"
              label="Matrícula do Destinatário"
            />
          </div>
        </div>
        <div class="form-group">
          <my-classificacao
            v-model="classificacao"
            label="Classificação Documental"
            name="classificacao"
          />
        </div>
        <div class="form-group">
          <label>Descrição</label>
          <textarea
            id="descrDocumento"
            v-model="descricao"
            name="exDocumentoDTO.descrDocumento"
            cols="80"
            rows="2"
            class="form-control"
          ></textarea>
          <small class="form-text text-muted"
            >Preencher o campo acima com palavras-chave, sempre usando
            substantivos, gênero masculino e singular.</small
          >
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
      <b-button
        :disabled="invalid"
        class="mt-4"
        variant="primary"
        accesskey="O"
        @click.prevent="salvar()"
        ><u>O</u>K</b-button
      >
    </validation-observer>
  </div>
</template>

<script>
import DocumentoEntrevista from '../../../components/DocumentoEntrevista'
import UtilsBL from '../../../bl/utils.js'
import EntrevistaBL from '../../../bl/entrevista.js'

export default {
  components: { DocumentoEntrevista },
  data() {
    return {
      tipoDestinatario: 'LOTACAO',
      modelos: [],
      modelo: undefined,
      idModelo: undefined,
      entrevista: undefined,
      entrevistaTemplate: undefined,
      subscritor: undefined,
      destinatario: undefined,
      lotaDestinatario: undefined,
      classificacao: undefined,
      descricao: undefined,
      nivelacesso: 'Público',
      numero: undefined,
      sigla: undefined,
      siglaMobilPai: this.$route.params.siglaMobilPai,
      siglaMobilFilho: this.$route.params.siglaMobilFilho,
      podeCapturarPDF: false,
      arquivo: undefined,

      // define the default value
      value: null,
      // define options
      options: [
        {
          id: 'a',
          label: 'a',
          children: [
            {
              id: 'aa',
              label: 'aa',
            },
            {
              id: 'ab',
              label: 'ab',
            },
          ],
        },
        {
          id: 'b',
          label: 'b',
        },
        {
          id: 'c',
          label: 'c',
        },
      ],
    }
  },
  computed: {
    hierarquiaDeModelos() {
      if (!this.modelos) return
      return UtilsBL.buildHierarchy(this.modelos, 'idModelo', 'nome')
    },
    siglaSubscritor() {
      if (!this.subscritor) return undefined
      return this.subscritor.split(' - ')[0]
    },
    siglaDestinatario() {
      if (!this.destinatario || this.tipoDestinatario !== 'PESSOA')
        return undefined
      return this.destinatario.split(' - ')[0]
    },
    siglaLotaDestinatario() {
      if (!this.lotaDestinatario || this.tipoDestinatario !== 'LOTACAO')
        return undefined
      return this.lotaDestinatario.split(' - ')[0]
    },
    siglaClassificacao() {
      if (!this.classificacao) return undefined
      return this.classificacao.split(' - ')[0]
    },
    capturarPDF() {
      return (
        this.modelo &&
        this.modelo.tipoDeDocumento.includes('Capturado') &&
        (!this.numero || this.podeCapturarPDF)
      )
    },
  },
  watch: {
    '$route.params.numero'() {
      this.carregarDocumento(this.$route.params.numero)
    },
  },
  mounted() {
    const self = this

    this.$on('filtrar', (texto) => {
      this.filtrarMovimentos(texto)
    })

    this.$nextTick(async function () {
      await this.carregarModelos()
      await this.carregarDocumento(this.$route.params.numero)
    })

    window.sbmt = function () {
      self.processarEntrevista()
    }
  },
  methods: {
    async carregarDocumento() {
      this.errormsg = undefined
      this.numero = this.$route.params.numero
      if (!this.numero) return
      // Validar o número do processo
      this.$root.$emit('block', 20)
      try {
        const doc = await this.$axios.$get(
          'sigaex/api/v1/documentos/' + this.numero
        )
        this.podeCapturarPDF = doc.podeCapturarPDF
        this.sigla = doc.sigla
        this.idModelo = doc.idModelo
        this.descricao = doc.descrDocumento
        this.subscritor =
          (doc.subscritorSigla ? doc.subscritorSigla + ' - ' : '') +
          doc.subscritorNome
        if (doc.destinatarioTipo === 'PESSOA')
          this.destinatario =
            (doc.destinatarioSigla ? doc.destinatarioSigla + ' - ' : '') +
            doc.destinatarioNome
        else if (doc.destinatarioTipo === 'LOTACAO')
          this.lotaDestinatario =
            (doc.destinatarioSigla ? doc.destinatarioSigla + ' - ' : '') +
            doc.destinatarioNome

        this.classificacao =
          (doc.classificacaoSigla ? doc.classificacaoSigla + ' - ' : '') +
          doc.classificacaoNome
        await this.carregarModelo()

        if (doc.conteudoBlobFormString)
          this.processarEntrevista(doc.conteudoBlobFormString)
      } catch (ex) {}
    },

    async carregarModelos() {
      this.errormsg = undefined
      this.$root.$emit('block', 20)
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

      try {
        const data = await this.$axios.$get(url)
        this.modelos = data.list
      } catch (ex) {}
    },

    async carregarModelo() {
      this.errormsg = undefined
      this.$root.$emit('block', 20)
      try {
        this.modelo = await this.$axios.$get(
          'sigaex/api/v1/modelos/' + this.idModelo
        )
      } catch (ex) {}
    },

    async carregarModeloEProcessarEntrevista() {
      await this.carregarModelo()
      await this.processarEntrevista()
    },

    async processarEntrevista(params) {
      this.errormsg = undefined
      const formParams = EntrevistaBL.encodeFormParams(
        EntrevistaBL.getFormResults(this.$refs.form)
      )
      if (!params && (!formParams || formParams === '')) return
      // console.log(formParams);
      // console.log(s);
      const self = this
      try {
        const data = await this.$axios.$post(
          'sigaex/api/v1/modelos/' + this.idModelo + '/processar-entrevista',
          { entrevista: params || formParams }
        )
        self.entrevista = EntrevistaBL.fix(data)
        self.$refs.divEntrevista.innerHTML = self.entrevista
        self.entrevistaTemplate = self.$refs.divEntrevista.innerHTML
      } catch (ex) {}
    },

    async salvar() {
      this.errormsg = undefined
      const formParams = EntrevistaBL.encodeFormParams(
        EntrevistaBL.getFormResults(this.$refs.form)
      )
      // console.log(formParams);
      // console.log(s);

      const data = new FormData()
      if (this.modelo) data.append('modelo', this.idModelo)
      if (this.siglaSubscritor) data.append('subscritor', this.siglaSubscritor)
      data.append('eletronico', true)
      data.append('descricaotipodoc', 'Interno Produzido')
      if (this.classificacao) data.append('classificacao', this.classificacao)
      if (this.siglaDestinatario)
        data.append('pessoadestinatario', this.siglaDestinatario)
      if (this.siglaLotaDestinatario)
        data.append('lotadestinatario', this.siglaLotaDestinatario)
      if (this.descricao) data.append('descricaodocumento', this.descricao)
      if (this.nivelacesso) data.append('nivelacesso', this.nivelacesso)
      if (formParams) data.append('entrevista', formParams)
      if (this.sigla) data.append('sigla', this.sigla)
      if (this.siglaMobilPai) data.append('siglamobilpai', this.siglaMobilPai)
      if (this.siglaMobilFilho)
        data.append('siglamobilfilho', this.siglaMobilFilho)
      if (this.arquivo) data.append('arquivo', this.arquivo)

      try {
        const rdata = await this.$axios.$post('sigaex/api/v1/documentos', data)
        this.$router.replace({
          name: 'documento-numero',
          params: { numero: rdata.sigladoc },
        })
      } catch (ex) {}
    },
  },
}
</script>
