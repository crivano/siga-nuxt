<template>
  <DocListaPainel v-if="painel" :lista="lista" />
  <DocLista v-else :lista="lista" />
</template>
<script>
import UtilsBL from '../../bl/utils'
export default {
  props: {
    idMarcador: { type: String, required: false },
    filtroExpedienteProcesso: { type: String, required: false },
    filtroPessoaLotacao: { type: String, required: false },
    painel: { type: Boolean, required: false, default: false },
  },
  data() {
    return { lista: [] }
  },
  async fetch() {
    if (!this.idMarcador) return
    try {
      const data = await this.$axios.$get(this.url)
      const lista = data.list
      lista.forEach((i) => {
        i.siglaCompacta = UtilsBL.onlyLettersAndNumbers(i.sigla)
        i.documentoData = UtilsBL.formatDDMMYYYY(i.documentoData)
        i.marcaData = UtilsBL.formatDDMMYYYY(i.marcaData)
      })
      this.lista = lista
    } catch (ex) {}
  },
  computed: {
    url() {
      return (
        'sigaex/api/v1/lista?idMarcador=' +
        this.idMarcador +
        '&filtroExpedienteProcesso=' +
        this.filtroExpedienteProcesso +
        '&filtroPessoaLotacao=' +
        this.filtroPessoaLotacao
      )
    },
  },
  watch: {
    url(val) {
      console.log('url')
      console.log(val)
      this.$fetch()
    },
  },
}
</script>
