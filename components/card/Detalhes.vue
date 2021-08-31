<template>
  <div class="card bg-light mb-3">
    <div class="card-header">Documento {{ doc.exTipoDocumentoDescricao }}</div>
    <div class="card-body" style="font-size: 70%">
      <p><b>Suporte:</b> {{ doc.fisicoOuEletronico }}</p>
      <p>
        <b>Data:</b> {{ doc.dtDocDDMMYY }}
        <span v-if="doc.originalData"
          ><b>original:</b> {{ doc.originalData }}</span
        >
      </p>
      <p v-if="doc.originalNumero">
        <b>Número original:</b> {{ doc.originalNumero }}
      </p>
      <p><b>De:</b> {{ doc.subscritorString }}</p>
      <p><b>Para:</b> {{ doc.destinatarioString }}</p>
      <p>
        <b>Cadastrante:</b> {{ doc.cadastranteString }}
        {{ doc.lotaCadastranteString }}
      </p>
      <p><b>Espécie:</b> {{ doc.forma }}</p>
      <p><b>Modelo:</b> {{ doc.modelo }}</p>
      <p id="descricao"><b>Descrição:</b> {{ doc.descrDocumento }}</p>
      <p>
        <b>Classificação:</b>
        {{ doc.classificacaoDescricaoCompleta }}
      </p>
      <div v-if="doc.dadosComplementares">
        {{ doc.dadosComplementares }}
      </div>
      <div v-if="false &amp;&amp; doc.cossignatarios">
        <h6>Cossignatários</h6>
        <ul>
          <li v-for="cossig in doc.cossignatarios" :key="cossig.idMov">
            {{ cossig.key.subscritor.nomePessoa }}
          </li>
        </ul>
      </div>
      <!--
                              <c:if test="{{not empty doc.doc.perfis}}">
                                <div class="gt-sidebar-content" style="padding-top: 10px">
                                  <h3>Perfis</h3>
                                  <c:forEach var="perfil" items="{{doc.doc.perfis}}">
                                    <p style="margin-bottom: 3px;">
                                      <b>{{perfil.key.descPapel}}:</b>
                                    </p>
                                    <ul>
                                      <c:forEach var="pessoaOuLota" items="{{perfil.value}}">
                                        <li><c:catch var="exception">{{pessoaOuLota.nomePessoa}}</c:catch>
                                          <c:if test="{{not empty exception}}">{{pessoaOuLota.nomeLotacao}}</c:if>
                                        </li>
                                      </c:forEach>
                                    </ul>
                                  </c:forEach>
                                </div>
                              </c:if>
                              -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    doc: { type: Object, required: true },
  },
}
</script>
<style scoped>
.card-body p {
  margin-bottom: 0.2em;
}
</style>
