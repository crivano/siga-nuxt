<template>
  <div class="form-group">
    <template v-if="dv.definicaoDeVariavelTipo === 'STRING'">
      <MyInput
        :value="value"
        @input="$emit('input', $event)"
        :label="label"
        :rules="rules"
      />
    </template>
    <template v-if="dv.definicaoDeVariavelTipo === 'DOC_MOBIL'">
      <MyMobil
        :value="value"
        @input="$emit('input', $event)"
        :label="label"
        :rules="rules"
      />
    </template>
    <template v-if="dv.definicaoDeVariavelTipo === 'PESSOA'">
      <MyPessoa
        :value="value"
        @input="$emit('input', $event)"
        :label="label"
        :rules="rules"
      />
    </template>
    <template v-if="dv.definicaoDeVariavelTipo === 'LOTACAO'">
      <MyLotacao
        :value="value"
        @input="$emit('input', $event)"
        :label="label"
        :rules="rules"
      />
    </template>
    <template v-if="dv.definicaoDeVariavelTipo === 'DOUBLE'">
      <MyNumeric
        :value="value"
        @input="$emit('input', $event)"
        :label="label"
        :rules="rules"
      />
    </template>
    <template v-if="dv.definicaoDeVariavelTipo === 'DATE'">
      <MyInput
        :value="value"
        @input="$emit('input', $event)"
        :label="label"
        :rules="rules"
      />
    </template>
    <template v-if="dv.definicaoDeVariavelTipo === 'BOOLEAN'">
      <MyInput
        :value="value"
        @input="$emit('input', $event)"
        :label="label"
        :rules="rules"
      />
    </template>
    <template v-if="dv.definicaoDeVariavelTipo === 'SELECAO'">
      <MySelect
        :value="value"
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
        :label="label"
        :rules="rules"
        :list="list"
      />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    definicaoDeVariavel: { type: Object, required: true },
    variavel: { type: Object, required: false },
    value: { type: Object },
  },
  data() {
    return {
      dv: this.definicaoDeVariavel,
    }
  },
  computed: {
    label() {
      if (this.dv.definicaoDeVariavelTipo === 'SELECAO')
        return this.dv.definicaoDeVariavelNome.substring(
          0,
          this.dv.definicaoDeVariavelNome.indexOf('(')
        )
      else return this.dv.definicaoDeVariavelNome
    },
    list() {
      if (this.dv.definicaoDeVariavelTipo !== 'SELECAO') return
      const nome = this.dv.definicaoDeVariavelNome
      const op = nome.substring(nome.indexOf('(') + 1, nome.length - 1)
      return op.split(';').map((s) => {
        return { id: s, nome: s }
      })
    },
    editable() {
      return (
        this.dv.definicaoDeVariavelAcesso === 'READ_WRITE_REQUIRED' ||
        this.dv.definicaoDeVariavelAcesso === 'READ_WRITE'
      )
    },
    rules() {
      return this.dv.definicaoDeVariavelAcesso === 'READ_WRITE_REQUIRED'
        ? 'required'
        : undefined
    },
  },
}
</script>
