<template>
  <div class="foot">
    <span :title="$store.state.test.timestamp"
      >v{{ $store.state.test.version }}</span
    >
  </div>
</template>

<style scoped>
div.foot {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
}

div.foot span {
  font-size: 80%;
  color: #ccc;
  border-top: 1px solid #ccc;
  float: right;
  margin-right: 0.5em;
  margin-bottom: 0.3em;
}
</style>
