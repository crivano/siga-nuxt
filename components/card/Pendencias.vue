<template>
  <div v-if="mob.pendencias" class="card text-white bg-danger mb-3">
    <div class="card-header">Pendências</div>
    <div class="card-body">
      <div v-if="mob.pendenciasDeAnexacao">
        <p>
          <b style="color: rgb(195, 0, 0)">Anexos Pendentes:</b>
        </p>
        <ul>
          <li
            v-for="anexoPendente in mob.pendenciasDeAnexacao"
            :key="anexoPendente.idMov"
          >
            {{ anexoPendente.descricao }}
          </li>
        </ul>
      </div>
      <div v-if="mob.anexosNaoAssinados">
        <p>
          <b style="color: rgb(195, 0, 0)">Anexos não assinados:</b>
        </p>
        <ul>
          <li
            v-for="naoAssinado in mob.anexosNaoAssinados"
            :key="naoAssinado.idMov"
          >
            {{ naoAssinado.descricao }}
          </li>
        </ul>
      </div>
      <div v-if="mob.despachosNaoAssinados">
        <p>
          <b style="color: rgb(195, 0, 0)">Despachos não assinados:</b>
        </p>
        <ul>
          <li
            v-for="naoAssinado in mob.despachosNaoAssinados"
            :key="naoAssinado.idMov"
          >
            {{ naoAssinado.descricao }}
          </li>
        </ul>
      </div>
      <div v-if="mob.expedientesJuntadosNaoAssinados">
        <p>
          <b style="color: rgb(195, 0, 0)"
            >Expedientes juntados não assinados:</b
          >
        </p>
        <ul></ul>
      </div>
      <div v-if="mob.expedientesFilhosNaoJuntados">
        <p>
          <b style="color: rgb(195, 0, 0)">Expedientes não juntados:</b>
        </p>
        <ul>
          <li
            v-for="naoJuntado in mob.expedientesFilhosNaoJuntados"
            :key="naoJuntado.idMov"
          >
            {{ naoJuntado.sigla }}
          </li>
        </ul>
      </div>
      <div v-if="mob.pendenciasDeColaboracao">
        <p>
          <b style="color: rgb(195, 0, 0)">Pendências de Colaboração:</b>
        </p>
        <ul>
          <li
            v-for="colaboracaoPendente in mob.pendenciasDeColaboracao"
            :key="colaboracaoPendente.idMov"
          >
            {{ colaboracaoPendente.descricao }}
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
  computed: {
    mob() {
      return this.doc.mob | {}
    },
  },
}
</script>
