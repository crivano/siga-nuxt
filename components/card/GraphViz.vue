<template>
  <div v-if="dot" class="mb-3">
    <h4>{{ titulo }}</h4>
    <div v-if="!aspecto" v-html="svg"></div>
    <b-aspect v-else :aspect="aspecto">
      <div class="card-body" v-html="svg"></div>
    </b-aspect>
  </div>
</template>
<script>
export default {
  props: {
    dot: { type: String, required: false },
    titulo: { type: String, required: true },
    aspecto: { type: String, required: false },
  },
  data() {
    return { svg: undefined }
  },
  async fetch() {
    // if ($store.state.test.properties['vizservice.url']) {
    this.svg = await this.computeGraph(this.dot)
  },
  watch: {
    async dot(newDot, oldDot) {
      this.svg = await this.computeGraph(newDot)
    },
  },
  methods: {
    async computeGraph(dot) {
      if (!dot) return
      try {
        const data = await this.$axios.$post('siga/public/app/graphviz/svg', 'digraph G { graph[tooltip="Tramitação"] ' + dot + '}', {
          headers: { 'Content-Type': 'text/vnd.graphviz' },
          withCredentials: false,
        })
        if (!data) return
        let result = data.replace(/width="\d+pt" height="\d+pt"/gm, 'style="left:0; top:0; width:100%; height:12em; display:block; margin: auto;"')
        result = result.replace(/<polygon fill="white".+?\/>/gm, '')
        return result
      } catch (ex) {}
    },
  },
}
</script>
<style scoped>
.card-body p {
  margin-bottom: 0.2em;
}
</style>
