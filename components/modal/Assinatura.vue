<template>
  <div>
    <b-modal
      id="cota"
      ref="modal"
      v-model="showModal"
      title="Assinatura com Senha"
      hide-header-close
    >
      <validation-observer v-slot="{ invalid }">
        <form>
          <div class="row">
            <div class="form-group col col-sm-6">
              <my-input
                id="username"
                v-model="username"
                label="Usuário"
                name="username"
                validate="required"
                disabled="true"
              ></my-input>
            </div>
            <div class="form-group col col-sm-6">
              <my-input
                id="password"
                v-model="password"
                type="password"
                label="Senha"
                name="password"
                validate="required"
              ></my-input>
            </div>
          </div>
          <small id="usernameHelp" class="form-text text-muted">
            <strong>Atenção</strong>! Ao clicar em prosseguir, será realizada a
            assinatura com senha. Por favor, tenha certeza que deseja realmente
            assinar antes de clicar em 'Prosseguir'.</small
          >
          <em
            v-if="errormsg &amp;&amp; errormsg !== ''"
            for="processos"
            class="invalid"
            >{{ errormsg }}</em
          >
        </form>
        <div slot="modal-footer" style="width: 100%">
          <b-btn
            class="float-right ml-2"
            variant="primary"
            :disabled="invalid"
            @click="save"
          >
            Prosseguir
          </b-btn>
          <b-btn
            class="float-right"
            variant="secondary"
            @click="$refs.modal.hide(false)"
          >
            Cancelar
          </b-btn>
        </div>
      </validation-observer>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'Assinatura',

  components: {
    //    'pdf-preview': PdfPreview
  },

  data() {
    return {
      showModal: false,
      errormsg: undefined,
      username: '',
      password: undefined,
      documentos: undefined,
    }
  },

  mounted() {},

  methods: {
    show (documentos, cont) {
      this.showModal = true
      this.errormsg = undefined
      this.documentos = documentos
      this.cont = cont
    },

    cancel (e) {
      e.cancel()
    },

    save () {
      if ((this.username || '') === '') {
        this.errormsg = 'Matrícula deve ser informado.'
        return
      }

      if ((this.password || '') === '') {
        this.errormsg = 'Senha deve ser informada.'
        return
      }

      this.$root.$emit(
        'assinarComSenha',
        this.documentos,
        this.username,
        this.password,
        this.cont
      )
      this.$refs.modal.hide(true)
    },

    validar () {
      this.$nextTick(() => this.$validator.validateAll())
    },
  },
}
</script>
