<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import { useProjectionsStore } from '../../application/projections.store'
import DepreciationCalculatorForm from '../components/depreciation-calculator-form.vue'
import DepreciationChart from '../components/depreciation-chart.vue'
import DepreciationTable from '../components/depreciation-table.vue'

const { t } = useI18n()
const projectionsStore = useProjectionsStore()

onMounted(async () => {
  await projectionsStore.fetchHistory()
})

const handleSelectHistoryItem = async (id: string) => {
  await projectionsStore.fetchProjectionById(id)
}

const handleDeleteHistoryItem = async (id: string) => {
  await projectionsStore.deleteProjection(id)
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md mb-3 border border-blue-500/30">
          <i class="pi pi-chart-line"></i>
          {{ t('projections.headerBadge') }}
        </div>
        <h1 class="text-3xl font-black tracking-tight sm:text-4xl text-white">
          {{ t('projections.headerTitle') }}
        </h1>
        <p class="mt-2 text-sm text-blue-100/80 leading-relaxed">
          {{ t('projections.headerSubtitle') }}
        </p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Calculator Form -->
      <div class="lg:col-span-5 space-y-6">
        <DepreciationCalculatorForm />
      </div>

      <!-- Right Column: Results (Chart & Table) -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Loading State -->
        <div v-if="projectionsStore.isLoading" class="flex flex-col items-center justify-center py-24 gap-3 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
          <p class="text-sm text-gray-500 font-medium">{{ t('projections.loadingText') }}</p>
        </div>

        <!-- Active Projection Output -->
        <div v-else-if="projectionsStore.hasProjection && projectionsStore.currentProjection" class="space-y-6">
          <DepreciationChart :projection="projectionsStore.currentProjection" />
          <DepreciationTable :projection="projectionsStore.currentProjection" />
        </div>

        <!-- Initial Placeholder State -->
        <div
          v-else
          class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center space-y-3"
        >
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <i class="pi pi-chart-bar text-3xl"></i>
          </div>
          <h3 class="text-base font-bold text-gray-900 dark:text-white">
            {{ t('projections.emptyTitle') }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
            {{ t('projections.emptySubtitle') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Historical Calculations Section (7.2, 7.3, 7.5) -->
    <div v-if="projectionsStore.history.length > 0" class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-xs space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white">Historial de Proyecciones Guardadas</h2>
          <p class="text-xs text-gray-500">Consulta o elimina cálculos técnicos de depreciación realizados.</p>
        </div>
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {{ projectionsStore.history.length }} registros
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-bold pb-2">
              <th class="py-2.5">Fecha</th>
              <th class="py-2.5">Valor Inicial</th>
              <th class="py-2.5">Horizonte</th>
              <th class="py-2.5">Tasa Anual</th>
              <th class="py-2.5">Valor Residual</th>
              <th class="py-2.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="proj in projectionsStore.history" :key="proj.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-800/50 transition-colors">
              <td class="py-3 text-gray-600 dark:text-gray-400 font-medium">
                {{ new Date(proj.calculatedAt).toLocaleDateString() }}
              </td>
              <td class="py-3 font-bold text-gray-900 dark:text-white">
                {{ proj.formattedInitialValue }}
              </td>
              <td class="py-3 text-gray-700 dark:text-gray-300">
                {{ proj.projectionYears }} años
              </td>
              <td class="py-3">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700">
                  {{ proj.annualDepreciationRatePct }}%
                </span>
              </td>
              <td class="py-3 font-bold text-emerald-600">
                {{ proj.formattedResidualValue }}
              </td>
              <td class="py-3 text-right space-x-2">
                <button
                  type="button"
                  @click="handleSelectHistoryItem(proj.id)"
                  class="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Ver
                </button>
                <button
                  type="button"
                  @click="handleDeleteHistoryItem(proj.id)"
                  class="px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 text-[11px] font-semibold text-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

