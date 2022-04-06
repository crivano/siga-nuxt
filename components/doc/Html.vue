<template>
  <div class="card">
    <div class="card-body my-html alert-warning text-dark" v-html="htmlAlterado"></div>
  </div>
</template>
<script>
export default {
  props: ['html'],
  data() {
    return {}
  },
  computed: {
    htmlAlterado() {
      if (!this.html) return undefined
      let sHtml = this.html
      sHtml = sHtml.replace('<!-- INICIO PRIMEIRO CABECALHO', '<!-- INICIO PRIMEIRO CABECALHO -->')
      sHtml = sHtml.replace('FIM PRIMEIRO CABECALHO -->', '<!-- FIM PRIMEIRO CABECALHO -->')
      sHtml = sHtml.replace('<!-- INICIO PRIMEIRO RODAPE', '<!-- INICIO PRIMEIRO RODAPE -->')
      sHtml = sHtml.replace('<!-- div style="font-size:11pt;" class="footnotes"', '<div style="font-size:11pt;" class="footnotes">')
      sHtml = sHtml.replace('FIM PRIMEIRO RODAPE -->', '<!-- FIM PRIMEIRO RODAPE-->')
      sHtml = sHtml.replace('src="contextpath/', `src="${process.env.API_URL_BROWSER}siga/`)
      sHtml = sHtml.replace('   <p align="justify"> <br /> \n    <!-- INICIO PRIMEIRO CABECALHO --> </p>', '')
      sHtml = sHtml.replace(/bgcolor="#(FFFFFF|000000)"/g, '')
      
      // console.log(sHtml)
      return sHtml
    },
  },
}
</script>
<style>
div.my-html p {
  margin-bottom: 0;
}
</style>