<template>
  <div>
    <validation-observer v-slot="{ invalid }">
      <b-modal
        id="cota"
        ref="modal"
        v-model="showModal"
        title="Incluir Cossignatario"
        hide-header-close
        cancel-title="Cancelar"
        ok-title="Prosseguir"
        :ok-disabled="invalid"
        @ok="save"
      >
        <form>
          <div class="row">
            <div class="form-group col col-12">
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                :immediate="true"
              >
                <my-pessoa v-model="matricula" label="Sigla da Pessoa" />
                <span
                  v-if="false"
                  v-show="errors.length > 0"
                  class="help is-danger"
                  >{{ errors[0] }}</span
                >
              </validation-provider>
            </div>

            <div class="form-group col col-12">
              <b-form-checkbox
                id="personalizar"
                v-model="personalizar"
                name="personalizar"
              >
                Personalizar campos da assinatura
              </b-form-checkbox>
            </div>
            <div v-if="personalizar" class="form-group col col-12">
              <my-input
                id="funcao"
                v-model="funcao"
                label="Função"
                name="funcao"
                :edit="true"
              ></my-input>
            </div>
            <div v-if="personalizar" class="form-group col col-12">
              <my-input
                id="lotacao"
                v-model="lotacao"
                label="Lotação"
                name="lotacao"
                :edit="true"
              ></my-input>
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
  name: 'DefinirPerfil',

  components: {},

  data() {
    return {
      showModal: false,
      errormsg: undefined,
      matricula: null,
      personalizar: false,
      funcao: undefined,
      lotacao: undefined,
      localidade: undefined,
      documentos: undefined,
      template: ItemTemplate,
    }
  },

  mounted() {},

  methods: {
    show (documentos, cont) {
      this.showModal = true
      this.errormsg = undefined
      this.documentos = documentos
      this.matricula = null
      this.funcao = undefined
      this.lotacao = undefined
      this.localidade = undefined
      this.cont = cont
      this.carregar()
    },

    cancel (e) {
      e.cancel()
    },

    save () {
      if ((this.matricula || '') === '') {
        this.errormsg = 'Matrícula deve ser informada.'
        return
      }

      let matricula = this.matricula
      if (matricula) matricula = matricula.split(' - ')[0]

      this.$root.$emit('incluirCossignatario', this.documentos, this.cont, {
        matricula,
        funcao: this.funcao,
        lotacao: this.lotacao,
        lotcalidade: this.localidade,
      })
      this.$refs.modal.hide(true)
    },

    validar () {
      this.$nextTick(() => this.$validator.validateAll())
    },
  },
}
</script>
