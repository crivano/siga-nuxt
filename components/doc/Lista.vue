<template>
  <div v-if="lista && lista.length > 0">
    <table class="table table-sm table-striped table-hover">
      <thead class="thead-dark">
        <tr>
          <th rowspan="3" align="right">Número</th>
          <th colspan="3" align="center">Documento</th>
          <th colspan="4" align="center">Situação</th>
          <th rowspan="3">Tipo</th>
          <th rowspan="3">Modelo</th>
          <th rowspan="3">Descrição</th>
          <th rowspan="3">Última Anotação</th>
        </tr>
        <tr>
          <th rowspan="2" align="center">Data</th>
          <th colspan="2" align="center">Subscritor</th>
          <th rowspan="2" align="center">Data</th>
          <th colspan="2" align="center">Atendente</th>
          <th rowspan="2" align="center">Situação</th>
        </tr>
        <tr>
          <th align="center">Lotação</th>
          <th align="center">Pessoa</th>
          <th align="center">Lotação</th>
          <th align="center">Pessoa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in lista" :key="i.sigla + ':tr'">
          <td width="11.5%" align="right">
            <nuxt-link :to="`/documento/${i.siglaCompacta}`">{{
              i.sigla
            }}</nuxt-link>
          </td>
          <td width="5%" align="center">
            {{ i.documentoData }}
          </td>
          <td width="4%" align="center">{{ i.documentoSubscritor }}</td>
          <td width="4%" align="center">{{ i.documentoLotaSubscritor }}</td>
          <td width="5%" align="center">
            {{ i.marcaData }}
          </td>
          <td width="4%" align="center">{{ i.marcaResponsavel }}</td>
          <td width="4%" align="center">{{ i.marcaLotaResponsavel }}</td>
          <td width="10.5%" align="center">
            {{ i.marcadorNome }}
          </td>

          <td width="6%">{{ i.documentoEspecie }}</td>
          <td width="6%">{{ i.documentoModelo }}</td>

          <td width="38%">
            {{ i.documentoDescricao }}
          </td>
          <td class="${estilo}" width="38%">
            {{ i.mobilUltimaAnotacao }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    lista: { type: Array, required: true },
  },
}
</script>
