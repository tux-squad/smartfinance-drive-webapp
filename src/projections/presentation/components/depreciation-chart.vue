<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DepreciationProjection } from '../../domain/depreciation-projection.entity'

const props = defineProps<{
  projection: DepreciationProjection
}>()

const { t } = useI18n()

const symbol = computed(() => (props.projection.currency === 'USD' ? '$' : 'S/'))

const maxVal = computed(() => props.projection.initialValueAmount || 1)
</script>

<template>
  <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
      <div>
        <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-chart-bar text-sky-500"></i>
          {{ t('projections.chart.title') }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('projections.chart.subtitle') }}
        </p>
      </div>

      <!-- Preserved Value Badge -->
      <div class="text-right">
        <span class="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">
          {{ t('projections.chart.residualPercentageLabel') }}
        </span>
        <span class="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
          {{ projection.preservedValuePercentage }}%
        </span>
      </div>
    </div>

    <!-- Summary Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 p-4 border border-blue-100 dark:border-blue-900/50">
        <span class="text-xs text-blue-600 dark:text-blue-400 block font-semibold">
          {{ t('projections.chart.initialValueLabel') }}
        </span>
        <span class="text-lg font-extrabold text-blue-950 dark:text-blue-200">
          {{ projection.formattedInitialValue }}
        </span>
      </div>

      <div class="rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 p-4 border border-emerald-100 dark:border-emerald-900/50">
        <span class="text-xs text-emerald-600 dark:text-emerald-400 block font-semibold">
          {{ t('projections.chart.residualValueLabel') }}
        </span>
        <span class="text-lg font-extrabold text-emerald-950 dark:text-emerald-200">
          {{ projection.formattedResidualValue }}
        </span>
      </div>

      <div class="rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 p-4 border border-amber-100 dark:border-amber-900/50">
        <span class="text-xs text-amber-600 dark:text-amber-400 block font-semibold">
          {{ t('projections.chart.totalDepreciationLabel') }}
        </span>
        <span class="text-lg font-extrabold text-amber-950 dark:text-amber-200">
          {{ symbol }} {{ projection.totalDepreciationAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        </span>
      </div>
    </div>

    <!-- Visual Bar Chart -->
    <div class="space-y-4 pt-2">
      <h4 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        {{ t('projections.chart.visualProgressionTitle') }}
      </h4>

      <div class="space-y-3">
        <!-- Initial Year 0 -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs font-semibold">
            <span class="text-gray-900 dark:text-white">Año 0 (Año {{ projection.manufactureYear }})</span>
            <span class="text-blue-600 font-mono font-bold">{{ projection.formattedInitialValue }} (100%)</span>
          </div>
          <div class="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div class="h-full bg-blue-600 rounded-full transition-all duration-500" style="width: 100%"></div>
          </div>
        </div>

        <!-- Projected Years -->
        <div
          v-for="item in projection.yearlyProjections"
          :key="item.yearNumber"
          class="space-y-1"
        >
          <div class="flex justify-between text-xs">
            <span class="text-gray-700 dark:text-gray-300 font-medium">
              Año {{ item.yearNumber }} ({{ item.calendarYear }})
            </span>
            <span class="text-gray-900 dark:text-white font-mono font-bold">
              {{ symbol }} {{ item.endValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              <span class="text-xs text-gray-400 font-normal">({{ item.remainingValuePercentage }}%)</span>
            </span>
          </div>

          <div class="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex">
            <!-- Remaining value bar -->
            <div
              class="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-l-full transition-all duration-500"
              :style="{ width: `${item.remainingValuePercentage}%` }"
            ></div>
            <!-- Accumulated depreciation lost bar -->
            <div
              class="h-full bg-rose-200 dark:bg-rose-950/60 rounded-r-full opacity-60"
              :style="{ width: `${100 - item.remainingValuePercentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
