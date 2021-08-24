import AcaoBL from "../acao"

export default {
  registrar() {
    AcaoBL.bus.$on("excluirMovimentacao", (documentos, cont, params) => {
      this.lote(documentos, cont, params);
    });
  },

  lote(documentos, cont, params) {
    AcaoBL.lotePadrao("Excluindo Movimentação",
      "exclusao",
      "movimentacao",
      undefined, "sigaex/api/v1/documentos/{siglamob}/movimentacoes/" + params.idMov + "/excluir",
      documentos, cont
    );
  },
}
