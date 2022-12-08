<template>
  <div>
    <ModalProgress ref="progressModal" />
    <ModalProgressAsync ref="progressModalAsync" />
    <ModalMessageBox ref="messageBox" />
    <ModalMessageBoxConfirmacao ref="messageBoxConfirmacao" />
    <ModalTopProgress ref="topProgress" :height="5" color="#000" />

    <ModalAssinatura ref="modalAssinatura" title="Assinatura" />
    <ModalTramite ref="modalTramite" title="Trâmite" />
    <ModalAnotacao ref="modalAnotacao" title="Anotação" />
    <ModalMob ref="modalMob" />
    <ModalTexto ref="modalTexto" />
    <ModalMarcador ref="modalMarcador" />
    <ModalPerfil ref="modalPerfil" />
    <ModalAcesso ref="modalAcesso" />
    <ModalCossignatario ref="modalCossignatario" />
    <ModalAnexo ref="modalAnexo" />
    <ModalAnotacao ref="modalAnotacao" />
  </div>
</template>
<script>
import AcaoBL from '../bl/acao.js'
export default {
  data() {
    return {}
  },
  mounted() {
    const prg = this.$refs.progressModal

    this.$root.$on('prgStart', (title, total, callbackNext, callbackEnd) => {
      prg.start(title, total, callbackNext, callbackEnd)
    })

    this.$root.$on('prgCaption', (caption) => {
      prg.caption = caption
    })

    this.$root.$on('prgNext', (result) => {
      prg.next(result)
    })

    this.$root.$on('message', (title, message) => {
      this.$refs.messageBox.show(title, message)
    })

    this.$root.$on('confirmar', (title, message, callback) => {
      this.$refs.messageBoxConfirmacao.show(title, message, callback)
    })

    // this.$root.$on('iniciarAssinaturaComSenha', (documentos, cont) => {
    //   this.$refs.assinatura.show(documentos, cont)
    // })

    // this.$root.$on('iniciarTramite', (documentos, cont) => {
    //   this.$refs.tramite.show(documentos, cont)
    // })

    // this.$root.$on('iniciarAnotacao', (documentos, cont) => {
    //   this.$refs.anotacao.show(documentos, cont)
    // })

    // this.$root.$on('tramitar', (documentos, lotacao, matricula, cont) => {
    //   this.tramitarEmLote(documentos, lotacao, matricula, cont)
    // })

    // this.$root.$on('anotar', (documentos, anotacao, cont) => {
    //   this.anotarEmLote(documentos, anotacao, cont)
    // })

    const prgAsync = this.$refs.progressModalAsync

    this.$root.$on('prgAsyncStart', (title, key, callbackEnd) => {
      prgAsync.start(title, key, callbackEnd)
    })

    AcaoBL.registrar(this, this.$refs)
  },
}
</script>
