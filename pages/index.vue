<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    this.$router.push({
      name: this.$store.state.home
    })
  }
}
</script>
