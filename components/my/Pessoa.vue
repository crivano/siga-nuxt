<template>
  <validation-provider v-slot="{ errors }" rules="required" :immediate="true">
    <label class="control-label" for="matricula" style="width: 100%">{{
      label
    }}</label>
    <v-autocomplete
      :name="name"
      :value="definedValue"
      :items="pessoas"
      :get-label="getLabelPessoa"
      :component-item="template"
      input-class="form-control"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
      @update-items="updatePessoas"
    ></v-autocomplete>
    <span v-if="false" v-show="errors.length > 0" class="help is-danger">{{
      errors[0]
    }}</span>
  </validation-provider>
</template>

<script>
import ItemTemplate from '../ItemTemplate.vue'

export default {
  name: 'MyPessoa',
  props: ['value', 'name', 'label'],
  data() {
    return {
      pessoa: undefined,
      pessoas: [],
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
        const data = await this.$axios.$get(
          'siga/api/v1/pessoas?texto=' + encodeURI(text)
        )
        this.pessoas = []
        const l = data.list
        if (l) {
          for (let i = 0; i < l.length; i++) {
            this.pessoas.push(l[i].sigla + ' - ' + l[i].nome)
          }
        }
      } catch (ex) {}
    },
  },
}
</script>
