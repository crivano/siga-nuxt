<template>
  <div>
    <validation-observer v-slot="{ invalid }">
      <b-modal
        id="cota"
        ref="modal"
        v-model="showModal"
        title="Tramitar"
        hide-header-close
        cancel-title="Cancelar"
        ok-title="Prosseguir"
        :ok-disabled="invalid"
        @ok="save"
      >
        <form>
          <div class="row">
            <div class="form-group col col-sm-6">
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                :immediate="true"
              >
                <label class="control-label" for="tipo" style="width: 100%"
                  >Destino</label
                >
                <select id="tipo" v-model="tipo" class="form-control">
                  <option value="lotacao">Lotação</option>
                  <option value="matricula">Pessoa</option>
                </select>
                <span
                  v-if="false"
                  v-show="errors.length > 0"
                  class="help is-danger"
                  >{{ errors[0] }}</span
                >
              </validation-provider>
            </div>
            <div v-if="tipo === 'lotacao'" class="form-group col col-sm-6">
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                :immediate="true"
              >
                <label class="control-label" for="lotacao" style="width: 100%"
                  >Sigla da Lotação</label
                >
                <v-autocomplete
                  id="lotacao"
                  v-model="lotacao"
                  :items="lotacoes"
                  name="lotacao"
                  :get-label="getLabelLotacao"
                  :component-item="template"
                  input-class="form-control"
                  @update-items="updateLotacoes"
                ></v-autocomplete>
                <span
                  v-if="false"
                  v-show="errors.length > 0"
                  class="help is-danger"
                  >{{ errors[0] }}</span
                >
              </validation-provider>
            </div>
            <div v-if="tipo === 'matricula'" class="form-group col col-sm-6">
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                :immediate="true"
              >
                <label class="control-label" for="matricula" style="width: 100%"
                  >Matrícula</label
                >
                <v-autocomplete
                  id="matricula"
                  v-model="matricula"
                  :items="pessoas"
                  name="matricula"
                  :get-label="getLabelPessoa"
                  :component-item="template"
                  input-class="form-control"
                  @update-items="updatePessoas"
                ></v-autocomplete>
                <span
                  v-if="false"
                  v-show="errors.length > 0"
                  class="help is-danger"
                  >{{ errors[0] }}</span
                >
              </validation-provider>
            </div>
          </div>
          <em
            v-if="errormsg &amp;&amp; errormsg !== ''"
            for="processos"
            class="invalid"
            >{{ errormsg }}</em
          >
        </form>
      </b-modal>
    </validation-observer>
  </div>
</template>

<script>
import ItemTemplate from '../ItemTemplate.vue'

export default {
  name: 'Tramite',

  components: {
    //    'pdf-preview': PdfPreview
  },

  data() {
    return {
      showModal: false,
      errormsg: undefined,
      tipo: 'lotacao',
      lotacao: null,
      matricula: null,
      documentos: undefined,
      item: 'Monica',
      lotacoes: [],
      pessoas: [],
      template: ItemTemplate,
    }
  },

  mounted() {},

  methods: {
    getLabelLotacao(item) {
      return item
    },
    getLabelPessoa(item) {
      return item
    },
    async updatePessoas(text) {
      // yourGetItemsMethod(text).then((response) => {
      //   this.items = response
      // })
      if (!text || text === '') return
      this.errormsg = undefined
      try {
        const data = await this.$axios.$get(
          'siga/api/v1/pessoas?texto=' + encodeURI(text)
        )
        this.pessoas = []
        const l = data.list
        if (l) {
          for (let i = 0; i < l.length; i++) {
            this.pessoas.push(l[i].sigla + ' - ' + l[i].nome)
          }
        }
      } catch (ex) {}
    },
    async updateLotacoes(text) {
      // yourGetItemsMethod(text).then((response) => {
      //   this.items = response
      // })
      if (!text || text === '') return
      this.errormsg = undefined
      try {
        const data = await this.$axios.$get(
          'siga/api/v1/lotacoes?texto=' + encodeURI(text)
        )
        this.lotacoes = []
        const l = data.list
        if (l) {
          for (let i = 0; i < l.length; i++) {
            this.lotacoes.push(l[i].sigla + ' - ' + l[i].nome)
          }
        }
      } catch (ex) {}
    },

    show(documentos, cont) {
      this.showModal = true
      this.errormsg = undefined
      this.documentos = documentos
      this.matricula = null
      this.lotacao = null
      this.cont = cont
    },

    cancel(e) {
      e.cancel()
    },

    save() {
      if (this.tipo === 'lotacao') {
        this.matricula = undefined
        if ((this.lotacao || '') === '') {
          this.errormsg = 'Lotação deve ser informada.'
          return
        }
      }
      if (this.tipo === 'matricula') {
        this.lotacao = undefined
        if ((this.matricula || '') === '') {
          this.errormsg = 'Matrícula deve ser informada.'
          return
        }
      }

      let lotacao = this.lotacao
      if (lotacao) lotacao = lotacao.split(' - ')[0]
      let matricula = this.matricula
      if (matricula) matricula = matricula.split(' - ')[0]

      this.$root.$emit('tramitar', this.documentos, this.cont, {
        lotacao,
        matricula,
      })
      this.$refs.modal.hide(true)
    },

    validar() {
      this.$nextTick(() => this.$validator.validateAll())
    },
  },
}
</script>
