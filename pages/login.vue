<template>
  <div class="container content pt-5">
    <div class="row justify-content-center">
      <div class="col col-sm-12 col-md-6">
        <div class="jumbotron d-block mx-auto">
          <h2 class="text-center pb-3">Autenticação</h2>
          <p v-if="errormsg" class="alert alert-danger" role="alert">
            {{ errormsg }}
          </p>
          <form role="form">
            <div class="form-group">
              <label for="username">Usuário</label>
              <input
                id="username"
                v-model="user.username"
                type="text"
                class="form-control"
                placeholder="Username"
                autocorrect="off"
                autocapitalize="none"
              />
            </div>
            <div class="form-group">
              <label for="password">Senha</label>
              <input
                id="password"
                v-model="user.password"
                type="password"
                class="form-control"
                placeholder="Password"
              />
            </div>
            <div class="row pt-3">
              <div class="col">
                <button
                  class="btn btn-primary d-block mx-auto"
                  @click.prevent="login()"
                >
                  Enviar
                </button>
              </div>
            </div>
          </form>
          <!-- <a href="signup()">Click here to Signup</a> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errormsg: undefined,
      user: {},
    }
  },
  methods: {
    async login() {
      await this.$store.dispatch('login', this.user)
    },
  },
}
</script>
