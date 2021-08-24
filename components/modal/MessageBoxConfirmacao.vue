<template>
  <div>
    <b-modal
      id="messageBoxConfirmacao"
      v-model="showModal"
      :title="title"
      cancel-title="Cancelar"
      ok-title="OK"
      @ok="ok"
    >
      <p>{{ message }}</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "MessageBoxConfirmacao",

  data() {
    return {
      showModal: false,
      title: undefined,
      message: undefined,
      callback: undefined,
    };
  },

  methods: {
    show(title, message, callback) {
      this.title = title;
      this.message = message;
      this.callback = callback;
      this.showModal = true;
    },

    ok() {
      if (this.callback) this.callback();
    },
  },
};
</script>
