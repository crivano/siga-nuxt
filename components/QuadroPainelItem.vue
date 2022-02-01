<template>
  <div>
    <div
      class="row mr-0"
      v-if="nome"
      :class="{
        'primeiro-titulo-tipo': tipo === 'TIPO' && primeiro,
        'titulo-tipo': tipo === 'TIPO' && !primeiro,
      }"
    >
      <div
        class="col"
        :class="
          'col-' + (12 - 2 * $store.getters['painel/listDeQuantidades'].length)
        "
        v-b-toggle="filhos ? 'accordion-' + id : undefined"
      >
        <div
          :class="{
            tudo: tipo === 'TUDO',
            elemento: tipo === 'ELEMENTO',
            tipo: tipo === 'TIPO',
            grupo: tipo === 'GRUPO',
            marcador: tipo === 'MARCADOR',
          }"
        >
          <span v-if="filhos" class="when-open"
            ><font-awesome-icon :icon="['fa', 'caret-down']" /></span
          ><span v-if="filhos" class="when-closed"
            ><font-awesome-icon :icon="['fa', 'caret-right']" /></span
          ><span>{{ nome }}</span>
        </div>
      </div>
      <div
        class="col col-2 col-badge pl-0 pr-0"
        v-for="i in $store.getters['painel/listDeQuantidades']"
        :key="i.filtro"
      >
        <a
          v-if="qtd && qtd[i.filtro] != undefined"
          @click="
            $store.dispatch('painel/trocarLista', {
              tipo: tipo,
              id: id,
              nome: nome,
              qtd: qtd[i.filtro],
              pessoaOuLotacao: i.filtro,
            })
          "
        >
          <b-badge
            :variant="
              ($store.state.painel.marcadorId === id ||
                $store.state.painel.grupoId === id) &&
              $store.state.painel.pessoaOuLotacao === i.filtro
                ? 'dark'
                : 'light'
            "
            >{{ qtd[i.filtro] }}</b-badge
          ></a
        >
        <b-badge v-else :variant="'light'">-</b-badge>
      </div>
    </div>
    <b-collapse
      :id="'accordion-' + id"
      :visible="tipo !== 'GRUPO' || !id"
      :accordion="nome && tipo !== 'TIPO' ? 'accordion-' + tipo : undefined"
      role="tabpanel"
    >
      <QuadroPainelItem
        :id="f.id"
        :nome="f.nome"
        :filhos="f.filhos"
        :tipo="f.tipo"
        :qtd="f.qtd"
        v-for="f in filhos"
        :key="f.id"
      />
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: {
    primeiro: { required: false },
    nome: { required: false },
    id: { required: false },
    tipo: { required: true },
    qtd: { required: false },
    filhos: { required: false },
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

.primeiro-titulo-tipo {
  padding-top: 0;
  padding-bottom: 0.5em;
}

.titulo-tipo {
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

.tipo {
  font-weight: bold;
}

.grupo {
  padding-top: 0;
  padding-bottom: 0.5em;
}

.marcador {
  padding-left: 1em;
  padding-top: 0;
  padding-bottom: 0;
}
</style>