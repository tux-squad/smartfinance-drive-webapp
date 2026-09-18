<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Tag from 'primevue/tag'
import type { Simulation } from '../../domain/simulation.entity'

const props = defineProps<{
  simulation: Simulation
}>()

const { t } = useI18n()
</script>

<template>
  <div class="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 p-6 text-white shadow-2xl relative overflow-hidden space-y-6">
    <!-- Glowing background accent -->
    <div class="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

    <!-- Title Header -->
    <div class="flex items-center justify-between border-b border-emerald-500/20 pb-4">
      <div>
        <Tag
          :value="t('financing.simulationResultBadge')"
          severity="success"
          class="!text-xs font-bold px-3 py-1 rounded-full mb-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
        />
        <h2 class="text-xl font-black text-white tracking-tight">
          {{ simulation.title }}
        </h2>
      </div>

      <div class="text-right">
        <span class="text-xs text-emerald-300/80 block font-medium">{{ t('financing.tceaLabel') }}</span>
        <span class="text-2xl font-black text-emerald-400 drop-shadow-md">
          {{ simulation.formattedTcea }}
        </span>
      </div>
    </div>

    <!-- Main Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Monthly Payment -->
      <div class="rounded-2xl bg-white/5 p-4 backdrop-blur-md border border-white/10">
        <span class="text-xs font-semibold text-emerald-200/80 block mb-1">
          {{ t('financing.monthlyPaymentLabel') }}
        </span>
        <span class="text-2xl font-black text-white">
          {{ simulation.formattedMonthlyPayment }}
        </span>
      </div>

      <!-- Loan Amount -->
      <div class="rounded-2xl bg-white/5 p-4 backdrop-blur-md border border-white/10">
        <span class="text-xs font-semibold text-emerald-200/80 block mb-1">
          {{ t('financing.loanAmountLabel') }}
        </span>
        <span class="text-xl font-bold text-white">
          {{ simulation.formattedLoanAmount }}
        </span>
      </div>

      <!-- Term & Rate -->
      <div class="rounded-2xl bg-white/5 p-4 backdrop-blur-md border border-white/10">
        <span class="text-xs font-semibold text-emerald-200/80 block mb-1">
          {{ t('financing.termAndRateLabel') }}
        </span>
        <span class="text-sm font-bold text-white block">
          {{ simulation.loanTermMonths }} {{ t('financing.monthsLabel') }} @ {{ simulation.annualEffectiveRate }}% TEA
        </span>
      </div>

      <!-- NPV & IRR -->
      <div class="rounded-2xl bg-white/5 p-4 backdrop-blur-md border border-white/10">
        <span class="text-xs font-semibold text-emerald-200/80 block mb-1">
          {{ t('financing.financialMetricsLabel') }}
        </span>
        <span class="text-xs text-emerald-100 font-mono block">
          VAN: {{ simulation.currencySymbol }} {{ simulation.npv.toFixed(2) }}
        </span>
        <span class="text-xs text-emerald-100 font-mono block">
          TIR: {{ simulation.irr.toFixed(2) }}%
        </span>
      </div>
    </div>
  </div>
</template>
