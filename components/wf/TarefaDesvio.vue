<template>
  <button
    name="indiceDoDesvio"
    :value="idx"
    @click.prevent="$emit('click')"
    class="btn btn-info mr-3"
  >
    {{ nome
    }}<span v-if="dd.proximoResponsavel">
      &raquo; {{ dd.proximoResponsavel }}</span
    >
  </button>
</template>

<script>
export default {
  props: {
    definicaoDeDesvio: { type: Object, required: true },
    idx: { type: Number, required: true },
  },
  data() {
    return {
      dd: this.definicaoDeDesvio,
    }
  },
  computed: {
    nome() {
      return this.dd && this.dd.definicaoDeDesvioNome
        ? this.dd.definicaoDeDesvioNome
        : 'Prosseguir'
    },
  },
}
</script>
