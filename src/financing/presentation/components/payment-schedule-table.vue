<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { ScheduleItem } from '../../domain/schedule-item.value-object'

const props = defineProps<{
  schedule: ScheduleItem[]
  currencySymbol: string
}>()

const { t } = useI18n()

const formatCurrency = (amount: number) => {
  return `${props.currencySymbol} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
</script>

<template>
  <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
    <!-- Section Header -->
    <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <i class="pi pi-calendar text-lg"></i>
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-900 dark:text-white">
            {{ t('financing.scheduleTableTitle') }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ t('financing.scheduleTableSubtitle') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Payment Schedule DataTable -->
    <DataTable
      :value="schedule"
      stripedRows
      paginator
      :rows="12"
      responsiveLayout="scroll"
      class="!text-xs"
    >
      <Column field="periodNumber" :header="t('financing.colPeriod')" sortable style="width: 5rem">
        <template #body="{ data }">
          <span class="font-bold text-gray-900 dark:text-white">Nº {{ data.periodNumber }}</span>
        </template>
      </Column>

      <Column field="paymentDate" :header="t('financing.colPaymentDate')">
        <template #body="{ data }">
          <span class="font-mono text-gray-600 dark:text-gray-400">{{ data.paymentDate }}</span>
        </template>
      </Column>

      <Column field="initialBalance" :header="t('financing.colInitialBalance')">
        <template #body="{ data }">
          <span class="font-mono">{{ formatCurrency(data.initialBalance) }}</span>
        </template>
      </Column>

      <Column field="interestPayment" :header="t('financing.colInterest')">
        <template #body="{ data }">
          <span class="font-mono text-amber-600 dark:text-amber-400">{{ formatCurrency(data.interestPayment) }}</span>
        </template>
      </Column>

      <Column field="principalAmortization" :header="t('financing.colAmortization')">
        <template #body="{ data }">
          <span class="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{{ formatCurrency(data.principalAmortization) }}</span>
        </template>
      </Column>

      <Column field="creditLifeInsurance" :header="t('financing.colInsurances')">
        <template #body="{ data }">
          <span class="font-mono text-gray-500">
            {{ formatCurrency(data.creditLifeInsurance + data.vehicleInsurance) }}
          </span>
        </template>
      </Column>

      <Column field="totalMonthlyPayment" :header="t('financing.colTotalPayment')">
        <template #body="{ data }">
          <span class="font-extrabold text-emerald-700 dark:text-emerald-300">{{ formatCurrency(data.totalMonthlyPayment) }}</span>
        </template>
      </Column>

      <Column field="finalBalance" :header="t('financing.colFinalBalance')">
        <template #body="{ data }">
          <span class="font-mono text-gray-600 dark:text-gray-400">{{ formatCurrency(data.finalBalance) }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
