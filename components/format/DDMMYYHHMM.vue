<template>
    <span>{{ formatted }}</span>
</template>
<script>
import UtilsBL from '../../bl/utils.js'

export default {
    props: {
        dt: { type: Date, required: true },
    },
    computed: {
        formatted() {
            return UtilsBL.formatDDMMYYYYHHMM(this.dt)
        }
    }
}
</script>
  