<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import type { Simulation } from '../../domain/simulation.entity'
import { useFinancingStore } from '../../application/financing.store'

const props = defineProps<{
  simulation: Simulation
}>()

const { t } = useI18n()
const router = useRouter()
const financingStore = useFinancingStore()
const isApplying = ref(false)
const applySuccess = ref(false)

const handleApply = async () => {
  if (!props.simulation?.id) return
  isApplying.value = true
  try {
    const app = await financingStore.applySimulation(props.simulation.id)
    if (app) {
      applySuccess.value = true
      setTimeout(() => {
        router.push('/reports/applications')
      }, 1000)
    }
  } finally {
    isApplying.value = false
  }
}
</script>

<template>
  <div class="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden space-y-6">
    <!-- Glowing background accent -->
    <div class="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
    <div class="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

    <!-- Title Header -->
    <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <Tag
            :value="t('financing.simulationResultBadge')"
            severity="success"
            class="!text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md"
          />
          <span class="text-xs text-slate-400 font-medium">Método Francés • SBS</span>
        </div>
        <h2 class="text-2xl font-black text-white tracking-tight">
          {{ simulation.title }}
        </h2>
      </div>

      <div class="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center bg-white/5 sm:bg-transparent rounded-2xl p-3 sm:p-0 border border-white/10 sm:border-none">
        <span class="text-xs text-emerald-300/80 font-medium">{{ t('financing.tceaLabel') }}</span>
        <span class="text-3xl font-black font-mono text-emerald-400 drop-shadow-md">
          {{ simulation.formattedTcea }}
        </span>
      </div>
    </div>

    <!-- Main Metrics Bento Grid -->
    <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Monthly Payment (Highlight) -->
      <div class="rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900/90 p-5 backdrop-blur-md border border-emerald-500/30 shadow-inner">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-300/90">
            {{ t('financing.monthlyPaymentLabel') }}
          </span>
          <i class="pi pi-credit-card text-emerald-400"></i>
        </div>
        <div class="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
          {{ simulation.formattedMonthlyPayment }}
        </div>
        <span class="text-[11px] text-emerald-200/70 mt-1 block">Incluye capital, interés y seguros</span>
      </div>

      <!-- Loan Amount -->
      <div class="rounded-2xl bg-white/5 p-5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-slate-300">
            {{ t('financing.loanAmountLabel') }}
          </span>
          <i class="pi pi-dollar text-slate-400"></i>
        </div>
        <div class="text-xl font-bold font-mono text-white">
          {{ simulation.formattedLoanAmount }}
        </div>
        <span class="text-[11px] text-slate-400 mt-1 block">Precio vehículo menos cuota inicial</span>
      </div>

      <!-- Term & Rate -->
      <div class="rounded-2xl bg-white/5 p-5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-slate-300">
            {{ t('financing.termAndRateLabel') }}
          </span>
          <i class="pi pi-clock text-slate-400"></i>
        </div>
        <div class="text-lg font-bold text-white">
          {{ simulation.loanTermMonths }} {{ t('financing.monthsLabel') }}
        </div>
        <span class="text-[11px] text-emerald-300 mt-1 block font-medium">TEA: {{ simulation.annualEffectiveRate }}%</span>
      </div>

      <!-- NPV & IRR (Financial Metrics) -->
      <div class="rounded-2xl bg-white/5 p-5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-slate-300">
            {{ t('financing.financialMetricsLabel') }}
          </span>
          <i class="pi pi-chart-line text-slate-400"></i>
        </div>
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs font-mono text-emerald-200">
            <span>VAN:</span>
            <span class="font-bold">{{ simulation.currencySymbol }} {{ simulation.npv.toFixed(2) }}</span>
          </div>
          <div class="flex items-center justify-between text-xs font-mono text-teal-200">
            <span>TIR:</span>
            <span class="font-bold">{{ simulation.irr.toFixed(2) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Bar: Apply Simulation to Formal Credit Application -->
    <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-emerald-500/20">
      <div class="text-xs text-emerald-100/80 leading-relaxed text-center sm:text-left flex items-center gap-2">
        <i class="pi pi-info-circle text-emerald-400 shrink-0"></i>
        <span>¿Te satisfacen estas cuotas? Postula directamente para convertir esta simulación en una solicitud formal de crédito.</span>
      </div>
      <Button
        :label="applySuccess ? '¡Solicitud enviada!' : 'Solicitar este Crédito'"
        :icon="applySuccess ? 'pi pi-check' : 'pi pi-send'"
        :loading="isApplying"
        class="!rounded-2xl px-6 py-3 font-bold !bg-emerald-500 hover:!bg-emerald-600 text-white border-none shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all shrink-0 w-full sm:w-auto"
        @click="handleApply"
      />
    </div>
  </div>
</template>

