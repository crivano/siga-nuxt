<template>
  <validation-provider v-slot="{ errors }" rules="required" :immediate="true">
    <label class="control-label" for="matricula" style="width: 100%">{{
      label
    }}</label>
    <v-autocomplete
      :name="name"
      :value="definedValue"
      :items="classificacoes"
      :get-label="getLabelClassificacao"
      :component-item="template"
      input-class="form-control"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
      @update-items="updateClassificacoes"
    ></v-autocomplete>
    <span v-if="false" v-show="errors.length > 0" class="help is-danger">{{
      errors[0]
    }}</span>
  </validation-provider>
</template>

<script>
import ItemTemplate from '../ItemTemplate.vue'

export default {
  name: 'MyClassificacao',
  props: ['value', 'name', 'label'],
  data() {
    return {
      classificacao: undefined,
      classificacoes: [],
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
    getLabelClassificacao(item) {
      return item
    },
    async updateClassificacoes(text) {
      // yourGetItemsMethod(text).then((response) => {
      //   this.items = response
      // })
      if (!text || text === '') return
      this.errormsg = undefined
      try {
        const data = await this.$axios.$get(
          'sigaex/api/v1/classificacoes?texto=' + encodeURI(text)
        )
        this.classificacoes = []
        const l = data.list
        if (l) {
          for (let i = 0; i < l.length; i++) {
            this.classificacoes.push(l[i].sigla + ' - ' + l[i].nome)
          }
        }
      } catch (ex) {}
    },
  },
}
</script>
