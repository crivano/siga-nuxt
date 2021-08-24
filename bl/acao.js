import UtilsBL from "./utils.js";

import ArquivarCorrente from "./acao/arquivarCorrente";
import DesarquivarCorrente from "./acao/desarquivarCorrente";
import Sobrestar from "./acao/sobrestar";
import Dessobrestar from "./acao/dessobrestar";
import Juntar from "./acao/juntar";
import Vincular from "./acao/vincular";
import Apensar from "./acao/apensar";
import Desapensar from "./acao/desapensar";
import TornarSemEfeito from "./acao/tornarSemEfeito";
import IncluirCopia from "./acao/incluirCopia";
import CancelarMovimentacao from "./acao/cancelarMovimentacao";
import DefinirMarcador from "./acao/definirMarcador";
import AssinarComSenha from "./acao/assinarComSenha";
import AutenticarComSenha from "./acao/autenticarComSenha";
import CriarVia from "./acao/criarVia";
import Finalizar from "./acao/finalizar";
import Duplicar from "./acao/duplicar";
import DefinirPerfil from "./acao/definirPerfil";
import DefinirAcesso from "./acao/definirAcesso";
import Excluir from "./acao/excluir";
import IncluirCossignatario from "./acao/incluirCossignatario";
import Receber from "./acao/receber";
import Refazer from "./acao/refazer";
import Desentranhar from "./acao/desentranhar";
import Anexar from "./acao/anexar";
import AssinarComSenhaMovimentacao from "./acao/assinarComSenhaMovimentacao";
import AutenticarComSenhaMovimentacao from "./acao/autenticarComSenhaMovimentacao";
import ExcluirMovimentacao from "./acao/excluirMovimentacao";
import Tramitar from "./acao/tramitar";

export default {
  registrar(component, modais) {
    this.bus = component.$root;
    this.axios = component.$axios;
    this.modais = modais;
    Duplicar.registrar(component);
    ArquivarCorrente.registrar(component);
    DesarquivarCorrente.registrar(component);
    Sobrestar.registrar(component);
    Dessobrestar.registrar(component);
    Juntar.registrar(component);
    Vincular.registrar(component);
    Apensar.registrar(component);
    Desapensar.registrar(component);
    TornarSemEfeito.registrar(component);
    IncluirCopia.registrar(component);
    CancelarMovimentacao.registrar(component);
    DefinirMarcador.registrar(component);
    AssinarComSenha.registrar(component);
    AutenticarComSenha.registrar(component);
    CriarVia.registrar();
    Finalizar.registrar();
    DefinirPerfil.registrar();
    DefinirAcesso.registrar();
    Excluir.registrar();
    IncluirCossignatario.registrar();
    Receber.registrar();
    Refazer.registrar();
    Desentranhar.registrar();
    Tramitar.registrar();

    Anexar.registrar();
    AssinarComSenhaMovimentacao.registrar();
    AutenticarComSenhaMovimentacao.registrar();
    ExcluirMovimentacao.registrar();
  },

  lotePadrao(gerundio, evento1, evento2, evento3, url, documentos, cont, params) {
    this.bus.$emit(
      "prgStart",
      gerundio,
      documentos.length,
      (i) => this.acaoPadrao(gerundio,
        evento1,
        evento2,
        evento3,
        url.replace("{siglamob}", documentos[i].codigo).replace("{sigladoc}", documentos[i].sigla.replace(/[^a-zA-Z0-9]/gi, "")),
        documentos[i], documentos.length !== 1, params),
      cont
    );
  },

  async acaoPadrao(gerundio, evento1, evento2, evento3, url, d, lote, params) {
    this.errormsg = undefined;
    this.bus.$emit("prgCaption", " " + d.sigla);

    if (!params)
      params = {};

    try {
      const data = await this.axios
        .$post(
          url, params,
        )
      d.errormsg = undefined;
      UtilsBL.logEvento(
        evento1,
        evento2,
        evento3
      );
      this.bus.$emit("prgNext", {
        data
      });
    } catch (error) {
      if (lote) d.errormsg = error.data.errormsg;
      else this.bus.$emit("message", "Erro", error.data.errormsg);
      this.bus.$emit("prgNext");
    }
  },

}
