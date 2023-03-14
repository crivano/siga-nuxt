<template>
  <div>
    <div class="row align-items-end">
      <div class="col">
        <h4>Ações</h4>
      </div>
      <div class="col col-auto">
        <b-form-group v-slot="{ ariaDescribedby }" label="" class="mb-0 mt-auto">
          <b-form-checkbox-group v-model="acoesOptionsSelected" :options="acoesOptions"
            :aria-describedby="ariaDescribedby" switches></b-form-checkbox-group>
        </b-form-group>

      </div>
    </div>
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th colspan="2">Nome</th>
          <th v-if="acoesOptionsSelected.includes('descricoes')">Descrição</th>
          <th v-if="acoesOptionsSelected.includes('explicacoes')">Explicação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="acao in filteredAcoes" :key="acao.nome" :class="{ 'text-muted': !acao.pode }">
          <td><img :src="$axios.defaults.baseURL + '/siga/css/famfamfam/icons/' + acao.icone + '.png'" width="16px"
              height="16px" class="mb-1" title="" /></td>
          <td>{{ acao.nome.replace('_', '') }}</td>
          <td v-if="acoesOptionsSelected.includes('descricoes')">{{ acao.descr }}</td>
          <td v-if="acoesOptionsSelected.includes('explicacoes')">{{ acao.explicacao }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    doc: { type: Object, required: true },
  },
  data() {
    return {
      acoesOptionsSelected: ['descricoes'],
      acoesOptions: [
        { text: 'Descrições', value: 'descricoes' },
        { text: 'Explicações', value: 'explicacoes' },
        { text: 'Inativas', value: 'inativas' },
      ]
    }
  },
  computed: {
    unfilteredAcoes() {
      if (!this.doc) return undefined
      let acoes = this.doc.mobs.length > 1 ? this.doc.mobs[0].acoes.concat(this.doc.mobs[1].acoes) : this.doc.mobs[0].acoes
      acoes = acoes.sort((a, b) => (!a.pode && b.pode ? 1 : !b.pode && a.pode ? -1 : (a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0)))
      return acoes
    },
    filteredAcoes() {
      if (this.unfilteredAcoes)
        return this.unfilteredAcoes.filter((m) => this.acoesOptionsSelected.includes('inativas') || m.pode)
      return undefined
    },
  },
}
</script>
