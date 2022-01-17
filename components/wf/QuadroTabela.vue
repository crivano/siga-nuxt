<template>
  <div class="card bg-light mb-3">
    <div class="card-header">
      {{ titulo }}
    </div>
    <div class="card-body">
      <div
        v-if="!carregando &amp;&amp; !primeiraCarga &amp;&amp; lista.length == 0"
        class="row mt-3"
      ></div>

      <div v-if="lista && lista.length > 0" class="row">
        <div class="col-sm-12">
          <table
            class="table table-sm table-borderless table-hover table-quadro"
          >
            <thead>
              <tr class="table-head">
                <th>Tarefa</th>
                <th>Principal</th>
                <th style="text-align: center">Atendente</th>
                <th style="text-align: center">Prioridade</th>
                <th style="text-align: right">Início</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="f in lista">
                <tr :key="f.id + ':row'">
                  <td>
                    <nuxt-link
                      :to="`/wf/procedimento/${onlyLettersAndNumbers(f.sigla)}`"
                      >{{ f.tarefaTitulo }}</nuxt-link
                    >
                  </td>
                  <td>
                    <nuxt-link
                      :to="`/documento/${onlyLettersAndNumbers(
                        f.principalSigla
                      )}`"
                      >{{ f.principalSigla }}</nuxt-link
                    >
                  </td>
                  <td style="text-align: center">
                    {{
                      f.atendente
                        ? f.atendente.sigla
                        : f.lotaAtendente
                        ? f.lotaAtendente.sigla
                        : undefined
                    }}
                  </td>
                  <td style="text-align: center">
                    {{ f.prioridadeNome }}
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
import UtilsBL from '../../bl/utils.js'

export default {
  props: {
    titulo: { required: true },
    lista: { required: true },
    carregando: { required: false },
    primeiraCarga: { required: false },
  },
  methods: {
    onlyLettersAndNumbers(sigla) {
      return UtilsBL.onlyLettersAndNumbers(sigla)
    },
  },
}
</script>

<style scoped>
.table-quadro th,
.table-quadro td {
  padding-top: 0 !important;
  padding-bottom: 0.1em !important;
  line-height: normal;
}
</style>
