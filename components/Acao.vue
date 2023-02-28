<template>
  <li v-if="exibir" type="button" class="btnx btn-smx d-print-nonex mr-2x mb-2x" :class="{ 'btn-outline-secondary': !!metodo, 'btn-light': !metodo }" @click="clique()">
    <img :src="$axios.defaults.baseURL + '/siga/css/famfamfam/icons/' + acao.icone + '.png'" width="16px" height="16px" class="mr-1 mb-1" title="" />
    {{ nome }}
  </li>
</template>

<script>
import UtilsBL from '../bl/utils.js'

export default {
  props: {
    acao: { type: Object, required: true },
  },
  computed: {
    nome() {
      return this.acao.nome.replace('_', '')
    },
    slug() {
      let s = UtilsBL.slugify(this.acao.nome.replace('_', '')).replace('-', '_')
      if (s.startsWith('desfazer_')) s = 'desfazer'
      return s
    },
    metodo() {
      return this[this.slug]
    },

    numero() {
      return UtilsBL.onlyLettersAndNumbers(this.$parent.numero)
    },
    numeroGeral() {
      const geral = this.$parent.doc.mobs.filter((a) => a.isGeral)[0]
      return UtilsBL.onlyLettersAndNumbers(geral.sigla)
    },
    exibir() {
      return this.metodo || process.env.SHOW_UNIMPLEMENTED_ACTIONS
    },
  },
  methods: {
    clique() {
      if (this.acao.msgConfirmacao) {
        this.$root.$emit('confirmar', 'Confirmação', this.acao.msgConfirmacao, () => {
          this.executar()
        })
      } else this.executar()
    },
    executar() {
      if (this.metodo) this.metodo()
      else this.$root.$emit('message', 'Erro', "Não existe suporte para a ação '" + this.slug + "'")
    },

    emitir(operacao, params, callback) {
      this.$root.$emit(operacao, [{ codigo: this.$parent.numero, sigla: this.$parent.doc.sigla }], callback || this.$parent.reler, params)
    },

    voltarParaDocumento() {
      this.$router.push({
        name: 'documento-numero',
        params: {
          numero: UtilsBL.onlyLettersAndNumbers(this.$parent.mob.sigla),
        },
      })
    },

    irParaDocumento(result) {
      this.$router.push({
        name: 'documento-numero',
        params: { numero: UtilsBL.onlyLettersAndNumbers(result.data.sigla) },
      })
    },

    assinar_anexo() {
      this.emitir(
        'assinarComSenhaMovimentacao',
        {
          idMov: this.$parent.mov.idMov,
        },
        this.voltarParaDocumento
      )
    },

    autenticar_anexo() {
      this.emitir(
        'autenticarComSenhaMovimentacao',
        {
          idMov: this.$parent.mov.idMov,
        },
        this.voltarParaDocumento
      )
    },

    excluir_anexo() {
      this.emitir(
        'excluirMovimentacao',
        {
          idMov: this.$parent.mov.idMov,
        },
        this.voltarParaDocumento
      )
    },

    cancelar_anexo() {
      this.emitir(
        'cancelarMovimentacao',
        {
          idMov: this.$parent.mov.idMov,
        },
        this.voltarParaDocumento
      )
    },

    criar_via() {
      this.emitir('criarVia', undefined, this.irParaDocumento)
    },

    editar() {
      this.$router.push({
        name: 'documento-numero-editar',
        params: { numero: this.numero },
      })
    },

    ver_mais() {
      this.$router.push({
        name: 'documento-numero-auditar',
        params: { numero: this.numeroGeral },
      })
    },

    incluir_documento() {
      this.$router.push({
        name: 'documento-novo',
        params: { siglaMobilPai: this.$parent.mob.sigla },
      })
    },

    autuar() {
      this.$router.push({
        name: 'documento-numero-editar',
        params: { siglaMobilFilho: this.$parent.mob.sigla },
      })
    },

    ver_dossie() {
      this.$router.push({
        name: 'documento-numero-dossie',
        params: {
          numero: UtilsBL.onlyLettersAndNumbers(this.$parent.mob.sigla),
          sigla: this.$parent.mob.sigla,
        },
      })
    },

    excluir() {
      this.emitir('excluir', undefined, () => {
        this.$router.push({
          name: 'painel',
        })
      })
    },

    finalizar() {
      this.emitir('finalizar', undefined, this.irParaDocumento)
    },

    duplicar() {
      this.emitir('duplicar', undefined, this.irParaDocumento)
    },

    refazer() {
      this.emitir('refazer', undefined, this.irParaDocumento)
    },

    receber() {
      this.emitir('receber')
    },

    assinar() {
      this.emitir('assinarComSenha')
    },

    autenticar() {
      this.emitir('autenticarComSenha')
    },

    anotar() {
      this.emitir('anotarModal')
    },

    arq_corrente() {
      this.emitir('arquivarCorrente')
    },

    desarq_corrente() {
      this.emitir('desarquivarCorrente')
    },

    sobrestar() {
      this.emitir('sobrestar')
    },

    desobrestar() {
      this.emitir('dessobrestar')
    },

    tramitar() {
      this.emitir('tramitarModal')
    },

    ver_impressao() {
      this.$parent.mostrarCompleto()
    },

    juntar() {
      this.emitir('juntarModal')
    },

    desentranhar() {
      this.emitir('desentranharModal')
    },

    anexar() {
      this.emitir('anexarModal')
    },

    incluir_cossignatario() {
      this.emitir('incluirCossignatarioModal')
    },

    vincular() {
      this.emitir('vincularModal')
    },

    apensar() {
      this.emitir('apensarModal')
    },

    desapensar() {
      this.emitir('desapensar')
    },

    cancelar() {
      if (this.acao.acao === 'tornarDocumentoSemEfeito') {
        this.emitir('tornarSemEfeitoModal')
      }
    },

    incluir_copia() {
      this.emitir('incluirCopiaModal')
    },

    desfazer() {
      this.emitir('cancelarMovimentacao', { idMov: '-' })
    },

    definir_marcador() {
      this.emitir('definirMarcadorModal')
    },

    definir_perfil() {
      this.emitir('definirPerfilModal')
    },

    redefinir_acesso() {
      this.emitir('definirAcessoModal')
    },
  },
}
</script>

<style scoped>

ul.blog-tags {
  padding: 0;
}

ul.blog-tags li {
  font-size: 13px;
  padding: 2px 7px;
  background: #f7f7f7;
  margin: 0 3px 6px 0;
  display: inline-block;
}

li.blog-tags-enabled-false {
  color: #a7a7a7 !important;
}

li.blog-tags-enabled-false i {
  color: #a7a7a7 !important;
}

li.blog-tags-enabled-false:hover {
  background: #e74c3c !important;
}

ul.blog-tags li i {
  color: #666;
}

li.blog-tags-enabled-false:hover i {
  color: #fff !important;
}
ul.blog-tags li:hover {
  background: #72c02c;
}

ul.blog-tags li:hover,
ul.blog-tags li:hover i {
  color: #fff !important;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}

</style>