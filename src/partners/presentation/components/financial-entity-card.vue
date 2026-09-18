<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import type { FinancialEntity } from '../../domain/financial-entity.entity'

const props = defineProps<{
  entity: FinancialEntity
}>()

const emit = defineEmits<{
  (e: 'open-benchmarks', entity: FinancialEntity): void
}>()

const { t } = useI18n()

const benchmarksCount = computed(() => props.entity.rateBenchmarks?.length || 0)

const onOpen = () => {
  emit('open-benchmarks', props.entity)
}
</script>

<template>
  <div
    class="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
  >
    <!-- Header: Bank Icon + RUC Pill -->
    <div class="flex items-start justify-between">
      <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
        <i class="pi pi-building text-xl"></i>
      </div>

      <span
        v-if="entity.ruc"
        class="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-mono font-medium text-gray-700 dark:text-gray-300"
      >
        RUC: {{ entity.ruc }}
      </span>
    </div>

    <!-- Body: Entity Name & Benchmarks Summary -->
    <div class="mt-5 space-y-2">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
        {{ entity.name }}
      </h3>

      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <i class="pi pi-percentage text-emerald-500"></i>
        <span>
          {{ benchmarksCount }} {{ t('partners.ratesConfiguredLabel') }}
        </span>
      </div>
    </div>

    <!-- Footer: Action Button -->
    <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
      <Button
        :label="t('partners.viewTeaRatesBtn')"
        icon="pi pi-chart-line"
        severity="success"
        outlined
        class="w-full rounded-xl !text-xs !py-2.5 font-semibold border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
        @click="onOpen"
      />
    </div>
  </div>
</template>
