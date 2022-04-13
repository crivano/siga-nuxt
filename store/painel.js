import UtilsBL from "../bl/utils.js";

const localizarItemNaLista = function(a, escopo, id) {
    for (let i = 0; i < a.length; i++) {
        if (a[i].escopo === escopo && a[i].id === id) return a[i]
        if (a[i].filhos) {
            const sub = localizarItemNaLista(a[i].filhos, escopo, id)
            if (sub) return sub
        }
    }
    return undefined
}

export const state = () => ({
    primeiraCarga: true,
    quadro: undefined,
    lista: undefined,
    marcaIdChecked: {},
    listaMarcaIdChecked: [],
    qtd: undefined,
    marcadorId: undefined,
    grupoId: undefined,
    tipoId: undefined,
    pessoaOuLotacao: undefined,
    tab: undefined,
    item: undefined,
    qtds: 'RESUMIDO',
    itensPorPagina: 50,
    pagina: 1,
    tiposDeMarca: [
        { id: 'SIGA_EX', nome: 'Documentos', modulo: 'sigaex' },
        { id: 'SIGA_SR', nome: 'Serviços', modulo: 'sigasr' },
        { id: 'SIGA_GC', nome: 'Conhecimentos', modulo: 'sigagc' },
        { id: 'SIGA_WF', nome: 'Procedimentos', modulo: 'sigawf' },
    ]
})

export const getters = {
    listDeQuantidades(state) {
        if (state.qtds === 'DETALHADO')
            return [
                { icone: 'user', filtro: 'PESSOA' },
                { icone: 'users', filtro: 'LOTACAO' },
                { icone: 'user-slash', filtro: 'NAO_ATRIBUIDO' }
            ]
        else
            return [{ icone: 'folder-open', filtro: 'TOTAL' }];
    },
    mapTiposDeMarca(state) {
        const r = {}
        for (let i = 0; i < state.tiposDeMarca.length; i++) {
            const tm = state.tiposDeMarca[i]
            r[tm.id] = tm
        }
        return r
    },
    arvore(state, getters) {
        // const sumQtd = function (a) {
        //   if (!a.qtd) return 0
        //   return a.qtd.TOTAL
        // }
        // const compareQtd = function (a, b) {
        //   return sumQtd(b) - sumQtd(a)
        // }
        const addQtd = function(qtd, para) {
            if (para.qtd[qtd.filtro] === undefined) para.qtd[qtd.filtro] = 0
            para.qtd[qtd.filtro] += parseInt(qtd.qtd)

            if (para.qtd[qtd.tipo] === undefined) para.qtd[qtd.tipo] = 0
            para.qtd[qtd.tipo] += parseInt(qtd.qtd)

            const key = qtd.filtro + ':' + qtd.tipo
            if (para.qtd[key] === undefined) para.qtd[key] = 0
            para.qtd[key] += parseInt(qtd.qtd)
        }

        if (!state.quadro) return []
        const r = []

        const todos = {
            escopo: 'TUDO',
            id: undefined,
            nome: 'Tudo',
            qtd: {},
            filho: {},
        }

        r.push(todos)

        let tipo
        let grupo
            // let marcador
        for (let i = 0; i < state.quadro.length; i++) {
            const x = {
                ...state.quadro[i],
                escopo: 'MARCADOR',
                id: state.quadro[i].marcadorId,
                nome: state.quadro[i].marcadorNome,
                qtd: {},
            }

            // se não existir um este "tipo" no resultado, incluir
            if (x.tipoId && (!tipo || tipo.id !== x.tipoId)) {
                tipo = {
                    escopo: 'TIPO',
                    id: x.tipoId,
                    nome: x.tipoNome,
                    qtd: {},
                    filhos: [],
                }
                r.push(tipo)
            }

            // se não existir um filho de "tipo" que represente esse grupo, incluir
            if (tipo.filhos.length === 0 || grupo.id !== x.grupoId) {
                grupo = {
                    escopo: 'GRUPO',
                    id: x.grupoId,
                    nome: x.grupoNome,
                    qtds: [],
                    qtd: {},
                    filhos: [],
                }
                tipo.filhos.push(grupo)
            }

            // se não existir um filho de "grupo" que represente esse marcador, incluir
            // if (grupo.filhos.length === 0 || marcador.id !== x.grupoId) {
            //   grupo = {
            //     escopo: 'GRUPO',
            //     id: x.grupoId,
            //     nome: x.grupoNome,
            //     qtds: [],
            //     qtd: {},
            //     filhos: [],
            //   }
            //   tipo.filhos.push(grupo)
            // }

            if (x.qtds) {
                for (let q = 0; q < x.qtds.length; q++) {
                    const qtd = x.qtds[q]

                    // se não existir um filho de "todos" que represente esse tipoDeMarca, incluir
                    // if (!todos.filho[qtd.tipo]) {
                    //   const tipoDaMarca = {
                    //     escopo: 'TIPO_MARCA',
                    //     id: qtd.tipo,
                    //     nome: getters.mapTiposDeMarca[qtd.tipo].nome,
                    //     qtd: {},
                    //   }
                    //   todos.filhos.push(tipoDaMarca)
                    //   todos.filho[qtd.tipo] = tipoDaMarca
                    // }

                    addQtd(qtd, x)
                    addQtd(qtd, grupo)
                    addQtd(qtd, tipo)
                        // addQtd(qtd, todos.filho[qtd.tipo])
                    addQtd(qtd, todos)
                }
            }
            // grupo.qtds[]
            // grupo.qtdAtendente += parseInt(x.qtdAtendente)
            // grupo.qtdLotaAtendente += parseInt(x.qtdLotaAtendente)
            grupo.filhos.push(x)
        }

        // todos.filhos.sort((a, b) => compareQtd(a, b))

        return r
    },

    caixaDeEntradaItem(state, getters) {
        // console.log('caixaDeEntradaItem')
        if (!getters.arvore) return undefined

        function localizarCaixaDeEntradaItem(a) {
            for (let i = 0; i < a.length; i++) {
                // console.log(' - ' + a[i].escopo + ' - ' + a[i].id)
                if (a[i].escopo === 'GRUPO' && a[i].id === 'CAIXA_DE_ENTRADA') return a[i]
                if (a[i].filhos) {
                    const sub = localizarCaixaDeEntradaItem(a[i].filhos)
                    if (sub) return sub
                }
            }
            return undefined
        }
        return localizarCaixaDeEntradaItem(getters.arvore)
    },

    itemNaLista(state, getters) {
        if (!getters.arvore || !state.item) return undefined
        return localizarItemNaLista(getters.arvore, state.item.escopo, state.item.id)
    },

    marcadoresId(state) {
        if (!state.item || state.item.tipo === 'TUDO') return ''
        const marcadores = {}
        const add = function(item) {
            if (item.escopo === 'MARCADOR') marcadores[item.id] = 1
            if (item.filhos) item.filhos.forEach(e => add(e))
        }
        add(state.item)
        return Object.keys(marcadores).join()
    },


}

export const mutations = {
    setPrimeiraCarga(state, val) {
        state.primeiraCarga = val
    },
    setQuadro(state, val) {
        state.quadro = val
    },
    setLista(state, val) {
        state.lista = val
    },
    toogleMarcaIdChecked(state, val) {
        state.marcaIdChecked[val.marcaId] = val.value
        if (val.value) state.listaMarcaIdChecked.push(val.marcaId)
        else {
            const index = state.listaMarcaIdChecked.indexOf(val.marcaId);
            if (index !== -1) {
                state.listaMarcaIdChecked.splice(index, 1);
            }
        }
    },
    setQtd(state, val) {
        state.qtd = val
    },
    setMarcadorId(state, val) {
        state.marcadorId = val
    },
    setGrupoId(state, val) {
        state.grupoId = val
    },
    setTipoId(state, val) {
        state.tipoId = val
    },
    setPessoaOuLotacao(state, val) {
        state.pessoaOuLotacao = val
    },
    setFiltro(state, val) {
        state.filtro = val
    },
    setTab(state, val) {
        state.tab = val
    },
    setItem(state, val) {
        state.item = val
    },
    setQtds(state, val) {
        state.qtds = val
    },
    setPagina(state, val) {
        state.pagina = val
    }
}

export const actions = {
    async iniciar({
        state,
        dispatch
    }) {
        if (!state.quadro)
            await dispatch('carregarQuadro')
        else
            dispatch('carregarQuadro')
    },

    async carregarQuadro({
        state,
        getters,
        commit,
        dispatch
    }, val) {
        try {
            const data = await this.$axios.$get(
                `siga/api/v1/painel/quadro?estilo=Agrupados&tipoMarca=${state.tab ? state.tab : ''}`
            )
            const l = data.list.filter(
                (i) =>
                i.marcadorId !== 9 &&
                i.marcadorId !== 8 &&
                i.marcadorId !== 10 &&
                i.marcadorId !== 11 &&
                i.marcadorId !== 12 &&
                i.marcadorId !== 13 &&
                i.marcadorId !== 16 &&
                i.marcadorId !== 18 &&
                i.marcadorId !== 20 &&
                i.marcadorId !== 21 &&
                i.marcadorId !== 22 &&
                i.marcadorId !== 26 &&
                i.marcadorId !== 32 &&
                i.marcadorId !== 62 &&
                i.marcadorId !== 63 &&
                i.marcadorId !== 64 &&
                i.marcadorId !== 7 &&
                i.marcadorId !== 50 &&
                i.marcadorId !== 51
            )
            commit('setPrimeiraCarga', false)
            commit('setQuadro', l)
            await dispatch('ajustarSelecaoDeItem')
        } catch (ex) {}
    },

    async ajustarSelecaoDeItem({
        state,
        getters,
        commit,
        dispatch
    }) {
        // console.log('ajustarSelecaoDeItem')

        commit('setItem', getters.itemNaLista)
        if (state.item) {

            for (const f of getters.listDeQuantidades)
                if (state.pessoaOuLotacao === f.filtro && state.item.qtd[f.filtro]) {
                    // Encontrei o estado atual nos filtros exigidos, entào não preciso fazer mais nada
                    return false
                }
            for (const f of getters.listDeQuantidades)
                if (state.item.qtd[f.filtro]) {
                    // Encontrei o estado item atual, mas tive que trocar o filtro de pessoa/lotação
                    commit('setPessoaOuLotacao', f.filtro)
                    await dispatch('trocarItemEFiltro', { item: state.item, filtro: f.filtro })
                    return true
                }
                // Limpar o state.item para forçar uma reinicialização
            commit('setItem', undefined)
        }
        if (!state.item && getters.arvore) {
            for (const i of getters.arvore)
                for (const f of getters.listDeQuantidades) {
                    if (i.qtd[f.filtro]) {
                        await dispatch('trocarItemEFiltro', { item: i, filtro: f.filtro })
                        return true
                    }
                }
        }
    },

    async carregarLista({
        state,
        getters,
        commit,
        dispatch
    }, token) {
        // console.log("vou carregar a lista")
        commit('setLista', undefined)
        const url = `siga/api/v1/painel/lista?idMarcadores=${getters.marcadoresId}&filtroPessoaLotacao=${state.pessoaOuLotacao}&tipoMarca=${state.tab ? state.tab : ''}&itensPorPagina=${state.itensPorPagina}&pagina=${state.pagina}`
        try {
            const data = await this.$axios.$get(url)
            const l = data.list
            const marcasPorModulo = {}
            l.forEach((i) => {
                i.siglaCompacta = UtilsBL.onlyLettersAndNumbers(i.sigla)
                i.marcaData = UtilsBL.formatDDMMYYYY(i.marcaData)
                i.dataIniFormatada = UtilsBL.formatDDMMYYHHMM(i.dataIni)
                i.tipo = undefined
                if (!marcasPorModulo[i.moduloId])
                    marcasPorModulo[i.moduloId] = []
                marcasPorModulo[i.moduloId].push(i.marcaId)
            })
            commit('setLista', l)
            Object.entries(marcasPorModulo).forEach(([key, value]) => { dispatch('complementarLista', { moduloId: key, idMarcas: value }) })
        } catch (ex) {}
    },

    async complementarLista({
        state,
        commit
    }, val) {
        console.log("vou complementar a lista")

        const url = state.tiposDeMarca[val.moduloId - 1].modulo + '/api/v1/painel/lista?idMarcas=' + val.idMarcas.join(',')

        try {
            const data = await this.$axios.$get(url)
            const l = data.list

            // Clona state.lista
            const lista = []
            state.lista.forEach(
                e => lista.push({
                    ...e
                })
            )

            // Cria um mapa com cada uma das marcas do resultado
            const map = {}
            l.forEach(
                e => (map[e.marcaId] = e)
            )

            for (let i = 0; i < lista.length; i++) {
                const r = map[lista[i].marcaId]
                if (r) lista[i] = {...lista[i], ...r }
            }

            commit('setLista', lista)
        } catch (ex) {}
    },


    async trocarItemEFiltro({
        state,
        commit,
        dispatch
    }, val) {
        // if (state.item !== val.item) {
        commit('setItem', val.item)
        if (val.item.escopo === 'MARCADOR') {
            commit('setMarcadorId', val.item.id)
            if (state.grupoId) commit('setGrupoId', undefined)
            if (state.tipoId) commit('setTipoId', undefined)
        } else if (val.item.escopo === 'GRUPO') {
            commit('setGrupoId', val.item.id)
            if (state.marcadorId) commit('setMarcadorId', undefined)
            if (state.tipoId) commit('setTipoId', undefined)
        } else if (val.item.escopo === 'TIPO') {
            commit('setTipoId', val.item.id)
            if (state.marcadorId) commit('setMarcadorId', undefined)
            if (state.grupoId) commit('setGrupoId', undefined)
        }
        // }
        commit('setPessoaOuLotacao', val.filtro)
        commit('setQtd', val.item.qtd[val.filtro])
        commit('setPagina', 1)
        await dispatch('ajustarSelecaoDeItem')
        await dispatch('carregarLista')
    },

    async trocarFiltroDePessoaOuLotacao({
        state,
        commit,
        dispatch
    }, val) {
        commit('setQtds', val)
        if (!await dispatch('ajustarSelecaoDeItem')) {
            commit('setPagina', 1)
            await dispatch('carregarLista')
        }
    },

    async trocarTab({
        state,
        commit,
        dispatch
    }, val) {
        commit('setTab', val)
            // await dispatch('carregarQuadro')
        commit('setPagina', 1)
        await dispatch('carregarLista')
    },

    async trocarPagina({
        state,
        commit,
        dispatch
    }, val) {
        commit('setPagina', val)
        await dispatch('ajustarSelecaoDeItem')
        await dispatch('carregarLista')
    }
}