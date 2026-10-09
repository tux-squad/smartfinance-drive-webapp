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
    class="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-3">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <Tag
            :value="`${simulation.loanTermMonths} ${t('financing.monthsLabel')}`"
            severity="info"
            class="!text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40"
          />
          <span class="text-[11px] text-slate-400 font-mono">TEA {{ simulation.annualEffectiveRate }}%</span>
        </div>
        <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
          {{ simulation.title }}
        </h3>
      </div>

      <Button
        icon="pi pi-trash"
        text
        rounded
        severity="danger"
        size="small"
        class="!p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        @click="onDelete"
      />
    </div>

    <!-- Body Metrics Bento -->
    <div class="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800">
      <div>
        <span class="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">{{ t('financing.monthlyPaymentLabel') }}</span>
        <span class="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 text-base">
          {{ simulation.formattedMonthlyPayment }}
        </span>
      </div>

      <div>
        <span class="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">{{ t('financing.tceaLabel') }}</span>
        <span class="font-bold font-mono text-slate-900 dark:text-white text-base">
          {{ simulation.formattedTcea }}
        </span>
      </div>
    </div>

    <!-- Footer Action -->
    <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
      <Button
        :label="t('financing.viewScheduleBtn')"
        icon="pi pi-table"
        severity="success"
        outlined
        size="small"
        class="w-full !rounded-xl !text-xs !py-2.5 font-bold hover:!bg-emerald-50 dark:hover:!bg-emerald-950/40 !border-emerald-600/30 active:scale-[0.98] transition-all"
        @click="onView"
      />
    </div>
  </div>
</template>

