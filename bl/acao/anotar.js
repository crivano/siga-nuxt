import AcaoBL from "../acao"

export default {
  registrar() {
    AcaoBL.bus.$on("anotarModal", (documentos, cont) => {
      this.modal(documentos, cont);
    });

    AcaoBL.bus.$on("anotar", (documentos, cont, params) => {
      this.lote(documentos, cont, params);
    });
  },

  modal(documentos, cont) {
    AcaoBL.modais.modalAnotacao.show(documentos, cont, "anotar", "Anotar");
  },

  lote(documentos, cont, params) {
    AcaoBL.lotePadrao("Anotacao",
      "anotacao",
      "anotacao",
      undefined, "sigaex/api/v1/documentos/{sigladoc}/anotar",
      documentos, cont, params
    );
  },
}
