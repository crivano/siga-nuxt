<template>
  <div>
    <label v-if="label" :for="name">{{ label }}</label>
    <div v-if="!edit">{{ value }}</div>
    <input
      v-if="edit"
      :id="name"
      v-mask="mask != undefined ? mask : ''"
      type="text"
      class="form-control"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="value"
      :name="name"
      :class="{ 'is-invalid': error }"
      @input="$emit('input', Number($event.target.value))"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

<script>
import AwesomeMask from 'awesome-mask'

export default {
  name: 'MyNumeric',
  directives: {
    mask: AwesomeMask,
  },
  props: {
    value: { type: Number, required: false, default: 0 },
    label: String,
    name: String,
    placeholder: String,
    mask: String,
    edit: { type: Boolean, required: false, default: true },
    error: String,
    disabled: Boolean,
  },
  data() {
    return {}
  },
}
</script>
