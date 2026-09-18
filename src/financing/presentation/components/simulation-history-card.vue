<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import type { Simulation } from '../../domain/simulation.entity'

const props = defineProps<{
  simulation: Simulation
}>()

const emit = defineEmits<{
  (e: 'view-detail', simulation: Simulation): void
  (e: 'delete', simulationId: string): void
}>()

const { t } = useI18n()

const onView = () => {
  emit('view-detail', props.simulation)
}

const onDelete = () => {
  emit('delete', props.simulation.id)
}
</script>

<template>
  <div
    class="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <Tag
          :value="`${simulation.loanTermMonths} ${t('financing.monthsLabel')}`"
          severity="info"
          class="!text-xs font-bold px-2.5 py-0.5 rounded-full mb-1.5"
        />
        <h3 class="text-base font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
          {{ simulation.title }}
        </h3>
      </div>

      <Button
        icon="pi pi-trash"
        text
        rounded
        severity="danger"
        size="small"
        class="!p-1 text-gray-400 hover:text-red-600"
        @click="onDelete"
      />
    </div>

    <!-- Body Metrics -->
    <div class="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 text-xs">
      <div>
        <span class="text-gray-500 dark:text-gray-400 block">{{ t('financing.monthlyPaymentLabel') }}</span>
        <span class="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
          {{ simulation.formattedMonthlyPayment }}
        </span>
      </div>

      <div>
        <span class="text-gray-500 dark:text-gray-400 block">{{ t('financing.tceaLabel') }}</span>
        <span class="font-bold text-gray-900 dark:text-white text-sm">
          {{ simulation.formattedTcea }}
        </span>
      </div>
    </div>

    <!-- Footer Action -->
    <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
      <Button
        :label="t('financing.viewScheduleBtn')"
        icon="pi pi-table"
        severity="success"
        outlined
        size="small"
        class="w-full rounded-xl !text-xs !py-2"
        @click="onView"
      />
    </div>
  </div>
</template>
