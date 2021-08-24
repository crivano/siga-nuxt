<template>
  <div class="hello">
    <div class="container-fluid content profile">
      <div v-if="doc">
        <div class="row xd-print-block mt-3 mb-3">
          <div class="col-md-12">
            <h4 class="text-center mb-0">
              Anexo {{ doc.mobs[0].sigla }}:{{ mov ? mov.idMov : '' }}
            </h4>
          </div>
        </div>
        <template v-if="doc">
          <div class="row">
            <div class="col col-12 col-lg-8">
              <my-iframe :src="pdfSource"></my-iframe>
            </div>
            <div class="col col-12 col-lg-4">
              <h4>Ações</h4>
              <span v-for="acao in filteredAcoes" :key="acao.nome">
                <acao :acao="acao" />
              </span>

              <!-- DETALHES -->
              <div class="card bg-light">
                <div class="card-header">Dados da Anexação</div>
                <div class="card-body" style="font-size: 70%">
                  <p><b>Data/hora:</b> {{ mov | {}.dtRegMovDDMMYYHHMMSS }}</p>
                  <p>
                    <b>Cadastrante:</b>
                    {{ mov ? mov.parte.cadastrante.descricao : '' }} /
                    {{ mov ? mov.parte.lotaCadastrante.sigla : '' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Acao from '../components/Acao'

export default {
  name: 'Anexo',

  components: {
    acao: Acao,
  },
  data() {
    return {
      doc: undefined,
      mob: undefined,
      mov: undefined,
    }
  },
  computed: {
    filteredAcoes() {
      if (!this.mov) return undefined
      let acoes = this.mov.acoes
      acoes = acoes.sort((a, b) =>
        a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0
      )
      return acoes.filter((m) => m.pode)
    },
    pdfSource() {
      if (!this.doc || !this.mov) return undefined
      return (
        this.$axios.defaults.baseURL +
        'sigaex/api/v1/documentos/' +
        this.numero +
        ':' +
        this.mov.idMov +
        '/arquivo/produzir?contenttype=application/pdf'
      )
    },
  },
  watch: {
    '$route.params.numero'() {
      this.carregarDocumento(this.$route.params.numero, this.$route.params.id)
    },
    '$route.params.id'() {
      this.carregarDocumento(this.$route.params.numero, this.$route.params.id)
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.carregarDocumento(this.$route.params.numero)
    })
  },
  methods: {
    executar(mov, acao) {
      if (acao.acao === 'exibir') {
        this.$router.push({
          name: 'Documento',
          params: { numero: acao.params.sigla.replace(/[^a-z0-9]/gi, '') },
        })
      }
    },

    async carregarDocumento() {
      this.errormsg = undefined
      this.numero = this.$route.params.numero
      // Validar o número do processo
      this.$root.$emit('block', 20)
      const data = await this.$axios.$get(
        'sigaex/api/v1/documentos/' + this.numero
      )
      this.atualizarDocumento(data)
    },

    atualizarDocumento(data) {
      this.doc = data
      this.mob = this.doc.mobs[0]
      if (!this.mob.isGeral)
        this.numero = this.mob.sigla.replace(/[^a-zA-Z0-9]/gi, '')
      for (let i = 0; i < this.doc.mobs.length; i++) {
        if (this.doc.mobs[i].movs)
          for (let j = 0; j < this.doc.mobs[i].movs.length; j++) {
            if (this.doc.mobs[i].movs[j].idMov === this.$route.params.id) {
              this.mov = this.doc.mobs[i].movs[j]
              if (this.mov.acoes)
                for (let k = 0; k < this.mov.acoes.length; k++) {
                  if (this.mov.acoes[k].nome === 'Assinar/Autenticar') {
                    this.mov.acoes[k].nome = 'Assinar Anexo'
                    this.mov.acoes[k].icone = 'script_key'
                    this.mov.acoes.push({
                      nome: 'Autenticar Anexo',
                      icone: 'script_key',
                      pode: true,
                    })
                  }
                  if (this.mov.acoes[k].nome === 'Excluir') {
                    this.mov.acoes[k].nome = 'Excluir Anexo'
                    this.mov.acoes[k].icone = 'delete'
                  }
                  if (this.mov.acoes[k].nome === 'Cancelar') {
                    this.mov.acoes[k].nome = 'Cancelar Anexo'
                    this.mov.acoes[k].icone = 'delete'
                  }
                }
            }
          }
      }
    },
  },
}
</script>
