<template>
  <div class="container-fluid content">
    <div class="row">
      <div class="col-md-12">
        <h4 class="text-center mt-3 mb-0">Lista de Documentos</h4>
        <DocLista :lista="lista" />
      </div>
    </div>
  </div>
</template>

<script>
import UtilsBL from '../../../../../bl/utils.js'

export default {
  components: {},

  async asyncData({ params, $axios }) {
    try {
      const data = await $axios.$get(
        'sigaex/api/v1/lista?idMarcador=' +
          params.idMarcador +
          '&filtroExpedienteProcesso=' +
          params.filtroExpedienteProcesso +
          '&filtroPessoaLotacao=' +
          params.filtroPessoaLotacao
      )
      const lista = data.list
      lista.forEach((i) => {
        i.siglaCompacta = UtilsBL.onlyLettersAndNumbers(i.sigla)
        i.documentoData = UtilsBL.formatDDMMYYYY(i.documentoData)
        i.marcaData = UtilsBL.formatDDMMYYYY(i.marcaData)
      })
      return { lista }
    } catch (ex) {}
  },

  data() {
    return {
      primeiraCarga: false,
      carregando: false,
      carregandoProcesso: false,
      errormsg: undefined,
    }
  },

  computed: {},

  mounted() {
    this.errormsg = undefined
  },
}
</script>
