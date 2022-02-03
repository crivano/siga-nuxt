<template>
  <div>
    <div
      class="row mr-0"
      v-if="item.nome"
      :class="{
        'primeiro-titulo-escopo': item.escopo === 'TIPO' && item.primeiro,
        'titulo-escopo': item.escopo === 'TIPO' && !item.primeiro,
      }"
    >
      <div
        class="col"
        :class="
          'col-' + (12 - 2 * $store.getters['painel/listDeQuantidades'].length)
        "
        v-b-toggle="item.filhos ? 'accordion-' + item.id : undefined"
      >
        <div
          :class="{
            tudo: item.escopo === 'TUDO',
            'tipo-de-marca': item.escopo === 'TIPO_MARCA',
            escopo: item.escopo === 'TIPO',
            grupo: item.escopo === 'GRUPO',
            marcador: item.escopo === 'MARCADOR',
          }"
        >
          <span v-if="item.filhos" class="when-open"
            ><font-awesome-icon :icon="['fa', 'caret-down']" /></span
          ><span v-if="item.filhos" class="when-closed"
            ><font-awesome-icon :icon="['fa', 'caret-right']" /></span
          ><span>{{ item.nome }}</span>
        </div>
      </div>
      <div
        class="col col-2 col-badge pl-0 pr-0"
        v-for="i in $store.getters['painel/listDeQuantidades']"
        :key="i.filtro"
      >
        <a
          v-if="item.qtd && item.qtd[i.filtro] != undefined"
          @click="
            $store.dispatch('painel/trocarItemEFiltro', {
              item: item,
              filtro: i.filtro,
            })
          "
        >
          <b-badge
            :variant="
              itemSelecionado &&
              $store.state.painel.pessoaOuLotacao === i.filtro
                ? 'dark'
                : 'light'
            "
            >{{ item.qtd[i.filtro] }}</b-badge
          ></a
        >
        <b-badge v-else :variant="'light'">-</b-badge>
      </div>
    </div>
    <b-collapse
      :id="'accordion-' + item.id"
      :visible="item.escopo !== 'GRUPO' || !item.id"
      :accordion="
        item.nome && item.escopo !== 'TIPO'
          ? 'accordion-' + item.escopo
          : undefined
      "
      role="tabpanel"
    >
      <QuadroPainelItem :item="f" v-for="f in item.filhos" :key="f.id" />
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: {
    item: { required: true },
  },
  computed: {
    itemSelecionado() {
      const painel = this.$store.state.painel
      if (!painel.item) return false
      return (
        (painel.item.escopo === 'MARCADOR' &&
          painel.marcadorId === this.item.id) ||
        (painel.item.escopo === 'GRUPO' && painel.grupoId === this.item.id) ||
        (painel.item.escopo === 'TIPO' && painel.tipoId === this.item.id) ||
        (painel.item.escopo === 'TUDO' && this.item.escopo === 'TUDO')
      )
    },
  },
}
</script>

<style scoped>
.when-open {
  display: inline-block;
  width: 1em !important;
}
.when-closed {
  display: inline-block;
  width: 1em !important;
}
.collapsed > div span.when-open,
.not-collapsed > div span.when-closed {
  display: none;
}

.col-badge {
  text-align: right;
}

.primeiro-titulo-escopo {
  padding-top: 0;
  padding-bottom: 0.5em;
}

.titulo-escopo {
  padding-top: 1em;
  padding-bottom: 0.5em;
}

.tudo {
  font-weight: bold;
}

.elemento {
  padding-left: 1em;
  padding-top: 0;
  padding-bottom: 0;
}

.escopo {
  font-weight: bold;
}

.grupo {
  padding-top: 0;
  padding-bottom: 0.5em;
}

.tipo-de-marca {
  padding-left: 1em;
  padding-top: 0;
  padding-bottom: 0;
}

.marcador {
  padding-left: 1em;
  padding-top: 0;
  padding-bottom: 0;
}
</style>