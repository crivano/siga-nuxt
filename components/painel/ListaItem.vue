<template>
  <tr>
    <td style="text-align: center">
      <input v-model="pagina" type="checkbox" :disabled="item.disabled" />
    </td>
    <td style="text-align: center">
      <font-awesome-icon :icon="['far', 'star']" />
    </td>
    <td v-html="item.dataIniFormatada"></td>
    <td>{{ item.tipo }}</td>
    <td class="action">
      <nuxt-link :to="`/${namespace}/${item.codigo}`">{{ item.sigla }}</nuxt-link>
    </td>
    <td>
      {{ item.origem }}
    </td>
    <td class="contentx">
      {{ item.descricao }}
    </td>
    <td v-if="exibirColunaDeMarca">
      {{ item.marcaTexto }}
    </td>
    <td v-if="exibirColunaUltimaAnotacao">
      {{ item.ultimaAnotacao }}
    </td>
  </tr>
</template>
<script>
export default {
  props: {
    item: { type: Object, required: true },
    exibirColunaDeMarca: { type: Boolean, required: true },
    exibirColunaUltimaAnotacao: { type: Boolean, required: true },
  },
  computed: {
    namespace() {
      if (!this.item || !this.item.moduloId) return undefined
      return this.$store.state.painel.tiposDeMarca[this.item.moduloId - 1].defaultNamespace
    },
    pagina: {
      get() {
        return this.$store.state.painel.marcaIdChecked[this.item.marcaId]
      },
      set(value) {
        this.$store.commit('painel/toogleMarcaIdChecked', {
          marcaId: this.item.marcaId,
          value,
        })
      },
    },
  },
}
</script>