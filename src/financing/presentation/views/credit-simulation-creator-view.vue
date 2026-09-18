<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import { useFinancingStore } from '../../application/financing.store'
import SimulationForm from '../components/simulation-form.vue'
import SimulationSummaryCard from '../components/simulation-summary-card.vue'
import PaymentScheduleTable from '../components/payment-schedule-table.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const financingStore = useFinancingStore()

onMounted(async () => {
  if (route.params.id) {
    await financingStore.fetchSimulationById(route.params.id as string)
  }
})

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await financingStore.fetchSimulationById(newId as string)
    } else {
      financingStore.clearCurrentSimulation()
    }
  }
)

const goToHistory = () => {
  router.push({ name: 'simulations-history' })
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md mb-3 border border-emerald-500/30">
            <i class="pi pi-calculator"></i>
            {{ t('financing.headerBadge') }}
          </div>
          <h1 class="text-3xl font-black tracking-tight sm:text-4xl text-white">
            {{ t('financing.headerTitle') }}
          </h1>
          <p class="mt-2 text-sm text-emerald-100/80 leading-relaxed">
            {{ t('financing.headerSubtitle') }}
          </p>
        </div>

        <div>
          <Button
            :label="t('financing.viewHistoryBtn')"
            icon="pi pi-history"
            severity="success"
            outlined
            class="!rounded-2xl px-5 py-3 font-semibold text-white border-white/30 hover:bg-white/10 backdrop-blur-md shadow-lg"
            @click="goToHistory"
          />
        </div>
      </div>
    </div>

    <!-- Form Section -->
    <SimulationForm />

    <!-- Results Section (If Simulation Generated) -->
    <div v-if="financingStore.hasCurrentSimulation && financingStore.currentSimulation" class="space-y-8 pt-4">
      <SimulationSummaryCard :simulation="financingStore.currentSimulation" />
      <PaymentScheduleTable
        :schedule="financingStore.currentSimulation.schedule"
        :currencySymbol="financingStore.currentSimulation.currencySymbol"
      />
    </div>
  </div>
</template>
