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
                <v-autocomplete
                  id="mob"
                  v-model="mob"
                  :items="mobs"
                  name="mob"
                  :get-label="getLabelMob"
                  :component-item="template"
                  input-class="form-control"
                  @update-items="updateMobs"
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
import ItemTemplate from '../ItemTemplate'

export default {
  name: 'Juntar',

  data() {
    return {
      showModal: false,
      errormsg: undefined,
      documento: null,
      mob: undefined,
      mobs: [],
      cont: undefined,
      titulo: undefined,
      campo: undefined,
      emit: undefined,
      template: ItemTemplate,
    }
  },

  mounted() {},

  methods: {
    getLabelMob(item) {
      return item
    },
    async updateMobs(text) {
      if (!text || text === '') return
      this.errormsg = undefined
      const data = await this.$axios.$get(
        'sigaex/api/v1/documentos/' + encodeURI(text)
      )
      this.mobs = []
      // var l = response.data.list;
      // if (l) {
      //   for (var i = 0; i < l.length; i++) {
      //     this.mobs.push(l[i].sigla + " - " + l[i].nome);
      //   }
      // }
      const d = data
      if (d.sigla) {
        let sigla = d.sigla
        if (d.mobs && d.mobs.length > 0 && d.mobs[0].sigla)
          sigla = d.mobs[0].sigla
        this.mobs.push(sigla + ' - ' + d.descrDocumento)
      }
    },

    show(documentos, cont, emit, titulo, campo) {
      this.showModal = true
      this.errormsg = undefined
      this.documentos = documentos
      this.mob = null
      this.cont = cont
      this.titulo = titulo
      this.campo = campo
      this.emit = emit
    },

    cancel(e) {
      e.cancel()
    },

    save() {
      if ((this.mob || '') === '') {
        this.errormsg = 'Documento deve ser informado.'
        return
      }

      let mob = this.mob
      if (mob) mob = mob.split(' - ')[0]

      if (this.emit)
        this.$root.$emit(this.emit, this.documentos, this.cont, { mob })
      this.$refs.modal.hide(true)
    },

    validar() {
      this.$nextTick(() => this.$validator.validateAll())
    },
  },
}
</script>
