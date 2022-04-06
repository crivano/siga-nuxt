<template>
  <DocListaPainel v-if="painel" />
  <DocLista v-else :lista="lista" />
</template>
<script>
export default {
  props: {
    idMarcador: { type: String, required: false },
    filtroExpedienteProcesso: { type: String, required: false },
    filtroPessoaLotacao: { type: String, required: false },
    painel: { type: Boolean, required: false, default: false },
  },
  computed: {
    lista() {
      return this.$store.state.painel.lista
    },
  },
}
</script>
