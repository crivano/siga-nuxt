<template>
  <div v-if="lista && lista.length > 0">
    <table class="table table-sm table-hover">
      <tbody>
        <tr v-for="i in lista" :key="i.sigla + ':tr'">
          <td class="action">
            <nuxt-link :to="`/documento/${i.siglaCompacta}`">{{
              i.sigla
            }}</nuxt-link>
          </td>
          <td class="content">
            {{ i.documentoDescricao }}
          </td>
          <td>
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
<style scoped>
table .action {
  width: 1px;
  text-align: right;
  white-space: nowrap;
}
table .content {
  width: 100%;
}
</style>
