<template>
  <div>
    <validation-observer v-slot="{ invalid }">
      <b-modal
        id="cota"
        ref="modal"
        v-model="showModal"
        title="Definir Acesso"
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
                id="acesso"
                v-model="idAcesso"
                label="Acesso"
                name="acesso"
                validate="required"
                :disabled="false"
                :list="acessos"
                :edit="true"
                chave="idAcesso"
                descr="nome"
              ></my-select>
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
import UtilsBL from '../../bl/utils.js'

export default {
  name: 'DefinirAcesso',

  components: {},

  data() {
    return {
      showModal: false,
      errormsg: undefined,
      documentos: undefined,
      idAcesso: undefined,
      acessos: [],
    }
  },

  mounted() {},

  methods: {
    show(documentos, cont) {
      this.showModal = true
      this.errormsg = undefined
      this.documentos = documentos
      this.cont = cont
      this.carregar()
    },

    async carregar() {
      const data = await this.$axios.$get(
        'sigaex/api/v1/documentos/' +
          this.documentos[0].codigo +
          '/acessos-disponiveis'
      )
      const acessos = []
      for (let i = 0; i < data.list.length; i++) {
        acessos.push(
          UtilsBL.applyDefauts(data.list[i], {
            id: undefined,
            nome: undefined,
          })
        )
      }
    },

    cancel(e) {
      e.cancel()
    },

    save() {
      console.log('acesso')
      if (!this.idAcesso) {
        this.errormsg = 'Acesso deve ser informado.'
        return
      }

      this.$root.$emit('definirAcesso', this.documentos, this.cont, {
        idAcesso: this.idAcesso,
      })
      this.$refs.modal.hide(true)
    },

    validar() {
      this.$nextTick(() => this.$validator.validateAll())
    },
  },
}
</script>
