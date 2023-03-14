<template>
    <span v-html="formatted"></span>
</template>
<script>
import UtilsBL from '../../bl/utils.js'

export default {
    props: {
        dt: { type: String, required: false },
        nbsp: { type: Boolean, required: false },
    },
    computed: {
        formatted() {
            if (!this.dt) return ''
            let f = UtilsBL.formatJSDDMMYYHHMM(this.dt)
            if (!this.nbsp) f = f.replace("&nbsp;", " ")
            return f
        }
    }
}
</script>
  