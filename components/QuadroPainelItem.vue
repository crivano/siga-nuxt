<template>
  <div>
    <div class="row" v-if="nome">
      <div
        class="col col-8"
        v-b-toggle="filhos ? 'accordion-' + id : undefined"
      >
        <div
          :class="{
            tipo: tipo === 'TIPO',
            grupo: tipo === 'GRUPO',
            marcador: tipo === 'MARCADOR',
            'primeiro-titulo-tipo': tipo === 'TIPO' && primeiro,
            'titulo-tipo': tipo === 'TIPO' && !primeiro,
          }"
        >
          <span v-if="filhos" class="when-open"
            ><font-awesome-icon :icon="['fa', 'caret-down']" /></span
          ><span v-if="filhos" class="when-closed"
            ><font-awesome-icon :icon="['fa', 'caret-right']" /></span
          ><span>{{ nome }}</span>
        </div>
      </div>
      <div class="col col-2 col-badge pr-0">
        <font-awesome-icon
          v-if="tipo === 'TIPO' && primeiro"
          :icon="['fa', 'user']"
        />
        <a
          v-if="qtdAtendente"
          @click="
            $store.dispatch('painel/trocarLista', {
              tipo: tipo,
              id: id,
              nome: nome,
              qtd: qtdAtendente,
              pessoaOuLotacao: 'PESSOA',
            })
          "
        >
          <b-badge
            :variant="
              ($store.state.painel.marcadorId === id ||
                $store.state.painel.grupoId === id) &&
              $store.state.painel.pessoaOuLotacao === 'PESSOA'
                ? 'dark'
                : 'light'
            "
            >{{ qtdAtendente }}</b-badge
          ></a
        >
      </div>
      <div class="col col-2 col-badge pl-0">
        <font-awesome-icon
          v-if="tipo === 'TIPO' && primeiro"
          :icon="['fa', 'users']"
        />
        <a
          v-if="qtdAtendente"
          @click="
            $store.dispatch('painel/trocarLista', {
              tipo: tipo,
              id: id,
              nome: nome,
              qtd: qtdLotaAtendente,
              pessoaOuLotacao: 'LOTACAO',
            })
          "
        >
          <b-badge
            :variant="
              ($store.state.painel.marcadorId === id ||
                $store.state.painel.grupoId === id) &&
              $store.state.painel.pessoaOuLotacao === 'LOTACAO'
                ? 'dark'
                : 'light'
            "
            >{{ qtdLotaAtendente }}</b-badge
          ></a
        >
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
        :qtdAtendente="f.qtdAtendente"
        :qtdLotaAtendente="f.qtdLotaAtendente"
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
    qtdAtendente: { required: false },
    qtdLotaAtendente: { required: false },
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