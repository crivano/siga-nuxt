<template>
  <div class="container-fluid content profile">
    <div class="row xd-print-block mt-3 mb-3">
      <div class="col-12">
        <h4 class="text-center mb-0">Dossiê {{ sigla }}</h4>
      </div>
    </div>
    <div class="row justify-content-center mt-3 mb-3">
      <div class="col-12">
        <b-form-radio-group
          id="radio-group-2"
          v-model="tipo"
          class="text-center"
          name="radio-sub-component"
        >
          <b-form-radio value="html">HTML</b-form-radio>
          <b-form-radio value="pdf"
            >PDF -
            <a id="pdflink" accesskey="a" :href="urlAbrirPdf" target="_blank">
              <u>a</u>brir</a
            ></b-form-radio
          >
          <b-form-radio value="pdfSemMarcas"
            >PDF sem Marcas -
            <a
              id="pdflink"
              accesskey="r"
              :href="urlAbrirPdfSemMarcas"
              target="_blank"
            >
              abri<u>r</u></a
            ></b-form-radio
          >
        </b-form-radio-group>
      </div>
    </div>
    <div class="row">
      <div class="col col-12 col-md-4">
        <table class="table table-sm table-striped">
          <thead>
            <td>Documento</td>
            <td style="text-align: center">Origem</td>
            <td style="text-align: right">Pág.</td>
          </thead>
          <tbody>
            <tr
              v-for="i in lista"
              :key="i.paginaInicial"
              @click.prevent="show(i)"
            >
              <td :style="{ 'padding-left': i.nivel + '.4em' }">
                {{ i.descr }}
              </td>
              <td style="text-align: center">{{ i.origem }}</td>
              <td style="text-align: right">{{ i.paginaInicial }}</td>
            </tr>
          </tbody>
        </table>
        <router-link
          class="btn btn-secondary mb-4"
          :to="{ name: 'documento-numero', params: { numero: numero } }"
          >Voltar</router-link
        >
      </div>

      <div id="right-col" class="col col-12 col-md-8">
        <div
          id="paipainel"
          style="
            margin: 0;
            padding: 0;
            border: 0 solid black;
            clear: both;
            overflow: hidden;
          "
        >
          <div ref="html" v-html="html"></div>
          <MyIFrame v-if="src" :src="src" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UtilsBL from '../../../bl/utils.js'

export default {
  name: 'Dossie',

  data() {
    return {
      fixed: undefined,
      modified: undefined,
      numero: undefined,
      numeroAtivo: undefined,
      completo: undefined,
      sigla: undefined,
      lista: undefined,
      tipo: 'html',
      html: undefined,
      src: undefined,
    }
  },
  computed: {
    urlAbrirPdf() {
      return (
        this.$axios.defaults.baseURL +
        'sigaex/app/arquivo/exibir?idVisualizacao=&arquivo=' +
        this.numeroAtivo +
        '.pdf' +
        (this.completo ? '&completo=1' : '')
      )
    },
    urlAbrirPdfSemMarcas() {
      return (
        this.$axios.defaults.baseURL +
        'sigaex/app/arquivo/exibir?idVisualizacao=&arquivo=' +
        this.numeroAtivo +
        '.pdf&semmarcas=1' +
        (this.completo ? '&completo=1' : '')
      )
    },
  },
  watch: {
    '$route.params.numero'() {
      this.carregarDossie(this.$route.params.numero)
    },
    tipo() {
      this.mostrar()
    },
  },
  mounted() {
    this.$on('filtrar', (texto) => {
      this.filtrarMovimentos(texto)
    })
    this.$nextTick(function () {
      this.carregarDossie(this.$route.params.numero)
    })
  },
  methods: {
    carregarDossie() {
      this.errormsg = undefined
      this.numero = this.$route.params.numero
      this.numeroAtivo = this.numero
      this.html = undefined
      this.sigla = this.$route.params.sigla
        ? this.$route.params.sigla
        : this.numero
      // Validar o número do processo
      this.$root.$emit('block', 20)
      this.$axios
        .$get(
          'sigaex/api/v1/documentos/' +
            UtilsBL.onlyLettersAndNumbers(this.numero) +
            '/dossie'
        )
        .then(
          (data) => {
            this.$root.$emit('release')
            this.lista = data.list
            this.lista.push({
              descr: 'COMPLETO',
              mobil: this.numero,
              completo: true,
            })
            if (/\dV\d/gm.exec(this.numero) !== null)
              this.lista.push({
                descr: 'VOLUMES',
                mobil: this.numero,
                completo: true,
                volumes: true,
              })
            this.show(this.lista[this.lista.length - 1])
          },
          (error) => {
            this.$root.$emit('release')
            UtilsBL.errormsg(error, this)
          }
        )
    },

    mostrar() {
      if (this.completo) this.mostrarCompleto()
      else this.mostrarSimples()
    },

    async mostrarSimples() {
      const url =
        this.$axios.defaults.baseURL +
        'sigaex/api/v1/documentos/' +
        this.numeroAtivo +
        '/arquivo/produzir?estampa=' +
        (this.tipo !== 'pdfSemMarcas') +
        (this.completo ? '&completo=true' : '') +
        '&contenttype=' +
        (this.tipo === 'html' ? 'text/html' : 'application/pdf')

      if (this.tipo === 'html') {
        this.src = undefined
        const data = await this.$axios.$get(url)
        this.html = data
      } else {
        this.src = url
        this.html = undefined
      }
    },

    async mostrarCompleto() {
      const data = await this.$axios.$get(
        'sigaex/api/v1/documentos/' +
          this.numeroAtivo +
          '/arquivo?estampa=' +
          (this.tipo !== 'pdfSemMarcas') +
          (this.completo ? '&completo=true' : '') +
          (this.volumes ? '&volumes=true' : '') +
          '&contenttype=' +
          (this.tipo === 'html' ? 'text/html' : 'application/pdf')
      )
      this.$root.$emit('prgAsyncStart', 'PDF Completo', data.uuid, async () => {
        const jwt = data.jwt
        const url =
          this.$axios.defaults.baseURL +
          'sigaex/api/v1/download/' +
          jwt +
          '/' +
          this.numero +
          (this.tipo === 'html'
            ? '.html'
            : this.tipo === 'pdf'
            ? '.pdf'
            : '.pdf')

        if (this.tipo === 'html') {
          this.src = undefined
          const data = await this.$axios.$get(url)
          this.html = data
        } else {
          this.src = url
          this.html = undefined
        }
      })
    },

    show(i) {
      this.numeroAtivo = i.mobil
      this.completo = !!i.completo
      this.volumes = !!i.volumes
      this.mostrar()
    },
  },
}
</script>
