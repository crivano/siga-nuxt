<template>
  <div>
    <validation-observer v-slot="{ invalid }">
      <b-modal
        id="cota"
        ref="modal"
        v-model="showModal"
        title="Definir Perfil"
        hide-header-close
        cancel-title="Cancelar"
        ok-title="Prosseguir"
        :ok-disabled="invalid"
        @ok="save"
      >
        <form>
          <div class="row">
            <div class="form-group col col-12">
              <my-select
                id="perfil"
                v-model="idPerfil"
                label="Perfil"
                name="perfil"
                validate="required"
                :disabled="false"
                :list="perfis"
                :edit="true"
                chave="idPerfil"
                descr="nome"
              ></my-select>
            </div>

            <div class="form-group col col-sm-6">
              <validation-provider v-slot="{ errors }" rules="required" :immediate="true">
                <label class="control-label" for="tipo" style="width: 100%">Responsável</label>
                <select id="tipo" v-model="tipo" class="form-control">
                  <option value="lotacao">Lotação</option>
                  <option value="matricula">Pessoa</option>
                </select>
                <span v-if="false" v-show="errors.length > 0" class="help is-danger">{{ errors[0] }}</span>
              </validation-provider>
            </div>
            <div v-if="tipo === 'lotacao'" class="form-group col col-sm-6">
              <validation-provider v-slot="{ errors }" rules="required" :immediate="true">
                <my-lotacao v-model="lotacao" label="Sigla da Lotação" />
                <span v-if="false" v-show="errors.length > 0" class="help is-danger">{{ errors[0] }}</span>
              </validation-provider>
            </div>
            <div v-if="tipo === 'matricula'" class="form-group col col-sm-6">
              <validation-provider v-slot="{ errors }" rules="required" :immediate="true">
                <my-pessoa v-model="matricula" label="Sigla da Pessoa" />
                <span v-if="false" v-show="errors.length > 0" class="help is-danger">{{ errors[0] }}</span>
              </validation-provider>
            </div>
          </div>
          <em v-if="errormsg &amp;&amp; errormsg !== ''" for="processos" class="invalid">{{ errormsg }}</em>
        </form>
      </b-modal>
    </validation-observer>
  </div>
</template>

<script>
import ItemTemplate from '../ItemTemplate.vue'

export default {
  name: 'DefinirPerfil',

  components: {},

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
      idPerfil: undefined,
      perfis: [],
      template: ItemTemplate,
    }
  },

  mounted() {},

  methods: {
    async carregar() {
      this.carregando = true

      try {
        const data = await this.$axios.$get('sigaex/api/v1/documentos/' + this.documentos[0].codigo + '/perfis-disponiveis')
        this.carregando = false
        this.perfis.length = 0
        const resp = data
        for (let i = 0; i < resp.list.length; i++) {
          this.perfis.push({ idPerfil: resp.list[i].idPerfil, nome: resp.list[i].nome })
        }
        this.primeiraCarga = false
      } catch (ex) {}
    },

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
        const data = await this.$axios.$get('siga/api/v1/pessoas?texto=' + encodeURI(text))
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
        const data = await this.$axios.$get('siga/api/v1/lotacoes?texto=' + encodeURI(text))
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
      this.carregar()
    },

    cancel(e) {
      e.cancel()
    },

    save() {
      if (!this.idPerfil) {
        this.errormsg = 'Perfil deve ser informado.'
        return
      }
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

      this.$root.$emit('definirPerfil', this.documentos, this.cont, {
        idPerfil: this.idPerfil,
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
