<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Paginator, { type PageState } from 'primevue/paginator'
import { useFinancingStore } from '../../application/financing.store'
import type { Simulation } from '../../domain/simulation.entity'
import SimulationHistoryCard from '../components/simulation-history-card.vue'
import SimulationSummaryCard from '../components/simulation-summary-card.vue'
import PaymentScheduleTable from '../components/payment-schedule-table.vue'

const { t } = useI18n()
const router = useRouter()
const financingStore = useFinancingStore()

const showDetailModal = ref<boolean>(false)
const selectedSimulation = ref<Simulation | null>(null)

onMounted(() => {
  financingStore.fetchSimulations()
})

const onPageChange = (event: PageState) => {
  financingStore.fetchSimulations(event.page, event.rows)
}

const handleViewDetail = (simulation: Simulation) => {
  selectedSimulation.value = simulation
  showDetailModal.value = true
}

const handleDelete = async (id: string) => {
  await financingStore.deleteSimulation(id)
}

const goToNewSimulation = () => {
  router.push({ name: 'simulations' })
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
            <i class="pi pi-history"></i>
            {{ t('financing.historyBadge') }}
          </div>
          <h1 class="text-3xl font-black tracking-tight sm:text-4xl text-white">
            {{ t('financing.historyTitle') }}
          </h1>
          <p class="mt-2 text-sm text-emerald-100/80 leading-relaxed">
            {{ t('financing.historySubtitle') }}
          </p>
        </div>

        <div>
          <Button
            :label="t('financing.newSimulationBtn')"
            icon="pi pi-plus"
            severity="success"
            class="!rounded-2xl px-6 py-3 font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 border-none"
            @click="goToNewSimulation"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="financingStore.isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">{{ t('financing.loadingHistoryText') }}</p>
    </div>

    <!-- Empty History State -->
    <div
      v-else-if="!financingStore.hasSimulations"
      class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center"
    >
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-4">
        <i class="pi pi-calculator text-2xl"></i>
      </div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">
        {{ t('financing.emptyHistoryTitle') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
        {{ t('financing.emptyHistorySubtitle') }}
      </p>
      <Button
        :label="t('financing.newSimulationBtn')"
        icon="pi pi-plus"
        severity="success"
        class="mt-6 rounded-xl !text-xs px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        @click="goToNewSimulation"
      />
    </div>

    <!-- Simulations Grid -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <SimulationHistoryCard
        v-for="item in financingStore.simulations"
        :key="item.id"
        :simulation="item"
        @view-detail="handleViewDetail"
        @delete="handleDelete"
      />
    </div>

    <!-- Pagination -->
    <div v-if="financingStore.totalPages > 1" class="flex justify-center pt-4">
      <Paginator
        :rows="financingStore.pageSize"
        :totalRecords="financingStore.totalElements"
        :first="financingStore.currentPage * financingStore.pageSize"
        class="!bg-transparent"
        @page="onPageChange"
      />
    </div>

    <!-- Detail Modal -->
    <Dialog
      v-model:visible="showDetailModal"
      modal
      :header="selectedSimulation?.title || t('financing.detailDialogHeader')"
      :style="{ width: '95vw', maxWidth: '1100px' }"
      class="!rounded-3xl"
    >
      <div v-if="selectedSimulation" class="space-y-6 pt-2">
        <SimulationSummaryCard :simulation="selectedSimulation" />
        <PaymentScheduleTable
          :schedule="selectedSimulation.schedule"
          :currencySymbol="selectedSimulation.currencySymbol"
        />
      </div>
    </Dialog>
  </div>
</template>
