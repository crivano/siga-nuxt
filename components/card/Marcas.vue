<template>
  <div class="card bg-light mb-3">
    <div class="card-header">Marcas</div>
    <div class="card-body m-0 p-0">
      <div class="table-responsive mb-0">
        <table class="table table-sm mb-0 w-100">
          <tbody>
            <tr v-for="marca in listaPlana" :key="marca.id">
              <td
                v-if="marca.rows"
                :rowspan="marca.rows"
                style="padding-left: 1.25rem"
              >
                <nuxt-link
                  :to="{
                    name: 'documento-numero',
                    params: { numero: marca.numeroMob },
                  }"
                  >{{ marca.identificadorMob }}</nuxt-link
                >
              </td>
              <td :key="'descr-' + marca.id">{{ marca.descricaoComDatas }}</td>
              <td :key="'pessoa-' + marca.id">
                {{ marca.siglaPessoa }}
              </td>
              <td :key="'lotacao-' + marca.id">
                {{ marca.siglaLotacao }}
              </td>
              <td :key="'mov-' + marca.id" v-if="marca.descrMov">
                {{ marca.descrMov }}
              </td>
              <td
                :key="'mov-' + marca.id"
                v-else
                style="padding-left: 0; padding-right: 0"
              ></td>
              <td :key="'cmov-' + marca.id" v-if="marca.podeCancelarMov">
                <a
                  href="javascript:postToUrl('/sigaex/app/expediente/mov/cancelar_movimentacao_gravar?id=${marca.exMovimentacao.idMov}&sigla=${sigla}')"
                  title="${marca.exMovimentacao.expliquePodeCancelar(titular, lotaTitular)}"
                  ><font-awesome-icon :icon="['fa', 'trash-alt']"
                /></a>
              </td>
              <td
                :key="'cmov-' + marca.id"
                v-else
                style="padding-left: 0; padding-right: 0"
              ></td>
              <td
                :key="'pr-' + marca.id"
                style="padding-left: 0; padding-right: 1.25rem"
              ></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
        const marcasDoMobil = this.doc.marcas.filter(
          (marca) => marca.idMob === m.id
        )
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
      this.marcasPorMobil.forEach((mobil) => {
        mobil.marcas.forEach((marca, index) => {
          const m = { ...marca }
          if (index === 0) {
            m.identificadorMob = mobil.identificadorMob
            m.rows = mobil.marcas.length
          }
          m.numeroMob = UtilsBL.onlyLettersAndNumbers(m.siglaMob)
          l.push(m)
        })
      })
      return l
    },
  },
}
</script>
