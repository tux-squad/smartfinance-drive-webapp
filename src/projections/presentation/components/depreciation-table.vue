<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import type { DepreciationProjection } from '../../domain/depreciation-projection.entity'
import type { YearlyDepreciation } from '../../domain/yearly-depreciation.entity'

const props = defineProps<{
  projection: DepreciationProjection
}>()

const { t } = useI18n()

const symbol = computed(() => (props.projection.currency === 'USD' ? '$' : 'S/'))

const formatMoney = (amount: number): string => {
  return `${symbol.value} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
</script>

<template>
  <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        <i class="pi pi-table text-lg"></i>
      </div>
      <div>
        <h3 class="text-base font-bold text-gray-900 dark:text-white">
          {{ t('projections.table.title') }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('projections.table.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Data Table -->
    <DataTable
      :value="projection.yearlyProjections"
      responsiveLayout="scroll"
      class="p-datatable-sm text-xs font-sans"
    >
      <Column field="yearNumber" :header="t('projections.table.colYearNumber')">
        <template #body="slotProps">
          <span class="font-bold text-gray-900 dark:text-white">
            Año {{ slotProps.data.yearNumber }}
          </span>
        </template>
      </Column>

      <Column field="calendarYear" :header="t('projections.table.colCalendarYear')">
        <template #body="slotProps">
          <span class="font-mono text-gray-600 dark:text-gray-400">
            {{ slotProps.data.calendarYear }}
          </span>
        </template>
      </Column>

      <Column field="startValue" :header="t('projections.table.colStartValue')">
        <template #body="slotProps">
          <span class="font-mono text-gray-700 dark:text-gray-300">
            {{ formatMoney(slotProps.data.startValue) }}
          </span>
        </template>
      </Column>

      <Column field="depreciationAmount" :header="t('projections.table.colDepreciationAmount')">
        <template #body="slotProps">
          <span class="font-mono text-rose-600 dark:text-rose-400 font-semibold">
            - {{ formatMoney(slotProps.data.depreciationAmount) }}
          </span>
        </template>
      </Column>

      <Column field="accumulatedDepreciation" :header="t('projections.table.colAccumulatedDepreciation')">
        <template #body="slotProps">
          <span class="font-mono text-amber-600 dark:text-amber-400">
            {{ formatMoney(slotProps.data.accumulatedDepreciation) }}
          </span>
        </template>
      </Column>

      <Column field="endValue" :header="t('projections.table.colEndValue')">
        <template #body="slotProps">
          <span class="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            {{ formatMoney(slotProps.data.endValue) }}
          </span>
        </template>
      </Column>

      <Column field="remainingValuePercentage" :header="t('projections.table.colRemainingPct')">
        <template #body="slotProps">
          <span class="inline-block rounded-full bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 font-mono text-[11px] font-bold text-blue-700 dark:text-blue-300">
            {{ slotProps.data.remainingValuePercentage }}%
          </span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
