<template>
  <div>
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
