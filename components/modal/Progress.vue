<template>
  <div>
    <b-modal
      id="progressModal"
      v-model="showModal"
      :title="title"
      no-close-on-backdrop
      ok-title="Cancelar"
      ok-only
      hide-header-close
      no-close-on-esc
    >
      <p>{{ progressbarCaption }}</p>
      <div class="progress">
        <div
          id="progressbar-ad"
          class="progress-bar"
          role="progressbar"
          aria-valuenow="{progressbarWidth}"
          aria-valuemin="0"
          aria-valuemax="100"
          :style="{ width: progressbarWidth + '%' }"
        >
          <span class="sr-only"></span>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
// import bModal from 'bootstrap-vue/es/components/modal/modal'

export default {
  name: "ProgressBar",
  // props: [
  //   'title',
  //   'caption',
  //   'total',
  //   'block'
  // ],

  data() {
    return {
      showModal: false,
      running: false,
      i: 0,
      title: undefined,
      caption: undefined,
      total: undefined,
      callbackNext() {},
      callbackEnd() {},
      progressbarWidth: 0,
      progressbarCaption: undefined,
    };
  },

  mounted() {
    this.i = 0;
    this.proximo();
  },

  methods: {
    start(title, total, callbackNext, callbackEnd) {
      this.title = title;
      this.total = total;
      this.callbackNext = callbackNext;
      this.callbackEnd = callbackEnd;

      if (this.total === 0) {
        this.cancel();
        return;
      }

      this.showModal = this.total > 1;
      this.running = true;
      this.i = 0;
      this.proximo();
    },

    cancel() {
      this.showModal = false;
      this.running = false;
    },

    next(result) {
      if (!this.running) return;
      this.i++;
      if (this.i >= this.total) {
        this.cancel();
        if (this.callbackEnd) this.callbackEnd(result);
        return;
      }
      this.$nextTick(this.proximo);
    },

    proximo() {
      this.callbackNext(this.i);
      this.progressbarWidth = 100 * (this.i / this.total);
      this.progressbarCaption =
        this.caption + " (" + (this.i + 1) + "/" + this.total + ")";
    },
  },
};
</script>
