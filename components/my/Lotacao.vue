<template>
  <validation-provider v-slot="{ errors }" :rules="{ validationRules }" :immediate="true">
    <label class="control-label" for="lotacao" style="width: 100%">{{
      label
    }}</label>
    <v-autocomplete
      :name="name"
      :value="definedValue"
      :items="lotacoes"
      :get-label="getLabelLotacao"
      :component-item="template"
      input-class="form-control"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
      @update-items="updateLotacoes"
    ></v-autocomplete>
    <span v-if="false" v-show="errors.length > 0" class="help is-danger">{{
      errors[0]
    }}</span>
  </validation-provider>
</template>

<script>
import ItemTemplate from '../ItemTemplate.vue'

export default {
  name: 'MyLotacao',
  props: {value: String, label: String, name: String, validationRules: {type: String, default: 'required'}},
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
    getLabelLotacao(item) {
      return item
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
  },
}
</script>
