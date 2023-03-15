<template>
  <div class="wrapper">
    <!--=== Header ===-->
    <div class="header d-print-none">
      <!-- Navbar -->
      <b-navbar toggleable="lg" :class="{
        'navbar-dark bg-success': $store.state.test.properties['siga.ambiente'] === 'desenv',
        'navbar-dark bg-secondary': $store.state.test.properties['siga.ambiente'] === 'homolo',
        'navbar-dark bg-primary': $store.state.test.properties['siga.ambiente'] === 'prod',
      }">
        <b-navbar-brand :to="{ name: 'painel' }">
          <img id="logo-header" src="~assets/logo-siga-novo-38px.png" alt="Siga-Le" height="38" />
          <img id="logo-header2" class="ml-2" src="~assets/trf2-38px-2.png" alt="Logo TRF2" height="38" />
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item v-if="logged">
              <nuxt-link active-class="active" :to="{ name: 'painel' }">Painel</nuxt-link>
            </b-nav-item>

            <b-nav-item-dropdown v-if="$store.state.painel.listaMarcaIdChecked.length">
              <template slot="button-content"><span class="em-lote text-warning">Em Lote</span></template>
              <b-dropdown-item href="#">Assinar</b-dropdown-item>
              <b-dropdown-item href="#">Tramitar</b-dropdown-item>
              <b-dropdown-item href="#">Arquivar</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown v-if="logged">
              <template slot="button-content">Novo</template>
              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active"
                  :to="{ name: 'documento-novo' }">Documento</nuxt-link></b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown v-if="logged" text="Ver">
              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active"
                  :to="{ name: 'quadro' }">Quadro</nuxt-link></b-dropdown-item>
              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active"
                  :to="{ name: 'mesa' }">Mesa</nuxt-link></b-dropdown-item>
            </b-nav-item-dropdown>


            <b-nav-item-dropdown
              v-if="podeUtilizarServicoPorConfiguracao('SIGA;DOC:Módulo de Documentos') && (!ehPublicoExterno() || podeCriarNovoExterno())">
              <template slot="button-content">Documentos</template>
              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/doc/editar">Novo</nuxt-link></b-dropdown-item>
              <b-dropdown-item
                v-if="!ehPublicoExterno() && podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;PESQ:Pesquisar')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/doc/listar?primeiraVez=sim">Pesquisar</nuxt-link></b-dropdown-item>

              <div class="dropdown-divider"></div>
              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;TRALOTE:Tramitar em Lote')"><nuxt-link
                  class="dropdown-link" active-class="active" to="/sigaex/app/expediente/mov/transferir_lote">Trâmite em
                  Lote</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;ANOLOTE:Anotar em Lote')"><nuxt-link
                  class="dropdown-link" active-class="active" to="/sigaex/app/expediente/mov/anotar_lote">Anotar em
                  Lote</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;ASSLOTE:Assinar em Lote')"><nuxt-link
                  class="dropdown-link" active-class="active" to="/sigaex/app/expediente/mov/assinar_tudo">Assinar em
                  Lote</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;RECLALOTE:Reclassificar em Lote')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/mov/reclassificar_lote">Reclassificar em Lote</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;ARQLOTE:Arquivar em Lote')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/mov/arquivar_corrente_lote">Arquivar em Lote</nuxt-link></b-dropdown-item>

              <b-dropdown-item v-if="podeArquivarIntermediarioPorConfiguracao()"><nuxt-link class="dropdown-link"
                  active-class="active" to="/sigaex/app/expediente/mov/arquivar_intermediario_lote">Arquivar Intermediário
                  em
                  Lote</nuxt-link></b-dropdown-item>

              <b-dropdown-item v-if="podeArquivarPermanentePorConfiguracao()"><nuxt-link class="dropdown-link"
                  active-class="active" to="/sigaex/app/expediente/mov/arquivar_permanente_lote">Arquivar Permanente em
                  Lote</nuxt-link></b-dropdown-item>

              <b-dropdown-item v-if="testaCompetencia('atenderPedidoPublicacaoNoDiario')"><nuxt-link class="dropdown-link"
                  active-class="active" to="/sigaex/app/expediente/mov/atender_pedido_publicacao">Gerenciar Publicação
                  DJE</nuxt-link></b-dropdown-item>

              <b-dropdown-item v-if="testaCompetencia('gerenciarPublicacaoNoBoletimPorConfiguracao')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/configuracao/gerenciar_publicacao_boletim">Definir Publicadores
                  Boletim</nuxt-link></b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown
              v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;FE:Ferramentas')">
              <template slot="button-content">Ferramentas</template>

              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active"
                  to="/sigaex/app/forma/listar">Cadastro de Espécies</nuxt-link></b-dropdown-item>

              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active"
                  to="/sigaex/app/modelo/listar">Cadastro de Modelos</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="false && podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;FE:Ferramentas;DESP:Tipos de despacho')"><nuxt-link
                  class="dropdown-link" active-class="active" to="/sigaex/app/despacho/tipodespacho/listar">Cadastro de
                  Tipos de Despacho</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;FE:Ferramentas;CFG:Configurações')"><nuxt-link
                  class="dropdown-link" active-class="active" to="/sigaex/app/configuracao/listar">Cadastro de
                  Configurações</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;FE:Ferramentas;EMAIL:Email de Notificação')"><nuxt-link
                  class="dropdown-link" active-class="active" to="/sigaex/app/expediente/emailNotificacao/listar">Cadastro
                  de Email de
                  Notificação</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;FE:Ferramentas;PC:Plano de Classificação')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/classificacao/listar">Classificação
                  Documental</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;FE:Ferramentas;TT:Tabela de Temporalidade')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/temporalidade/listar">Temporalidade
                  Documental</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;FE:Ferramentas;PAINEL:Painel Administrativo')"><nuxt-link
                  class="dropdown-link" active-class="active" to="/sigaex/app/expediente/painel/exibir">Painel
                  Administrativo</nuxt-link></b-dropdown-item>

            </b-nav-item-dropdown>


            <b-nav-item-dropdown
              v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios')">
              <template slot="button-content">Relatórios</template>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;FORMS:Relação de formulários')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relRelatorios?nomeArquivoRel=relFormularios.jsp">Relação de
                  formulários</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;DATAS:Relação de documentos entre datas')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relRelatorios?nomeArquivoRel=relConsultaDocEntreDatas.jsp">Relação de
                  documentos entre datas</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;SUBORD:Relatório de documentos em setores subordinados')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relRelatorios?nomeArquivoRel=relDocumentosSubordinados.jsp">Relatório
                  de Documentos em Setores Subordinados</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;MVSUB:Relatório de movimentação de documentos em setores subordinados')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relRelatorios?nomeArquivoRel=relMovimentacaoDocSubordinados.jsp">Relatório
                  de Movimentação de Documentos em Setores Subordinados</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="false && podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;RELMVP:Relatório de movimentações de processos')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relRelatorios?nomeArquivoRel=relMovProcesso.jsp">Relatório de
                  Movimentações de Processos</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;CRSUB:Relatório de documentos criados em setores subordinados')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relRelatorios?nomeArquivoRel=relCrDocSubordinados.jsp">Relatório de
                  Criação de Documentos em Setores Subordinados</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;MOVLOT:Relação de movimentações')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relRelatorios?nomeArquivoRel=relMovimentacao.jsp">Relatório de
                  Movimentações</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;MOVCAD:Relação de movimentações por cadastrante')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relRelatorios?nomeArquivoRel=relMovCad.jsp">Relatório de Movimentações
                  por Cadastrante</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;DSPEXP:Relação de despachos e transferências')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relRelatorios?nomeArquivoRel=relOrgao.jsp">Relatório de Despachos e
                  Transferências</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;DOCCRD:Relação de documentos criados')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relRelatorios?nomeArquivoRel=relTipoDoc.jsp">Relação de Documentos
                  Criados</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;CLSD:Classificação Documental;CLASS:Relação de classificações')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relRelatorios?nomeArquivoRel=relClassificacao.jsp">Relação de
                  Classificações</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;CLSD:Classificação Documental;DOCS:Relação de documentos classificados')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relRelatorios?nomeArquivoRel=relDocsClassificados.jsp">Relação de
                  Documentos Classificados</nuxt-link></b-dropdown-item>

            </b-nav-item-dropdown>

            <b-nav-item-dropdown
              v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios')">
              <template slot="button-content">Gestão</template>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;IGESTAO: Relatório de Indicadores de Gestão')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relIndicadoresGestao?primeiraVez=true">Indicadores de
                  Gestão</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;RELDOCVOL: Relatório de documentos por volume')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relDocumentosPorVolume?primeiraVez=true">Documentos por
                  Volume</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;RELFORAPRAZO:Relatório de documentos fora do prazo')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relDocumentosForaPrazo?primeiraVez=true">Documentos Fora do
                  Prazo</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;RELDEVPROGRAMADA:Relatório de documentos devolção programada')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relDocumentosDevolucaoProgramada?primeiraVez=true">Documentos por
                  Devolução Programada</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;RELTEMPOMEDIOSITUACAO:Tempo médio por Situação')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relTempoMedioSituacao?primeiraVez=true">Tempo médio por
                  Situação</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;ORGAOINT: Relatório de Documentos Por Órgão Interessado')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relDocsOrgaoInteressado?primeiraVez=true">Total de documentos por Órgão
                  Interessado</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;TRAMESP: Tempo Médio de Tramitação Por Espécie Documental')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relTempoTramitacaoPorEspecie?primeiraVez=true">Tempo Médio de
                  Tramitação Por Espécie Documental</nuxt-link></b-dropdown-item>

              <b-dropdown-item
                v-if="podeUtilizarServicoPorConfiguracao('SIGA:Sistema Integrado de Gestão Administrativa;DOC:Módulo de Documentos;REL:Gerar relatórios;VOLTRAMMOD: Volume de Tramitação Por Nome do Documento')"><nuxt-link
                  class="dropdown-link" active-class="active"
                  to="/sigaex/app/expediente/rel/relVolumeTramitacaoPorModelo?primeiraVez=true">Volume de Tramitação Por
                  Nome do Documento</nuxt-link></b-dropdown-item>

            </b-nav-item-dropdown>

            <b-nav-item-dropdown>
              <template slot="button-content">Ajuda</template>
              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active"
                  :to="{ name: 'sugestoes' }">Sugestões</nuxt-link></b-dropdown-item>
              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active"
                  :to="{ name: 'sobre' }">Sobre</nuxt-link></b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="$store.getters['painel/caixaDeEntradaItem']">
              <nuxt-link active-class="active" :to="{
                name: 'painel',
                params: { item: $store.getters['painel/caixaDeEntradaItem'] },
              }"><font-awesome-icon :icon="['fa', 'inbox']" class="mr-1" />
                <span class="position-absolute badge rounded-pill bg-danger text-white top-0 start-100 translate-middle"
                  style="margin-top: -0.75em; margin-left: -1em; opacity: 0.75">
                  {{ $store.getters['painel/caixaDeEntradaItem'].qtd.TOTAL }}
                </span>
              </nuxt-link>
            </b-nav-item>
            <b-nav-item v-if="false">
              <nuxt-link active-class="active" :to="{ name: 'painel' }"><font-awesome-icon :icon="['far', 'star']"
                  class="mr-1" /><span
                  class="position-absolute badge rounded-pill bg-light text-dark top-0 start-100 translate-middle"
                  style="margin-top: -0.75em; margin-left: -1em; opacity: 0.75">
                  {{ 5 }}
                </span></nuxt-link>
            </b-nav-item>
            <b-nav-item v-if="false">
              <nuxt-link active-class="active" :to="{ name: 'painel' }"><font-awesome-icon :icon="['fa', 'bell']"
                  class="mr-1" /><span
                  class="position-absolute badge rounded-pill bg-light text-dark top-0 start-100 translate-middle"
                  style="margin-top: -0.75em; margin-left: -1em; opacity: 0.75">
                  {{ 5 }}
                </span></nuxt-link>
            </b-nav-item>

            <b-nav-item v-if="!logged">
              <router-link active-class="active" :to="{ name: 'login' }" tag="a">Login</router-link>
            </b-nav-item>
            <b-nav-item-dropdown v-if="logged" right>
              <template #button-content>
                {{ $store.state.usuario.cadastranteSigla }}
                <template v-if="$store.state.usuario && $store.state.usuario.substituicaoId">
                  <font-awesome-icon :icon="['fa', 'arrow-circle-right']" class="mr-1" /><span>{{ descrUsuarioAtivo
                  }}</span>
                </template>
              </template>
              <template v-if="$store.state.usuario && $store.state.usuario.substituicoesPermitidas">
                <template v-if="$store.state.usuario && $store.state.usuario.substituicaoId">
                  <b-dropdown-item @click="substituir()">Interromper Substituição Corrente</b-dropdown-item>
                  <b-dropdown-divider></b-dropdown-divider>
                </template>
                <b-dropdown-group header="Substituir:"></b-dropdown-group>
                <b-dropdown-item v-for="s in $store.state.usuario.substituicoesPermitidas" :key="s.substituicaoId"
                  :disabled="$store.state.usuario.substituicaoId === s.substituicaoId" @click="substituir(s)">
                  {{
                    (s.cadastranteId !== s.titularId ? s.titularNome : '') +
                    (s.cadastranteId !== s.titularId && s.lotaCadastranteId !== s.lotaTitularId ? '/' : '') +
                    (s.lotaCadastranteId !== s.lotaTitularId ? s.lotaTitularNome : '')
                  }}
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
              </template>
              <b-dropdown-item @click="logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-form>
              <b-form-input v-model="siglaParaPesquisar" size="sm" class="mr-sm-2" placeholder=""></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit" @click.prevent="pesquisar">Buscar</b-button>
            </b-nav-form>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <!-- End Navbar -->
    </div>
    <!--=== End Header ===-->
  </div>
</template>
<script>
import UtilsBL from '../../bl/utils'

export default {
  data() {
    return { siglaParaPesquisar: undefined }
  },
  computed: {
    descrUsuarioAtivo() {
      if (!this.$store.state.usuario) return
      let s = ''
      if (this.$store.state.usuario.substituicaoId)
        this.$store.state.usuario.substituicoesPermitidas.forEach((element) => {
          if (this.$store.state.usuario.substituicaoId === element.substituicaoId) {
            if (element.titularSigla) s += element.titularSigla
            if (element.titularSigla && element.lotaTitularSigla) s += '/'
            if (element.lotaTitularSigla) s += element.lotaTitularSigla
          }
        })
      return s
    },
    logged() {
      return this.$store.state.usuario && this.$store.state.usuario.cadastranteSigla
    },
  },
  async mounted() {
    try {
      const test = await this.$axios.$get('sigaex/api/v1/test?skip=all')
      if (test.properties) {
        for (const k in test.properties) {
          if (k in test.properties)
            if (test.properties[k] === '[undefined]') test.properties[k] = undefined
            else test.properties[k] = test.properties[k].replace(/\[default: (.*)\]/gm, '$1')
        }

        if (test.properties['siga-le.wootric.token'] && test.properties['siga-le.wootric.token'] !== '[undefined]' && this.logged) {
          // This loads the Wootric survey
          // window.wootric_survey_immediately = true
          window.wootricSettings = {
            email: this.$store.state.usuario.cadastranteSigla,
            account_token: this.test.properties['siga-le.wootric.token'],
          }
          window.wootric('run')
        }

        this.$store.commit('setTest', test)

        // let token = AuthBL.getIdToken()
        // if (token && AuthBL.isTokenExpired(token)) token = undefined
        this.$store.dispatch('updateLogged') // , token)
      }
    } catch (ex) { }
  },
  methods: {
    async pesquisar() {
      const pesq = (this.siglaParaPesquisar || '').replace(/[^a-z0-9]/gi, '')
      try {
        const resp = await this.$axios.$get(`siga/api/v1/selecionar/${pesq}`)
        console.log(resp)
        if (resp && resp.entidade && resp.entidade.tipo) {
          this.siglaParaPesquisar = resp.entidade.sigla

          const entidadeTipoXRoute = {
            GI_PESSOA: 'pessoa-numero',
            GI_LOTACAO: 'lotacao-numero',
            EX_DOCUMENTO: 'documento-numero',
            WF_PROCEDIMENTO: 'wf-procedimento-numero',
            WF_DIAGRAMA: 'wf-diagrama-numero',
            SR_SOLICITACAO: 'solicitacao-numero',
            GC_INFORMACAO: 'conhecimento-numero',
          }

          this.$router.push({
            name: entidadeTipoXRoute[resp.entidade.tipo],
            params: {
              numero: UtilsBL.onlyLettersAndNumbers(resp.entidade.sigla)
            }
          })
        }
      } catch (ex) { }
      this.siglaParaPesquisar = undefined
    },

    logout() {
      delete window.listaDaMesa
      this.$store.dispatch('logout');
      this.$router.push({ name: 'login' })
    },

    async substituir(s) {
      await this.$store.dispatch('substituir', s ? s.substituicaoId : undefined)
      this.$nuxt.refresh()
    },

    podeUtilizarServicoPorConfiguracao(servico) {
      return true
    },

    ehPublicoExterno(titular) {
      return false
    },

    podeCriarNovoExterno(titular, lotaTitular) {
      return false
    },

    podeArquivarIntermediarioPorConfiguracao() {
      return false
    },

    podeArquivarPermanentePorConfiguracao() {
      return false
    },

    testaCompetencia() {
      return false
    }

  },
}
</script>
<style scoped>
a.nav-link a {
  color: rgba(255, 255, 255, 0.5);
}

a.nav-link a:hover {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.75);
}

a.nav-link a.active {
  color: rgba(255, 255, 255, 1);
}

a.dropdown-link {
  color: #212529;
}

a.dropdown-link:hover {
  text-decoration: none;
  color: #212529;
}

.em-lote {
  color: rgba(255, 255, 255, 1);
  font-weight: bold;
}
</style>