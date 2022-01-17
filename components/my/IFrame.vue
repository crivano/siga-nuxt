<template>
  <div id="paipainel" ref="myIFrame" :style="{ height: height + 'px' }">
    <iframe
      id="painel"
      style="
        visibility: visible;
        margin: 0;
        padding: 0;
        min-height: 20em;
        display: block;
      "
      name="painel"
      :src="src"
      align="right"
      width="100%"
      frameborder="0"
      scrolling="auto"
      height="100%"
    ></iframe>
  </div>
</template>

<script>
export default {
  props: ['src'],
  data() {
    return {
      top: 0,
      window: {
        width: 0,
        height: 0,
      },
    }
  },
  computed: {
    height() {
      return this.window.height - this.top
    },
  },
  // Aqui antes era created()
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.$nextTick(this.handleResize)
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.top = this.$refs.myIFrame.getBoundingClientRect().top
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
    },
  },
}
</script>
