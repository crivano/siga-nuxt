<template>
  <div class="input-group mt-3" v-bind="$attrs">
    <div class="input-group-prepend">
      <span id="basic-addon1" class="input-group-text">
        <font-awesome-icon :icon="['fa', 'search']" />
      </span>
    </div>
    <input
      type="text"
      class="form-control"
      placeholder="Filtrar"
      ng-model-options="{ debounce: 200 }"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    />
  </div>
</template>
<script>
export default {
  name: 'my-filtro',
  inheritAttrs: false,
  props: ['value'],
  data() {
    return {}
  },
}
</script>
