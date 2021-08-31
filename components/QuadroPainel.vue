<template>
  <div v-if="lista && lista.length > 0" class="row">
    <table class="table table-sm table-borderless table-hover table-quadro m-3">
      <thead>
        <tr class="table-head">
          <th colspan="2">
            <span class="tipo-de-marcador">{{ lista[0].grupoNome }}</span>
          </th>
          <th style="text-align: right">
            <font-awesome-icon :icon="['fa', 'user']" />
          </th>
          <th style="text-align: right">
            <font-awesome-icon :icon="['fa', 'users']" />
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(f, index) in lista">
          <tr
            v-if="index > 0 && f.grupoNome !== lista[index - 1].grupoNome"
            :key="f.grupoId"
            class="tipo-de-marcador"
          >
            <th colspan="4">
              <span class="tipo-de-marcador">{{ f.grupoNome }}</span>
            </th>
          </tr>
          <tr :key="f.marcadorId + ':row'">
            <td :style="{ color: '#' + f.marcadorCor, width: '1em' }">
              <span
                ><font-awesome-icon
                  :icon="[
                    'fa',
                    f.marcadorIcone
                      ? f.marcadorIcone.replace('fas fa-', '')
                      : 'circle',
                  ]"
              /></span>
            </td>
            <td>
              {{ f.marcadorNome }}
            </td>
            <td style="text-align: right">
              <a
                @click="
                  $emit('pesquisar', {
                    marcadorId: f.marcadorId,
                    marcadorNome: f.marcadorNome,
                    qtd: f.qtdAtendente,
                    filtroPessoaLotacao: 'Pessoa',
                    filtroExpedienteProcesso: filtroExpedienteProcesso,
                  })
                "
              >
                <b-badge
                  :variant="
                    $parent.marcadorId === f.marcadorId &&
                    $parent.filtroPessoaLotacao === 'Pessoa' &&
                    $parent.filtroExpedienteProcesso ===
                      filtroExpedienteProcesso
                      ? 'dark'
                      : 'light'
                  "
                  >{{ f.qtdAtendente }}</b-badge
                ></a
              >
            </td>
            <td style="text-align: right">
              <a
                @click="
                  $emit('pesquisar', {
                    marcadorId: f.marcadorId,
                    marcadorNome: f.marcadorNome,
                    filtroPessoaLotacao: 'Lotacao',
                    filtroExpedienteProcesso: filtroExpedienteProcesso,
                    qtd: f.qtdLotaAtendente,
                  })
                "
              >
                <b-badge
                  :variant="
                    $parent.marcadorId === f.marcadorId &&
                    $parent.filtroPessoaLotacao === 'Lotacao' &&
                    $parent.filtroExpedienteProcesso ===
                      filtroExpedienteProcesso
                      ? 'dark'
                      : 'light'
                  "
                  >{{ f.qtdLotaAtendente }}</b-badge
                ></a
              >
            </td>
          </tr>
        </template>
      </tbody>
    </table>
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
