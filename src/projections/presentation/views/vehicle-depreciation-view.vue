<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import { useProjectionsStore } from '../../application/projections.store'
import DepreciationCalculatorForm from '../components/depreciation-calculator-form.vue'
import DepreciationChart from '../components/depreciation-chart.vue'
import DepreciationTable from '../components/depreciation-table.vue'

const { t } = useI18n()
const projectionsStore = useProjectionsStore()
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
  </div>
</template>
