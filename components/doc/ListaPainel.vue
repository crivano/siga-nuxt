<template>
  <div v-if="lista && lista.length > 0">
    <table class="table table-sm table-hover">
      <thead class="table-dark">
        <tr>
          <th style="text-align: center">
            <input
              id="progress_checkall"
              v-model="todos"
              type="checkbox"
              name="progress_checkall"
              @change="marcarTodos(f.grupo)"
            />
          </th>
          <th>Tipo</th>
          <th>Código</th>
          <th>Descrição</th>
          <th>Anotação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(i, index) in lista" :key="index + ':tr'">
          <td style="text-align: center">
            <input v-model="i.checked" type="checkbox" :disabled="i.disabled" />
          </td>
          <td>{{ i.tipo }}</td>
          <td class="action">
            <nuxt-link :to="`/documento/${i.siglaCompacta}`">{{
              i.sigla
            }}</nuxt-link>
          </td>
          <td class="content">
            {{ i.descricao }}
          </td>
          <td>
            {{ i.ultimaAnotacao }}
          </td>
        </tr>
      </tbody>
    </table>
    <b-pagination class="mr-3"
      v-model="pagina"
      :total-rows="$store.state.painel.qtd"
      :per-page="10"
      align="right"
    ></b-pagination>
  </div>
</template>
<script>
export default {
  props: {
    lista: { type: Array, required: true },
  },
  data() {
    return {
      pagina: 1,
      todos: undefined,
    }
  },
}
</script>
<style scoped>
table .action {
  width: 1px;
  white-space: nowrap;
}
table .content {
  width: 100%;
}
</style>
