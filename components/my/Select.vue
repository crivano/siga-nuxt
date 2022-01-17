<template>
  <div>
    <label for="orgao">{{ label }}</label>
    <div v-if="!edit">{{ nome }}</div>
    <select
      v-if="edit"
      :id="name"
      :disabled="disabled"
      class="form-control"
      :value="value"
      :name="name"
      :class="{ 'is-invalid': error }"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change')"
    >
      <option disabled selected hidden :value="undefined">[Selecionar]</option>
      <option v-for="l in list" :key="l[chave]" :value="l[chave]">
        {{ l[descr] }}
      </option>
    </select>
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'MySelect',
  props: {
    value: String,
    label: String,
    name: String,
    list: Array,
    edit: { type: Boolean, required: false, default: true },
    error: String,
    disabled: Boolean,
    chave: { type: String, required: false, default: 'id' },
    descr: { type: String, required: false, default: 'nome' },
  },
  data() {
    return {}
  },
  computed: {
    nome() {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i][this.chave | 'id'] === this.value)
          return this.list[i][this.descr | 'nome']
      }
      return ''
    },
  },
}
</script>
