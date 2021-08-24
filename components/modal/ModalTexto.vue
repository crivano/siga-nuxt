<template>
  <div>
    <validation-observer v-slot="{ invalid }">
      <b-modal
        id="cota"
        ref="modal"
        v-model="showModal"
        :title="titulo"
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
                <label class="control-label" for="mob" style="width: 100%">{{
                  campo
                }}</label>
                <input
                  id="texto"
                  v-model="texto"
                  type="text"
                  class="form-control"
                  placeholder=""
                  autocorrect="off"
                  autocapitalize="none"
                />
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
export default {
  name: 'Texto',

  data() {
    return {
      showModal: false,
      errormsg: undefined,
      texto: undefined,
      cont: undefined,
      titulo: undefined,
      campo: undefined,
      emit: undefined,
    }
  },

  mounted() {},

  methods: {
    show (documentos, cont, emit, titulo, campo) {
      this.showModal = true
      this.errormsg = undefined
      this.documentos = documentos
      this.texto = null
      this.cont = cont
      this.titulo = titulo
      this.campo = campo
      this.emit = emit
    },

    cancel (e) {
      e.cancel()
    },

    save () {
      if ((this.texto || '') === '') {
        this.errormsg = 'Texto deve ser informado.'
        return
      }

      if (this.emit)
        this.$root.$emit(this.emit, this.documentos, this.cont, {
          texto: this.texto,
        })
      this.$refs.modal.hide(true)
    },

    validar () {
      this.$nextTick(() => this.$validator.validateAll())
    },
  },
}
</script>
