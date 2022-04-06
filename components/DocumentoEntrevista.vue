<script>
import Vue from "vue";
import CKEditor from "ckeditor4-vue";

export default {
  name: "Entrevista",
  components: {
    ckeditor: CKEditor.component,
  },
  props: {
    entrevista: { required: true },
  },
  data() {
    return {
      msg: "hello",
      template: undefined,
      templateRenderFns: [],
    };
  },
  watch: {
    entrevista() {
      if (this.entrevista) {
        // console.log(this.entrevista);
        const compiled = Vue.compile("<div>" + this.entrevista + "</div>");
        this.template = compiled.render;
        this._staticTrees = [];
        this.$options.staticRenderFns.length = 0;
        for (const i in compiled.staticRenderFns) {
          this.$options.staticRenderFns.push(compiled.staticRenderFns[i]);
        }
        // this.renderMethodFromMethods();
      } else this.compiled = undefined;
    },
  },
  methods: {
    setHidden(name, value) {
      // console.log(name);
      // console.log(value);
      this.$refs["hidden_" + name].value = value;
    },
  },
  render(createElement) {
    if (!this.template) {
      return createElement("div", "");
    } else {
      return this.template();
    }
  },
  staticRenderFns: [],
};
</script>
