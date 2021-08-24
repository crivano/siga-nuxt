<template>
  <div>
    <validation-observer v-slot="{ invalid }">
      <b-modal
        id="cota"
        ref="modal"
        v-model="showModal"
        title="Anotar"
        hide-header-close
        cancel-title="Cancelar"
        ok-title="Prosseguir"
        :ok-disabled="invalid"
        @ok="save"
      >
        <form>
          <div class="row">
            <div class="form-group col col-sm-12">
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                :immediate="true"
              >
                <label class="control-label" for="anotacao" style="width: 100%"
                  >Texto da Anotação</label
                >
                <textarea
                  id="anotacao"
                  v-model="anotacao"
                  name="anotacao"
                  maxlength="255"
                  class="form-control"
                  aria-describedby="anotacaoHelp"
                  :class="{ 'is-invalid': errors.length > 0 }"
                  style="width: 100%"
                  :rows="3"
                  autofocus
                ></textarea>
                <span
                  v-if="false"
                  v-show="errors.length > 0"
                  class="help is-danger"
                  >{{ errors[0] }}</span
                >
              </validation-provider>
            </div>
          </div>
        </form>
      </b-modal>
    </validation-observer>
  </div>
</template>

<script>
export default {
  name: 'Anotacao',

  components: {},

  data() {
    return {
      showModal: false,
      errormsg: undefined,
      documentos: undefined,
      anotacao: undefined,
    }
  },

  mounted() {},

  methods: {
    show (documentos, cont) {
      this.showModal = true
      this.errormsg = undefined
      this.documentos = documentos
      this.anotacao = undefined
      this.cont = cont
    },

    cancel (e) {
      e.cancel()
    },

    save () {
      if ((this.anotacao || '') === '') {
        this.errormsg = 'Texto da anotação deve ser informado.'
        return
      }
      this.$root.$emit('anotar', this.documentos, this.anotacao, this.cont)
      this.$refs.modal.hide(true)
    },

    validar () {
      this.$nextTick(() => this.$validator.validateAll())
    },
  },
}
</script>
