<template>
  <div>
    <table class="table table-sm table-hover">
      <thead class="table-dark">
        <tr>
          <th style="text-align: center">
            <input id="progress_checkall" v-model="todos" type="checkbox" name="progress_checkall" @change="marcarTodos(f.grupo)" />
          </th>
          <th></th>
          <th>Data</th>
          <th>Tipo</th>
          <th>Código</th>
          <th>Origem</th>
          <th>Descrição</th>
          <th v-if="exibirColunaDeMarca">Marca</th>
          <th v-if="exibirColunaUltimaAnotacao">Anotação</th>
        </tr>
      </thead>
      <tbody v-if="lista && lista.length > 0">
        <DocListaPainelItem
          v-for="i in lista"
          :key="i.marcaId + ':tr'"
          :item="i"
          :exibirColunaDeMarca="exibirColunaDeMarca"
          :exibirColunaUltimaAnotacao="exibirColunaUltimaAnotacao"
        />
      </tbody>
    </table>
    <b-pagination class="mr-3" v-model="pagina" :total-rows="$store.state.painel.qtd" :per-page="10" align="right"></b-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      todos: undefined,
    }
  },
  computed: {
    lista() {
      return this.$store.state.painel.lista
    },
    pagina: {
      get() {
        return this.$store.state.painel.pagina
      },
      set(value) {
        this.$store.dispatch('painel/trocarPagina', value)
      },
    },
    exibirColunaDeMarca() {
      return !this.$store.state.painel.marcadorId
    },
    exibirColunaUltimaAnotacao() {
      if (!this.lista) return
      return this.lista.some((e) => e.ultimaAnotacao)
    },
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
