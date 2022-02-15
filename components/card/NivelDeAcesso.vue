<template>
  <div v-if="doc.listaDeAcessos && doc.listaDeAcessos.length">
    <h4>Nível de Acesso</h4>
    <b>{{ doc.nmNivelAcesso }}</b>
    <div v-if="doc.listaDeAcessos">
      <div v-if="doc.listaDeAcessos.length == 1">
        {{ doc.listaDeAcessos[0] == 'PUBLICO' ? '(Público)' : acesso.sigla }}
      </div>
      <div v-if="doc.listaDeAcessos.length > 1">
        <ul>
          <li v-for="acesso in doc.listaDeAcessos" :key="acesso">
            {{ acesso.sigla }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    doc: { type: Object, required: true },
  },
}
</script>
<style scoped>
.card-body p {
  margin-bottom: 0.2em;
}
</style>
