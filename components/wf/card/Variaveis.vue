<template>
  <div class="card bg-light mb-3" v-if="procedimento.variaveis">
    <div class="card-header">Variáveis</div>
    <div class="card-body">
      <ul class="no-bullets">
        <li v-for="v in procedimento.variaveis" :key="v.variavelIdentificador">
          <b>{{ v.variavelIdentificador }}:</b>
          {{ v.variavelValorString }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    procedimento: { type: Object, required: true },
  },
}
</script>
<style scoped>
.card-body p {
  margin-bottom: 0.2em;
}

ul.no-bullets {
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
}
</style>
