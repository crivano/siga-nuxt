<script>
import UtilsBL from "../../../bl/utils.js";

export default {
  mounted() {
    if (this.$route.params.numero) {
      UtilsBL.redirectToVRaptor('sigasr/app/solicitacao/exibir/' + this.$route.params.numero)
    }
  }
}
</script>