<template>
  <div class="card bg-light mb-3">
    <div class="card-header">
      {{ titulo }}
    </div>
    <div class="card-body">
      <div
        v-if="!carregando &amp;&amp; !primeiraCarga &amp;&amp; lista.length == 0"
        class="row mt-3"
      >
        <div class="col col-12">
          <p class="alert alert-warning">
            <strong>Atenção!</strong> Nenhum documento no quadro.
          </p>
        </div>
      </div>

      <div v-if="lista && lista.length > 0" class="row">
        <div class="col-sm-12">
          <table
            class="table table-sm table-borderless table-hover table-quadro"
          >
            <thead>
              <tr class="table-head">
                <th>
                  {{ lista[0].grupoNome }}
                </th>
                <th style="text-align: right">Atendente</th>
                <th style="text-align: right">Lotacao</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(f, index) in lista">
                <tr
                  v-if="index > 0 && f.grupoNome !== lista[index - 1].grupoNome"
                  :key="f.grupoId"
                  class="table-group"
                >
                  <th
                    colspan="3"
                    class="pb-0 pl-0"
                    style="padding-top: 0.5em !important"
                  >
                    <span class="pt-3">{{ f.grupoNome }}</span>
                  </th>
                </tr>
                <tr :key="f.marcadorId + ':row'">
                  <td
                    :style="{
                      'padding-left': '1em',
                      color: '#' + f.marcadorCor,
                    }"
                  >
                    <span v-if="f.marcadorIcone" class="mr-1"
                      ><i :class="'fas ' + f.marcadorIcone"></i></span
                    >{{ f.marcadorNome }}
                  </td>
                  <td style="text-align: right">
                    <nuxt-link
                      :to="`/lista/${f.marcadorId}/Pessoa/${filtroExpedienteProcesso}`"
                      >{{ f.qtdAtendente }}</nuxt-link
                    >
                  </td>
                  <td style="text-align: right">
                    <nuxt-link
                      :to="`/lista/${f.marcadorId}/Lotacao/${filtroExpedienteProcesso}`"
                      >{{ f.qtdAtendente }}</nuxt-link
                    >
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titulo: { required: true },
    lista: { required: true },
    filtroExpedienteProcesso: { required: true },
    carregando: { required: false },
    primeiraCarga: { required: false },
  },
}
</script>

<style scoped>
.table-quadro th,
.table-quadro td {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  line-height: normal;
}
</style>
