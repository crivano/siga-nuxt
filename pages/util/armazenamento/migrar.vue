<template>
    <div class="container-fluid content profile">
        <div class="row xd-print-block mt-3 mb-3">
            <div class="col-md-12">
                <h4 class="text-center mb-0">Migração de Armazenamento</h4>
            </div>
        </div>
        <p class="mb-1">{{ titulo }}</p>
        <div class="progress">
            <div id="progressbar-ad" class="progress-bar" role="progressbar" aria-valuenow="{progressbarWidth}"
                aria-valuemin="0" aria-valuemax="100" :style="{ width: percentual + '%' }">
                <span class="sr-only"></span>
            </div>
        </div>
        <div v-if="previsao && !concluido" class="float-right">
            <p class="mt-1">Previsão: {{ previsao }}</p>
        </div>
        <div v-if="concluido">
            <p class="mt-3 alert alert-success">Migração Concluída</p>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'ArmazenamentoMigrar',

    data() {
        return {
            i: 0,
            memoriaMigrada: 0,
            quantidadeMigrada: 0,
            quantidadeDeErros: 0,
            memoriaTotal: 0,
            quantidadeTotal: 0,
            referencias: undefined,
            referenciasDeErros: [],
            dataInicial: undefined,
            dataCorrente: undefined,
            concluido: false
        }
    },

    computed: {
        titulo() {
            return `${this.quantidadeMigrada} de ${this.quantidadeTotal} arquivos e ${this.memoriaMigrada} de ${this.memoriaTotal} bytes migrados de TABELA para S3, com ${this.quantidadeDeErros} erros`
        },

        previsao() {
            if (!this.dataCorrente || !this.dataInicial || this.quantidadeTotal === 0 || this.quantidadeMigrada === 0) return undefined
            const ms = Math.abs(this.dataCorrente - this.dataInicial);
            if (ms === 0) return undefined
            const diffMs = ms * (this.quantidadeTotal / this.quantidadeMigrada)
            const diffDays = Math.floor(diffMs / 86400000); // days
            const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            return `${diffDays} dias, ${diffHrs} horas e ${diffMins} minutos até a conclusão`;
        },

        percentual() {
            if (this.quantidadeTotal === 0) return 100
            return Math.round(100 * (this.quantidadeMigrada / this.quantidadeTotal))
        }
    },

    async mounted() {
        const stats = await this.$axios.$get('siga/api/v1/armazenamento/estatisticas?origem=TABELA&destino=S3')
        this.memoriaTotal = stats.memoria
        this.quantidadeTotal = stats.quantidade

        const self = this
        this.$nextTick(() => self.start())
        this.dataInicial = new Date()
    },

    methods: {
        async start() {
            const qtd = 100 + this.quantidadeDeErros
            const resp = await this.$axios.$get(`siga/api/v1/armazenamento/referencias?origem=TABELA&destino=S3&quantidade=${qtd}`)
            this.dataCorrente = new Date()
            this.referencias = resp.list
            this.referencias = this.referencias.filter(item => !this.referenciasDeErros.some(errRef => errRef.id === item.id))
            if (this.referencias.length === 0) {
                this.concluido = true
                return
            }
            this.referencias.forEach((r) => this.migrar(r))
        },

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        },

        async migrar(ref) {
            try {
            const resp = await this.$axios.$post(`siga/api/v1/armazenamento/${ref.id}/migrar?origem=TABELA&destino=S3`)
            this.memoriaMigrada += resp.memoria
            this.quantidadeMigrada += 1
            } catch (e) {
                this.quantidadeDeErros += 1
                this.referenciasDeErros.push(ref)
            }
            this.referencias = this.referencias.filter(item => item !== ref)
            if (this.referencias.length === 0) this.start()
        },
    },
}
</script>
  