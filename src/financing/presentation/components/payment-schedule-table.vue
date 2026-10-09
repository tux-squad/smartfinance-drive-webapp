<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import type { ScheduleItem } from '../../domain/schedule-item.value-object'

const props = defineProps<{
  schedule: ScheduleItem[]
  currencySymbol: string
}>()

const { t } = useI18n()

const formatCurrency = (amount: number) => {
  return `${props.currencySymbol} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const totalInterest = computed(() => {
  return props.schedule.reduce((acc, row) => acc + (row.interestPayment || 0), 0)
})

const totalAmortization = computed(() => {
  return props.schedule.reduce((acc, row) => acc + (row.principalAmortization || 0), 0)
})

const totalInsurances = computed(() => {
  return props.schedule.reduce((acc, row) => acc + ((row.creditLifeInsurance || 0) + (row.vehicleInsurance || 0)), 0)
})

const totalPayments = computed(() => {
  return props.schedule.reduce((acc, row) => acc + (row.totalMonthlyPayment || 0), 0)
})
</script>

<template>
  <div class="rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 space-y-6">
    <!-- Section Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
      <div class="flex items-center gap-3.5">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
          <i class="pi pi-table text-xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {{ t('financing.scheduleTableTitle') }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {{ t('financing.scheduleTableSubtitle') }}
          </p>
        </div>
      </div>

      <div class="inline-flex items-center gap-2">
        <Tag
          :value="`${schedule.length} Cuotas programadas`"
          severity="info"
          class="!text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
        />
      </div>
    </div>

    <!-- Quick Aggregate Summary Metrics -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100 dark:border-slate-800">
        <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Total Capital</span>
        <span class="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white">{{ formatCurrency(totalAmortization) }}</span>
      </div>

      <div class="rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 p-3.5 border border-amber-200/50 dark:border-amber-800/40">
        <span class="text-[11px] font-semibold text-amber-700 dark:text-amber-300 block">Total Intereses</span>
        <span class="text-sm sm:text-base font-bold font-mono text-amber-700 dark:text-amber-300">{{ formatCurrency(totalInterest) }}</span>
      </div>

      <div class="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100 dark:border-slate-800">
        <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Total Seguros</span>
        <span class="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white">{{ formatCurrency(totalInsurances) }}</span>
      </div>

      <div class="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-3.5 border border-emerald-200/60 dark:border-emerald-800/50">
        <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block">Costo Total del Crédito</span>
        <span class="text-sm sm:text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{{ formatCurrency(totalPayments) }}</span>
      </div>
    </div>

    <!-- Payment Schedule DataTable -->
    <div class="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
      <DataTable
        :value="schedule"
        stripedRows
        paginator
        :rows="12"
        responsiveLayout="scroll"
        class="!text-xs"
      >
        <Column field="periodNumber" :header="t('financing.colPeriod')" sortable style="width: 5.5rem">
          <template #body="{ data }">
            <span class="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">#{{ data.periodNumber }}</span>
          </template>
        </Column>

        <Column field="paymentDate" :header="t('financing.colPaymentDate')">
          <template #body="{ data }">
            <span class="font-mono text-slate-600 dark:text-slate-400">{{ data.paymentDate }}</span>
          </template>
        </Column>

        <Column field="initialBalance" :header="t('financing.colInitialBalance')">
          <template #body="{ data }">
            <span class="font-mono text-slate-600 dark:text-slate-300">{{ formatCurrency(data.initialBalance) }}</span>
          </template>
        </Column>

        <Column field="interestPayment" :header="t('financing.colInterest')">
          <template #body="{ data }">
            <span class="font-mono text-amber-600 dark:text-amber-400 font-medium">{{ formatCurrency(data.interestPayment) }}</span>
          </template>
        </Column>

        <Column field="principalAmortization" :header="t('financing.colAmortization')">
          <template #body="{ data }">
            <span class="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{{ formatCurrency(data.principalAmortization) }}</span>
          </template>
        </Column>

        <Column field="creditLifeInsurance" :header="t('financing.colInsurances')">
          <template #body="{ data }">
            <span class="font-mono text-slate-500 dark:text-slate-400">
              {{ formatCurrency((data.creditLifeInsurance || 0) + (data.vehicleInsurance || 0)) }}
            </span>
          </template>
        </Column>

        <Column field="totalMonthlyPayment" :header="t('financing.colTotalPayment')">
          <template #body="{ data }">
            <span class="font-mono font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40">
              {{ formatCurrency(data.totalMonthlyPayment) }}
            </span>
          </template>
        </Column>

        <Column field="finalBalance" :header="t('financing.colFinalBalance')">
          <template #body="{ data }">
            <span class="font-mono text-slate-500 dark:text-slate-400">{{ formatCurrency(data.finalBalance) }}</span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

