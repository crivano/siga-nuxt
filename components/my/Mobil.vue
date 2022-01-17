<template>
  <validation-provider v-slot="{ errors }" :rules="rules" :immediate="true">
    <label class="control-label" for="lotacao" style="width: 100%">{{
      label
    }}</label>
    <v-autocomplete
      id="mob"
      :value="definedValue"
      :items="mobs"
      name="mob"
      :get-label="getLabel"
      :component-item="template"
      input-class="form-control"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
      @update-items="update"
    ></v-autocomplete>
    <span v-if="false" v-show="errors.length > 0" class="help is-danger">{{
      errors[0]
    }}</span>
  </validation-provider>
</template>

<script>
import ItemTemplate from '../ItemTemplate.vue'

export default {
  name: 'MyMobil',
  props: ['value', 'label', 'name', 'rules'],
  data() {
    return {
      lotacoes: [],
      template: ItemTemplate,
    }
  },
  computed: {
    definedValue() {
      if (this.value) return this.value
      return ''
    },
  },
  methods: {
    getLabel(item) {
      return item
    },
    async update(text) {
      if (!text || text === '') return
      this.errormsg = undefined
      try {
        const data = await this.$axios.$get(
          'sigaex/api/v1/documentos/' + encodeURI(text)
        )
        this.mobs = []
        const d = data
        if (d.sigla) {
          let sigla = d.sigla
          if (d.mobs && d.mobs.length > 0 && d.mobs[0].sigla)
            sigla = d.mobs[0].sigla
          this.mobs.push(sigla + ' - ' + d.descrDocumento)
        }
      } catch (ex) {}
    },
  },
}
</script>
