<template>
  <div class="card bg-light mb-3" v-if="dot">
    <div class="card-header">{{ titulo }}</div>
    <div class="card-body" v-html="svg"></div>
  </div>
</template>
<script>
export default {
  props: {
    dot: { type: String, required: false },
    titulo: { type: String, required: true },
  },
  data() {
    return { svg: undefined }
  },
  async fetch() {
    // if ($store.state.test.properties['vizservice.url']) {
    this.svg = await this.computeGraph(this.dot)
  },
  methods: {
    async computeGraph(dot) {
      if (!dot) return
      try {
        const data = await this.$axios.$post(
          'siga/public/app/graphviz/svg',
          'digraph G { graph[tooltip="Tramitação"] ' + dot + '}',
          {
            headers: { 'Content-Type': 'text/vnd.graphviz' },
            withCredentials: false,
          }
        )
        if (!data) return
        let result = data.replace(
          /width="\d+pt" height="\d+pt"/gm,
          'style="left:0; top:0; width:100%; height:12em; display:block; margin: auto;"'
        )
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
