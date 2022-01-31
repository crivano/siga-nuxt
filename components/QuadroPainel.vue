<template>
  <div>
    <b-dropdown menu-class="span" text="Todos" variant="primary" class="m-2">
      <b-dropdown-item href="#">Todos</b-dropdown-item>
      <b-dropdown-item href="#">Documentos</b-dropdown-item>
      <b-dropdown-item href="#">Procedimentos</b-dropdown-item>
      <b-dropdown-item href="#">Conhecimentos</b-dropdown-item>
    </b-dropdown>

    <QuadroPainelItem
      :id="t.id"
      :nome="t.nome"
      :filhos="t.filhos"
      :tipo="t.tipo"
      :primeiro="index === 0"
      v-for="(t, index) in arvore"
      :key="t.id"
    />
  </div>
</template>
 
<script>
export default {
  props: {
    lista: { required: true },
    filtroExpedienteProcesso: { required: true },
    carregando: { required: false },
    primeiraCarga: { required: false },
  },
  computed: {
    arvore() {
      if (!this.lista) return []
      const r = []
      let tipo
      let grupo
      for (let i = 0; i < this.lista.length; i++) {
        const x = {
          ...this.lista[i],
          tipo: 'MARCADOR',
          id: this.lista[i].marcadorId,
          nome: this.lista[i].marcadorNome,
        }
        if (x.tipoId && (!tipo || tipo.id !== x.tipoId)) {
          tipo = { tipo: 'TIPO', id: x.tipoId, nome: x.tipoNome, filhos: [] }
          r.push(tipo)
        }
        if (tipo.filhos.length === 0 || grupo.id !== x.grupoId) {
          grupo = {
            tipo: 'GRUPO',
            id: x.grupoId,
            nome: x.grupoNome,
            qtdAtendente: 0,
            qtdLotaAtendente: 0,
            filhos: [],
          }
          tipo.filhos.push(grupo)
        }
        grupo.qtdAtendente += parseInt(x.qtdAtendente)
        grupo.qtdLotaAtendente += parseInt(x.qtdLotaAtendente)
        grupo.filhos.push(x)
      }

      const documentos = {
        tipo: 'ELEMENTO',
        id: 1,
        nome: 'Documentos',
        qtdAtendente: 0,
        qtdLotaAtendente: 0,
      }

      const procedimentos = {
        tipo: 'ELEMENTO',
        id: 1,
        nome: 'Procedimentos',
        qtdAtendente: 0,
        qtdLotaAtendente: 0,
      }

      const conhecimentos = {
        tipo: 'ELEMENTO',
        id: 1,
        nome: 'Conhecimentos',
        qtdAtendente: 0,
        qtdLotaAtendente: 0,
      }

      const servicos = {
        tipo: 'ELEMENTO',
        id: 1,
        nome: 'Serviços',
        qtdAtendente: 0,
        qtdLotaAtendente: 0,
      }

      const todos = {
        tipo: 'TUDO',
        id: 1,
        nome: 'Todos',
        qtdAtendente: 0,
        qtdLotaAtendente: 0,
        filhos: [documentos, procedimentos, servicos, conhecimentos],
      }
      r.unshift(todos)
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
.table-quadro tr.tipo-de-marcador {
  padding-top: 1em;
  padding-bottom: 0.5em;
}
.marcador {
  width: 1em;
}
</style>
