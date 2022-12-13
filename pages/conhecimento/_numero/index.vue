<script>
import UtilsBL from "../../../bl/utils.js";

export default {
  mounted() {
    if (this.$route.params.numero) {
      UtilsBL.redirectToVRaptor('sigagc/app/exibir/' + this.$route.params.numero)
    }
  }
}
</script>