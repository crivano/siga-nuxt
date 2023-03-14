<template>
  <div>
    <h4>Marcas</h4>
    <table class="table table-sm table-striped">
      <thead class="table-dark">
        <tr>
          <th rowspan="2">#</th>
          <th rowspan="2">Nome</th>
          <th rowspan="2">Texto</th>
          <th colspan="2">Pessoa</th>
          <th colspan="2">Lotacao</th>
          <th colspan="2">Data</th>
          <th rowspan="2"><font-awesome-icon :icon="['fa', 'trash-alt']" /></th>
        </tr>
        <tr>
          <th>Sigla</th>
          <th>Nome</th>
          <th>Sigla</th>
          <th>Nome</th>
          <th>Início</th>
          <th>Término</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="marca in listaPlana" :key="marca.id">
          <td v-if="marca.rows" :rowspan="marca.rows">
            <nuxt-link :to="{
              name: 'documento-numero',
              params: { numero: marca.numeroMob },
            }">{{ marca.identificadorMob }}</nuxt-link>
          </td>
          <td :key="'descr-' + marca.id">{{ marca.descr }}</td>
          <td :key="'texto-' + marca.id">
            {{ marca.texto }}
          </td>
          <td :key="'pessoa-' + marca.id">
            {{ marca.siglaPessoa }}
          </td>
          <td :key="'pessoa-nome-' + marca.id">
            {{ marca.nomePessoa }}
          </td>
          <td :key="'lotacao-' + marca.id">
            {{ marca.siglaLotacao }}
          </td>
          <td :key="'lotacao-nome-' + marca.id">
            {{ marca.nomeLotacao }}
          </td>
          <td :key="'data-ini-' + marca.id">
            <FormatJSDDMMYYHHMM :dt="marca.dtIni"/>
          </td>
          <td :key="'data-fim-' + marca.id">
            <FormatJSDDMMYYHHMM :dt="marca.dtFim"/>
          </td>
          <td :key="'pode-cancelar-' + marca.id">
            <font-awesome-icon v-if="marca.podeCancelarMov" :icon="['fa', 'trash-alt']" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import UtilsBL from '../../bl/utils.js'

export default {
  props: {
    doc: { type: Object, required: true },
  },
  computed: {
    
    marcasPorMobil() {
      if (!this.doc || !this.doc.marcas || !this.doc.mobs) return undefined
      const a = []
      this.doc.mobs.forEach((m) => {
        const marcasDoMobil = this.doc.marcas.filter((marca) => marca.idMob === m.id)
        if (marcasDoMobil.length)
          a.push({
            identificadorMob: marcasDoMobil[0].identificadorMob,
            marcas: marcasDoMobil,
          })
      })
      return a
    },
    listaPlana() {
      const l = []
      if (this.marcasPorMobil) {
        this.marcasPorMobil.forEach((mobil) => {
          if (mobil.marcas) {
            mobil.marcas.forEach((marca, index) => {
              const m = { ...marca }
              if (index === 0) {
                m.identificadorMob = mobil.identificadorMob
                m.rows = mobil.marcas.length
              }
              m.numeroMob = UtilsBL.onlyLettersAndNumbers(m.siglaMob)
              l.push(m)
            })
          }
        })
      }
      return l
    },
  },
}
</script>
