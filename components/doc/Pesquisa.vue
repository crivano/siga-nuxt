<template>
  <DocListaPainel :lista="lista" v-if="painel" />
  <DocLista :lista="lista" v-else />
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
  watch: {
    url(val) {
      console.log('url')
      console.log(val)
      this.$fetch()
    },
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
}
</script>
