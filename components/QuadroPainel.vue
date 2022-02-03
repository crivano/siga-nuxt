<template>
  <div>
    <div
      class="row mr-0"
      @click.prevent="
        $store.dispatch(
          'painel/trocarFiltroDePessoaOuLotacao',
          $store.state.painel.qtds === 'RESUMIDO' ? 'DETALHADO' : 'RESUMIDO'
        )
      "
    >
      <div
        class="col"
        :class="
          'col-' + (12 - 2 * $store.getters['painel/listDeQuantidades'].length)
        "
      >
        &nbsp;
      </div>
      <div
        class="col col-2 col-badge pl-0 pr-0 mt-3 mb-3"
        v-for="(i, index) in $store.getters['painel/listDeQuantidades']"
        :key="i.filtro"
      >
        <font-awesome-icon
          :icon="[
            'fa',
            $store.state.painel.qtds === 'RESUMIDO'
              ? 'caret-left'
              : 'caret-right',
          ]"
          v-if="index === 0"
        />
        <font-awesome-icon :icon="['fa', i.icone]" />
      </div>
    </div>

    <QuadroPainelItem
      :item="t"
      v-for="t in $store.getters['painel/arvore']"
      :key="t.id"
      :qtd="t.qtd"
    />
  </div>
</template>
 
<script>
export default {
  props: {
    carregando: { required: false },
    primeiraCarga: { required: false },
  },
  methods: {},
  computed: {},
}
</script>

<style scoped>
.table-quadro th,
.table-quadro td {
  line-height: normal;
}
.table-quadro tr.escopo-de-marcador {
  padding-top: 1em;
  padding-bottom: 0.5em;
}
.marcador {
  width: 1em;
}
.col-badge {
  text-align: right;
}
</style>
