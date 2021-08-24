<template>
  <div class="wrapper">
    <!--=== Header ===-->
    <div class="header d-print-none">
      <!-- Navbar -->
      <b-navbar
        toggleable="lg"
        :class="{
          'navbar-dark bg-success':
            $store.state.test.properties['siga.ambiente'] === 'desenv',
          'navbar-dark bg-secondary':
            $store.state.test.properties['siga.ambiente'] === 'homolo',
          'navbar-dark bg-primary':
            $store.state.test.properties['siga.ambiente'] === 'prod',
        }"
      >
        <b-navbar-brand href="#/quadro">
          <img
            id="logo-header"
            src="~assets/logo-siga-novo-38px.png"
            alt="Siga-Le"
            height="38"
          />
          <img
            id="logo-header2"
            class="ml-2"
            src="~assets/trf2-38px-2.png"
            alt="Logo TRF2"
            height="38"
          />
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item
              v-if="!($store.state.jwt &amp;&amp; $store.state.jwt.sub)"
            >
              <router-link
                class="nav-link"
                active-class="active"
                :to="{ name: 'login' }"
                tag="a"
                >Login</router-link
              >
            </b-nav-item>
            <b-nav-item v-if="$store.state.jwt &amp;&amp; $store.state.jwt.sub">
              <router-link
                class="nav-link"
                active-class="active"
                :to="{ name: 'quadro' }"
                tag="a"
                >Quadro</router-link
              >
            </b-nav-item>
            <b-nav-item v-if="$store.state.jwt &amp;&amp; $store.state.jwt.sub">
              <router-link
                class="nav-link"
                active-class="active"
                :to="{ name: 'mesa' }"
                tag="a"
                >Mesa</router-link
              >
            </b-nav-item>
            <b-nav-item>
              <router-link
                class="nav-link"
                active-class="active"
                :to="{ name: 'Sugestões' }"
                tag="a"
                >Sugestões</router-link
              >
            </b-nav-item>
            <b-nav-item>
              <router-link
                class="nav-link"
                active-class="active"
                :to="{ name: 'Sobre' }"
                tag="a"
                >Sobre</router-link
              >
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown
              v-if="$store.state.jwt &amp;&amp; $store.state.jwt.sub"
              :text="$store.state.jwt.sub"
              right
            >
              <template
                v-if="
                  $store.state.usuario &&
                  $store.state.usuario.substituicoesPermitidas
                "
              >
                <b-dropdown-group header="Substituir:"></b-dropdown-group>
                <b-dropdown-item
                  v-for="s in $store.state.usuario.substituicoesPermitidas"
                  :key="s.substituicaoId"
                  @click="substituir(subst)"
                >
                  {{
                    (s.cadastranteId !== s.titularId ? s.titularNome : '') +
                    (s.cadastranteId !== s.titularId &&
                    s.lotaCadastranteId !== s.lotaTitularId
                      ? '/'
                      : '') +
                    (s.lotaCadastranteId !== s.lotaTitularId
                      ? s.lotaTitularNome
                      : '')
                  }}
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
              </template>
              <b-dropdown-item @click="logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-form>
              <b-form-input
                v-model="siglaParaPesquisar"
                size="sm"
                class="mr-sm-2"
                placeholder="Sigla"
              ></b-form-input>
              <b-button
                size="sm"
                class="my-2 my-sm-0"
                type="submit"
                @click="pesquisar"
                >Buscar</b-button
              >
            </b-nav-form>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <!-- End Navbar -->
    </div>
    <!--=== End Header ===-->
  </div>
</template>
<script>
import AuthBL from '../bl/auth.js'
export default {
  data() {
    return { siglaParaPesquisar: undefined }
  },
  async mounted() {
    const test = await this.$axios.$get('sigaex/api/v1/test?skip=all')
    if (test.properties) {
      for (const k in test.properties) {
        if (k in test.properties)
          if (test.properties[k] === '[undefined]')
            test.properties[k] = undefined
          else
            test.properties[k] = test.properties[k].replace(
              /\[default: (.*)\]/gm,
              '$1'
            )
      }

      if (
        test.properties['siga-le.wootric.token'] &&
        test.properties['siga-le.wootric.token'] !== '[undefined]' &&
        this.$store.state.jwt
      ) {
        // This loads the Wootric survey
        // window.wootric_survey_immediately = true
        window.wootricSettings = {
          email: this.jwt.sub,
          account_token: this.test.properties['siga-le.wootric.token'],
        }
        window.wootric('run')
      }

      this.$store.commit('setTest', test)

      let token = AuthBL.getIdToken()
      if (token && AuthBL.isTokenExpired(token)) token = undefined
      this.$store.dispatch('updateLogged', token)
    }
  },
  methods: {
    async pesquisar() {
      const pesq = (this.siglaParaPesquisar || '').replace(/[^a-z0-9]/gi, '')
      const codigo = await this.$axios.$get(
        'sigaex/api/v1/documentos/' + pesq + '/pesquisar-sigla'
      ).codigo
      if (codigo) {
        this.$router.push({
          name: 'Documento',
          params: { numero: codigo },
        })
      }
      this.siglaParaPesquisar = undefined
    },

    logout() {
      delete window.listaDaMesa
      AuthBL.logout()
      this.jwt = {}
      this.$router.push({ name: 'login' })
    },

    substituir() {},
  },
}
</script>
