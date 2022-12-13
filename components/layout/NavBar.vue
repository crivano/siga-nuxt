<template>
  <div class="wrapper">
    <!--=== Header ===-->
    <div class="header d-print-none">
      <!-- Navbar -->
      <b-navbar
        toggleable="lg"
        :class="{
          'navbar-dark bg-success': $store.state.test.properties['siga.ambiente'] === 'desenv',
          'navbar-dark bg-secondary': $store.state.test.properties['siga.ambiente'] === 'homolo',
          'navbar-dark bg-primary': $store.state.test.properties['siga.ambiente'] === 'prod',
        }"
      >
        <b-navbar-brand href="/quadro">
          <img id="logo-header" src="~assets/logo-siga-novo-38px.png" alt="Siga-Le" height="38" />
          <img id="logo-header2" class="ml-2" src="~assets/trf2-38px-2.png" alt="Logo TRF2" height="38" />
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item v-if="logged">
              <nuxt-link active-class="active" :to="{ name: 'painel' }">Painel</nuxt-link>
            </b-nav-item>

            <b-nav-item-dropdown v-if="$store.state.painel.listaMarcaIdChecked.length">
              <template slot="button-content"><span class="em-lote text-warning">Em Lote</span></template>
              <b-dropdown-item href="#">Assinar</b-dropdown-item>
              <b-dropdown-item href="#">Tramitar</b-dropdown-item>
              <b-dropdown-item href="#">Arquivar</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown v-if="logged">
              <template slot="button-content">Novo</template>
              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active" :to="{ name: 'documento-novo' }">Documento</nuxt-link></b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown v-if="logged" text="Ver">
              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active" :to="{ name: 'quadro' }">Quadro</nuxt-link></b-dropdown-item>
              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active" :to="{ name: 'mesa' }">Mesa</nuxt-link></b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown>
              <template slot="button-content">Ajuda</template>
              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active" :to="{ name: 'sugestoes' }">Sugestões</nuxt-link></b-dropdown-item>
              <b-dropdown-item><nuxt-link class="dropdown-link" active-class="active" :to="{ name: 'sobre' }">Sobre</nuxt-link></b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="$store.getters['painel/caixaDeEntradaItem']">
              <nuxt-link
                active-class="active"
                :to="{
                  name: 'painel',
                  params: { item: $store.getters['painel/caixaDeEntradaItem'] },
                }"
                ><font-awesome-icon :icon="['fa', 'inbox']" class="mr-1" />
                <span
                  class="position-absolute badge rounded-pill bg-danger text-white top-0 start-100 translate-middle"
                  style="margin-top: -0.75em; margin-left: -1em; opacity: 0.75"
                >
                  {{ $store.getters['painel/caixaDeEntradaItem'].qtd.TOTAL }}
                </span>
              </nuxt-link>
            </b-nav-item>
            <b-nav-item v-if="false">
              <nuxt-link active-class="active" :to="{ name: 'painel' }"
                ><font-awesome-icon :icon="['far', 'star']" class="mr-1" /><span
                  class="position-absolute badge rounded-pill bg-light text-dark top-0 start-100 translate-middle"
                  style="margin-top: -0.75em; margin-left: -1em; opacity: 0.75"
                >
                  {{ 5 }}
                </span></nuxt-link
              >
            </b-nav-item>
            <b-nav-item v-if="false">
              <nuxt-link active-class="active" :to="{ name: 'painel' }"
                ><font-awesome-icon :icon="['fa', 'bell']" class="mr-1" /><span
                  class="position-absolute badge rounded-pill bg-light text-dark top-0 start-100 translate-middle"
                  style="margin-top: -0.75em; margin-left: -1em; opacity: 0.75"
                >
                  {{ 5 }}
                </span></nuxt-link
              >
            </b-nav-item>

            <b-nav-item v-if="!logged">
              <router-link active-class="active" :to="{ name: 'login' }" tag="a">Login</router-link>
            </b-nav-item>
            <b-nav-item-dropdown v-if="logged" right>
              <template v-slot:button-content>
                {{ $store.state.usuario.cadastranteSigla }}
                <template v-if="$store.state.usuario && $store.state.usuario.substituicaoId">
                  <font-awesome-icon :icon="['fa', 'arrow-circle-right']" class="mr-1" /><span>{{ descrUsuarioAtivo }}</span>
                </template>
              </template>
              <template v-if="$store.state.usuario && $store.state.usuario.substituicoesPermitidas">
                <template v-if="$store.state.usuario && $store.state.usuario.substituicaoId">
                  <b-dropdown-item @click="substituir()">Interromper Substituição Corrente</b-dropdown-item>
                  <b-dropdown-divider></b-dropdown-divider>
                </template>
                <b-dropdown-group header="Substituir:"></b-dropdown-group>
                <b-dropdown-item
                  v-for="s in $store.state.usuario.substituicoesPermitidas"
                  :key="s.substituicaoId"
                  :disabled="$store.state.usuario.substituicaoId === s.substituicaoId"
                  @click="substituir(s)"
                >
                  {{
                    (s.cadastranteId !== s.titularId ? s.titularNome : '') +
                    (s.cadastranteId !== s.titularId && s.lotaCadastranteId !== s.lotaTitularId ? '/' : '') +
                    (s.lotaCadastranteId !== s.lotaTitularId ? s.lotaTitularNome : '')
                  }}
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
              </template>
              <b-dropdown-item @click="logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-form>
              <b-form-input v-model="siglaParaPesquisar" size="sm" class="mr-sm-2" placeholder="Sigla"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit" @click="pesquisar">Buscar</b-button>
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
export default {
  data() {
    return { siglaParaPesquisar: undefined }
  },
  async mounted() {
    try {
      const test = await this.$axios.$get('sigaex/api/v1/test?skip=all')
      if (test.properties) {
        for (const k in test.properties) {
          if (k in test.properties)
            if (test.properties[k] === '[undefined]') test.properties[k] = undefined
            else test.properties[k] = test.properties[k].replace(/\[default: (.*)\]/gm, '$1')
        }

        if (test.properties['siga-le.wootric.token'] && test.properties['siga-le.wootric.token'] !== '[undefined]' && this.logged) {
          // This loads the Wootric survey
          // window.wootric_survey_immediately = true
          window.wootricSettings = {
            email: this.$store.state.usuario.cadastranteSigla,
            account_token: this.test.properties['siga-le.wootric.token'],
          }
          window.wootric('run')
        }

        this.$store.commit('setTest', test)

        // let token = AuthBL.getIdToken()
        // if (token && AuthBL.isTokenExpired(token)) token = undefined
        this.$store.dispatch('updateLogged') // , token)
      }
    } catch (ex) {}
  },
  methods: {
    async pesquisar() {
      const pesq = (this.siglaParaPesquisar || '').replace(/[^a-z0-9]/gi, '')
      try {
        const codigo = await this.$axios.$get('sigaex/api/v1/documentos/' + pesq + '/pesquisar-sigla').codigo
        if (codigo) {
          this.$router.push({
            name: 'Documento',
            params: { numero: codigo },
          })
        }
      } catch (ex) {}
      this.siglaParaPesquisar = undefined
    },

    logout() {
      delete window.listaDaMesa
      this.$store.dispatch('logout');
      this.$router.push({ name: 'login' })
    },

    async substituir(s) {
      await this.$store.dispatch('substituir', s ? s.substituicaoId : undefined)
      this.$nuxt.refresh()
    },
  },
  computed: {
    descrUsuarioAtivo() {
      if (!this.$store.state.usuario) return
      let s = ''
      if (this.$store.state.usuario.substituicaoId)
        this.$store.state.usuario.substituicoesPermitidas.forEach((element) => {
          if (this.$store.state.usuario.substituicaoId === element.substituicaoId) {
            if (element.titularSigla) s += element.titularSigla
            if (element.titularSigla && element.lotaTitularSigla) s += '/'
            if (element.lotaTitularSigla) s += element.lotaTitularSigla
          }
        })
      return s
    },
    logged() {
      return this.$store.state.usuario && this.$store.state.usuario.cadastranteSigla
    },
  },
}
</script>
<style scoped>
a.nav-link a {
  color: rgba(255, 255, 255, 0.5);
}
a.nav-link a:hover {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.75);
}
a.nav-link a.active {
  color: rgba(255, 255, 255, 1);
}
a.dropdown-link {
  color: #212529;
}
a.dropdown-link:hover {
  text-decoration: none;
  color: #212529;
}
.em-lote {
  color: rgba(255, 255, 255, 1);
  font-weight: bold;
}
</style>