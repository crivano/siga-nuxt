<template>
  <div>
    <div
      class="row mr-0"
      @click.prevent="
        $store.commit(
          'painel/setQtds',
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
        class="col col-2 col-badge pl-0 pr-0"
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
      :id="t.id"
      :nome="t.nome"
      :filhos="t.filhos"
      :escopo="t.escopo"
      :primeiro="index === 0"
      v-for="(t, index) in arvore"
      :key="t.id"
      :qtd="t.qtd"
    />
  </div>
</template>
 
<script>
export default {
  props: {
    lista: { required: true },
    carregando: { required: false },
    primeiraCarga: { required: false },
  },
  methods: {
    sumQtd(a) {
      if (!a.qtd) return 0
      return a.qtd.TOTAL
    },
    compareQtd(a, b) {
      return this.sumQtd(b) - this.sumQtd(a)
    },
  },
  computed: {
    arvore() {
      if (!this.lista) return []
      const r = []

      const todos = {
        escopo: 'TUDO',
        id: 1,
        nome: 'Tudo',
        qtd: {},
        filhos: [],
        filho: {},
      }

      r.push(todos)

      let tipo
      let grupo
      // let marcador
      for (let i = 0; i < this.lista.length; i++) {
        const x = {
          ...this.lista[i],
          escopo: 'MARCADOR',
          id: this.lista[i].marcadorId,
          nome: this.lista[i].marcadorNome,
        }

        // se não existir um este "tipo" no resultado, incluir
        if (x.tipoId && (!tipo || tipo.id !== x.tipoId)) {
          tipo = { escopo: 'TIPO', id: x.tipoId, nome: x.tipoNome, filhos: [] }
          r.push(tipo)
        }

        // se não existir um filho de "tipo" que represente esse grupo, incluir
        if (tipo.filhos.length === 0 || grupo.id !== x.grupoId) {
          grupo = {
            escopo: 'GRUPO',
            id: x.grupoId,
            nome: x.grupoNome,
            qtds: [],
            qtd: {},
            filhos: [],
          }
          tipo.filhos.push(grupo)
        }

        // se não existir um filho de "grupo" que represente esse marcador, incluir
        // if (grupo.filhos.length === 0 || marcador.id !== x.grupoId) {
        //   grupo = {
        //     escopo: 'GRUPO',
        //     id: x.grupoId,
        //     nome: x.grupoNome,
        //     qtds: [],
        //     qtd: {},
        //     filhos: [],
        //   }
        //   tipo.filhos.push(grupo)
        // }

        if (x.qtds) {
          x.qtd = {}
          for (let q = 0; q < x.qtds.length; q++) {
            // inclui a quantidade no registro x.qtd
            const qtd = x.qtds[q]
            x.qtd[qtd.filtro] = parseInt(qtd.qtd)

            // inclui a quantidade no registro grupo.qtd
            if (grupo.qtd[qtd.filtro] === undefined) grupo.qtd[qtd.filtro] = 0
            grupo.qtd[qtd.filtro] += x.qtd[qtd.filtro]

            // se não existir um filho de "todos" que represente esse tipoDeMarca, incluir
            if (!todos.filho[qtd.tipo]) {
              const tipoDaMarca = {
                escopo: 'TIPO_MARCA',
                id: qtd.tipo,
                nome: {
                  SIGA_EX: 'Documento',
                  SIGA_SR: 'Serviço',
                  SIGA_GC: 'Conhecimento',
                }[qtd.tipo],
                qtd: {},
              }
              todos.filhos.push(tipoDaMarca)
              todos.filho[qtd.tipo] = tipoDaMarca
            }

            // inclui a quantidade no registro todos.filho[tipoDaMarca]
            if (todos.filho[qtd.tipo].qtd[qtd.filtro] === undefined)
              todos.filho[qtd.tipo].qtd[qtd.filtro] = 0
            todos.filho[qtd.tipo].qtd[qtd.filtro] += x.qtd[qtd.filtro]
          }
        }
        // grupo.qtds[]
        // grupo.qtdAtendente += parseInt(x.qtdAtendente)
        // grupo.qtdLotaAtendente += parseInt(x.qtdLotaAtendente)
        grupo.filhos.push(x)
      }

      todos.filhos.sort((a, b) => this.compareQtd(a, b))

      return r
    },
  },
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
