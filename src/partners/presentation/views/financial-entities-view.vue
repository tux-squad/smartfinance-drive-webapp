<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import { usePartnersStore } from '../../application/partners.store'
import type { FinancialEntity } from '../../domain/financial-entity.entity'
import SunatRucSearch from '../components/sunat-ruc-search.vue'
import FinancialEntityCard from '../components/financial-entity-card.vue'
import RateBenchmarksDialog from '../components/rate-benchmarks-dialog.vue'

const { t } = useI18n()
const partnersStore = usePartnersStore()

const showBenchmarksModal = ref<boolean>(false)
const selectedEntity = ref<FinancialEntity | null>(null)

onMounted(() => {
  partnersStore.fetchFinancialEntities()
})

const handleOpenBenchmarks = (entity: FinancialEntity) => {
  selectedEntity.value = entity
  showBenchmarksModal.value = true
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md mb-3 border border-blue-500/30">
          <i class="pi pi-building-columns"></i>
          {{ t('partners.headerBadge') }}
        </div>
        <h1 class="text-3xl font-black tracking-tight sm:text-4xl text-white">
          {{ t('partners.headerTitle') }}
        </h1>
        <p class="mt-2 text-sm text-blue-100/80 leading-relaxed">
          {{ t('partners.headerSubtitle') }}
        </p>
      </div>
    </div>

    <!-- Widget 1: SUNAT RUC Verification -->
    <SunatRucSearch />

    <!-- Widget 2: Financial Institutions Directory -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="pi pi-building text-emerald-600"></i>
            {{ t('partners.directoryTitle') }}
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('partners.directorySubtitle') }}
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="partnersStore.isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
        <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
        <p class="text-sm text-gray-500 font-medium">{{ t('partners.loadingText') }}</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!partnersStore.hasEntities"
        class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center"
      >
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4">
          <i class="pi pi-building text-2xl"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ t('partners.emptyTitle') }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
          {{ t('partners.emptySubtitle') }}
        </p>
      </div>

      <!-- Financial Entities Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FinancialEntityCard
          v-for="entity in partnersStore.financialEntities"
          :key="entity.id"
          :entity="entity"
          @open-benchmarks="handleOpenBenchmarks"
        />
      </div>
    </div>

    <!-- Rate Benchmarks Modal -->
    <RateBenchmarksDialog
      v-model:visible="showBenchmarksModal"
      :entity="selectedEntity"
    />
  </div>
</template>
