<template>
  <div>
    <div class="card bg-info mb-3 mt-3">
      <div class="card-header text-white">
        <span
          v-if="
            procedimento.principalTipo === 'DOCUMENTO' &&
            procedimento.principalSigla
          "
        >
          <nuxt-link
            :to="`/documento/${onlyLettersAndNumbers(
              procedimento.principalSigla
            )}`"
            class="link-white"
            >{{ procedimento.principalSigla }}</nuxt-link
          >
          -
        </span>
        {{ procedimento.definicaoDeProcedimentoNome }} -
        {{ procedimento.tarefaTitulo }}
      </div>
      <div class="card-body bg-light text-black">
        <div
          v-if="!procedimento.desabilitarFormulario && !procedimento.msgAviso"
        >
          <WfTarefaVariavel
            v-for="dv in vars"
            :key="dv.id"
            :definicao-de-variavel="dv"
            v-model="dv.valor"
          />

          <button
            v-if="
              !procedimento.definicaoDeTarefaCorrente.definicoesDeDesvios ||
              procedimento.definicaoDeTarefaCorrente.definicoesDeDesvios
                .length === 0
            "
            name="indiceDoDesvio"
            @click="continuar()"
            class="btn btn-info mr-3"
          >
            Prosseguir
          </button>

          <WfTarefaDesvio
            v-else
            v-for="(dd, idx) in procedimento.definicaoDeTarefaCorrente
              .definicoesDeDesvios"
            :key="dd.id"
            :definicao-de-desvio="dd"
            :idx="idx"
            @click="continuar(idx)"
          />
        </div>
        <span style="color: red; font-weight: bold">{{
          procedimento.msgAviso
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import UtilsBL from '../../bl/utils.js'

export default {
  props: {
    procedimento: { type: Object, required: true },
  },
  data() {
    return { vars: undefined }
  },
  mounted() {
    if (
      this.procedimento &&
      this.procedimento.definicaoDeTarefaCorrente &&
      this.procedimento.definicaoDeTarefaCorrente.definicoesDeVariaveis
    ) {
      this.vars = []
      this.procedimento.definicaoDeTarefaCorrente.definicoesDeVariaveis.forEach(
        (dv) => {
          const v = this.procedimento.variaveis
            ? this.procedimento.variaveis.find(
                (i) =>
                  i.definicaoDeVariavelIdentificador ===
                  dv.definicaoDeVariavelIdentificador
              )
            : undefined
          this.vars.push({ ...dv, ...v, valor: this.valorDaVariavel(v) })
        }
      )
    }
  },
  computed: {
    params() {
      if (!this.vars) return undefined
      const map = {}
      this.vars.forEach((v) => {
        map[v.definicaoDeVariavelIdentificador] = v.valor
      })
      return UtilsBL.encodeFormParams(map)
    },
  },
  methods: {
    onlyLettersAndNumbers(sigla) {
      return UtilsBL.onlyLettersAndNumbers(sigla)
    },
    valorDaVariavel(v) {
      if (!v) return undefined
      if (v.variavelValorString !== undefined) return v.variavelValorString
      if (v.variavelValorDate !== undefined) return v.variavelValorDate
      if (v.variavelValorBoolean !== undefined) return v.variavelValorBoolean
      if (v.variavelValorNumber !== undefined) return v.variavelValorNumber
      return undefined
    },
    async continuar(idx) {
      try {
        await this.$axios.$post(
          `sigawf/api/v1/procedimentos/${this.onlyLettersAndNumbers(
            this.procedimento.sigla
          )}/continuar`,
          { indiceDoDesvio: idx, variaveis: this.params }
        )
        this.$parent.$nuxt.refresh()
      } catch (ex) {}
    },
  },
}
</script>

<style scoped>
a.link-white {
  color: white;
  text-decoration: underline;
}
</style>
