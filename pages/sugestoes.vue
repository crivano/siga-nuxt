<template>
  <div class="container content pt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="headline pb-1">
          <h2>Sugestões</h2>
        </div>
        <p>
          Precisamos ouvir sugestões e críticas para que possamos evoluir. Para
          enviá-las, basta preencher o formulário abaixo e clicar em "Enviar
          mensagem".
        </p>
        <br />
        <validation-observer v-slot="{ invalid }">
          <form class="css-form" role="form">
            <div class="row">
              <div class="col-lg-6">
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  :immediate="true"
                >
                  <label for="nome">Nome</label>
                  <input
                    id="nome"
                    v-model="sugestao.nome"
                    type="text"
                    class="form-control"
                    name="nome"
                    placeholder=""
                  />
                  <span
                    v-if="false"
                    v-show="errors.length > 0"
                    class="help is-danger"
                    >{{ errors[0] }}</span
                  >
                </validation-provider>
              </div>
              <div class="col-lg-6">
                <validation-provider
                  v-slot="{ errors }"
                  rules="required|email"
                  :immediate="true"
                >
                  <label for="email">Email</label>
                  <input
                    id="email"
                    v-model="sugestao.email"
                    type="email"
                    class="form-control"
                    name="email"
                    placeholder=""
                  />
                  <span
                    v-if="false"
                    v-show="errors.length > 0"
                    class="help is-danger"
                    >{{ errors[0] }}</span
                  >
                </validation-provider>
              </div>
            </div>

            <div class="row mt-4">
              <div class="col-lg-12">
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  :immediate="true"
                >
                  <label for="nome">Mensagem</label>
                  <textarea
                    id="nome"
                    v-model="sugestao.mensagem"
                    rows="4"
                    class="form-control"
                    name="mensagem"
                    placeholder=""
                  >
                  </textarea>
                  <span
                    v-if="false"
                    v-show="errors.length > 0"
                    class="help is-danger"
                    >{{ errors[0] }}</span
                  >
                </validation-provider>
              </div>
            </div>
            <div class="form-group">
              <div class="row mt-4">
                <div class="col-lg-12">
                  <button
                    class="btn btn-primary float-right"
                    :disabled="invalid"
                    @click.prevent="sugerir()"
                  >
                    Enviar mensagem
                  </button>
                </div>
              </div>
            </div>
          </form>
        </validation-observer>
      </div>
      <!--/row-->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sugestao: {
        nome: undefined,
        email: undefined,
        mensagem: undefined,
      },
    }
  },

  methods: {
    async sugerir() {
      try {
        await this.$axios.$post('sigaex/api/v1/sugestao', this.sugestao)
        this.$root.$emit(
          'message',
          'Sucesso',
          'Sua mensagem foi enviada. Muito obrigado!'
        )
        this.sugestao.nome = undefined
        this.sugestao.email = undefined
        this.sugestao.mensagem = undefined
      } catch (ex) {}
    },
  },
}
</script>
