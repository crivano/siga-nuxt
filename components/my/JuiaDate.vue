<template>
  <div>
    <v-date-picker v-if="true" locale="pt" mode="single" v-model="mymodel" />

    <validation-provider
      :rules="validate"
      :immediate="immediate"
      v-slot="{ errors }"
      ref="vp"
    >
      <input
        type="hidden"
        class="form-control xmyinput"
        :class="{ 'is-invalid': errors.length > 0 }"
        v-bind:value="value"
      />
      <div
        class="invalid-feedback"
        v-if="errors[0] != 'X Preenchimento obrigatório'"
      >
        {{ errors[0] }}
      </div>
    </validation-provider>
  </div>
</template>

<script>
// import { mask } from "vue-the-mask";
export default {
  data() {
    return {
      test: undefined,
    }
  },
  mounted() {
    this.$on('change', () => {
      this.$refs.vp
        .validate()
        .then((r) => this.$emit(r.valid ? 'valid' : 'invalid'))
    })
  },
  computed: {
    mymodel: {
      get() {
        console.log('get')
        if (!this.value) return null
        const date = new Date(this.value)
        const newDate = new Date()
        newDate.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000)
        return newDate
      },
      set(d) {
        this.$emit('input', this.format(d))
      },
    },
  },
  name: 'juia-date',
  props: {
    immediate: { type: Boolean, default: true },
    value: String,
    label: String,
    name: String,
    edit: { type: Boolean, default: true },
    error: String,
    validate: String,
  },
  methods: {
    format(d) {
      if (!d || d === '') return undefined
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year, month, day].join('-')
    },
    //     input: function(e) {
    //       e = this.format(e);
    // //      this.$emit("input", { target: { value: e } });
    //       // this.$emit("input", e);
    //     },
    //     change: function(e) {
    //       e = this.format(e);
    //       this.$emit("change", { target: { value: e } });
    //     },
  },
}
</script>
<style scoped>
.cfg {
  margin-bottom: 0.5em;
}
.myinput {
  background-image: none !important;
}
</style>
