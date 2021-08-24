<template>
  <div>
    <validation-observer v-slot="{ invalid }">
      <b-modal
        id="cota"
        ref="modal"
        v-model="showModal"
        :title="titulo"
        hide-header-close
        cancel-title="Cancelar"
        ok-title="Prosseguir"
        :ok-disabled="invalid"
        @ok="save"
      >
        <form>
          <input type="hidden" name="sigla" value="${m.sigla}" />
          <div class="form-group">
            <div class="form-group">
              <div v-if="carregando" class="text-center">
                <div
                  class="spinner-grow text-info text-center"
                  role="status"
                ></div>
              </div>
              <div v-if="!carregando" class="form-group">
                <label for="marcador">Marcador</label>
                <select
                  id="marcador"
                  v-model="idMarcador"
                  name="marcador"
                  class="form-control"
                >
                  <optgroup
                    v-for="grupo in listaAgrupada"
                    :key="grupo.grupo"
                    :label="grupo.grupo"
                  >
                    <option
                      v-for="option in grupo.lista"
                      :key="option.idMarcador"
                      :value="option.idMarcador"
                    >
                      {{ option.nome }}
                    </option>
                  </optgroup>
                </select>
              </div>
              <div v-if="exibirInteressado" class="form-group">
                <label for="marcador">Interessado</label>
                <select
                  id="interessado"
                  v-model="interessado"
                  name="interessado"
                  class="form-control"
                >
                  <option
                    v-if="marcador.interessado.includes('PESSOA')"
                    value="pessoa"
                  >
                    Pessoa
                  </option>
                  <option
                    v-if="marcador.interessado.includes('LOTACAO')"
                    value="lotacao"
                  >
                    Lotacao
                  </option>
                </select>
              </div>
              <div v-if="exibirLotacao" class="form-group">
                <label for="marcador">Lotacao</label>
                <siga:selecao
                  tema="simple"
                  titulo="Lotação:"
                  propriedade="lotaSubscritor"
                  modulo="siga"
                />
              </div>
              <div v-if="exibirPessoa" class="form-group">
                <label for="marcador">Pessoa</label>
                <siga:selecao
                  tema="simple"
                  titulo="Matrícula:"
                  propriedade="subscritor"
                  modulo="siga"
                />
              </div>
              <div
                v-if="
                  marcador &&
                  (marcador.planejada != 'DESATIVADA' ||
                    marcador.limite !== 'DESATIVADA')
                "
                class="form-group row"
              >
                <div
                  v-if="marcador && marcador.planejada != 'DESATIVADA'"
                  class="col col-12 col-md-6"
                >
                  <label for="planejada">Data de Exibição</label>
                  <input
                    id="planejada"
                    name="planejada"
                    class="form-control campoData"
                    onblur="javascript:verifica_data(this,0);"
                    autocomplete="off"
                  />
                </div>
                <div
                  v-if="marcador && marcador.limite != 'DESATIVADA'"
                  class="col col-12 col-md-6"
                >
                  <label for="limite">Prazo Final</label>
                  <input
                    id="limite"
                    name="limite"
                    class="form-control campoData"
                    onblur="javascript:verifica_data(this,0);"
                    autocomplete="off"
                  />
                </div>
              </div>
              <div
                v-if="
                  marcador && marcador.texto && marcador.texto != 'DESATIVADA'
                "
                class="form-group"
              >
                <label for="texto">Texto</label>
                <input id="texto" name="texto" class="form-control" />
              </div>
            </div>
          </div>
        </form>
      </b-modal>
    </validation-observer>
  </div>
</template>

<script>
import UtilsBL from '../../bl/utils.js'

export default {
  name: 'Marcador',

  data() {
    return {
      interessado: undefined,
      idMarcador: undefined,
      lista: [],
      carregando: false,
      primeiraCarga: true,
      showModal: false,
      errormsg: undefined,
      titulo: undefined,
    }
  },

  computed: {
    listaAgrupada() {
      if (!this.lista) return
      const l = []
      for (let i = 0; i < this.lista.length; i++) {
        const m = this.lista[i]
        if (l.length === 0 || l[l.length - 1].grupo !== m.grupo)
          l.push({
            grupo: m.grupo,
            lista: [],
          })
        l[l.length - 1].lista.push(m)
      }
      return l
    },
    marcador() {
      if (!this.idMarcador) return undefined
      for (let i = 0; i < this.lista.length; i++) {
        if (this.lista[i].idMarcador === this.idMarcador) return this.lista[i]
      }
      return undefined
    },
    exibirInteressado() {
      if (!this.marcador) return false
      if (
        this.marcador.interessado &&
        this.marcador.interessado !== 'ATENDENTE'
      )
        return true
      return false
    },
    exibirPessoa() {
      if (!this.marcador || !this.marcador.interessado) return false
      if (this.marcador.interessado === 'PESSOA') return true
      return this.interessado === 'pessoa'
    },
    exibirLotacao() {
      if (!this.marcador || !this.marcador.interessado) return false
      if (this.marcador.interessado === 'LOTACAO') return true
      return this.interessado === 'lotacao'
    },
  },

  mounted() {
    this.errormsg = undefined
  },

  methods: {
    show(documentos, cont, emit, titulo, campo) {
      this.showModal = true
      this.errormsg = undefined
      this.documentos = documentos
      this.mob = null
      this.cont = cont
      this.titulo = titulo
      this.campo = campo
      this.emit = emit
      this.carregar()
    },

    async carregar() {
      this.carregando = true
      const data = await this.$axios.$get(
        'sigaex/api/v1/documentos/' +
          this.documentos[0].codigo +
          '/marcadores-disponiveis'
      )
      this.carregando = false
      this.lista.length = 0
      const resp = data
      for (let i = 0; i < resp.list.length; i++) {
        this.lista.push(this.fixItem(resp.list[i]))
      }
      this.primeiraCarga = false
    },

    fixItem(item) {
      UtilsBL.applyDefauts(item, {
        idMarcador: undefined,
        nome: undefined,
        odd: undefined,
      })
      return item
    },

    cancel(e) {
      e.cancel()
    },

    save() {
      if ((this.idMarcador || '') === '') {
        this.errormsg = 'Marcador deve ser informado.'
        return
      }

      if (this.emit)
        this.$root.$emit(this.emit, this.documentos, this.cont, {
          idMarcador: this.idMarcador,
        })
      this.$refs.modal.hide(true)
    },

    validar() {
      this.$nextTick(() => this.$validator.validateAll())
    },
  },
}
</script>
