import AcaoBL from "../acao"

export default {
  registrar() {
    AcaoBL.bus.$on("tramitarModal", (documentos, cont) => {
      this.modal(documentos, cont);
    });

    AcaoBL.bus.$on("tramitar", (documentos, cont, params) => {
      this.lote(documentos, cont, params);
    });
  },

  modal(documentos, cont) {
    AcaoBL.modais.modalTramite.show(documentos, cont, "tramitar", "Definir Marcador");
  },

  lote(documentos, cont, params) {
    console.log('teste')
    AcaoBL.lotePadrao("Trâmite",
      "tramite",
      "tramite",
      undefined, "sigaex/api/v1/documentos/{siglamob}/tramitar",
      documentos, cont, params
    );
  },
}
