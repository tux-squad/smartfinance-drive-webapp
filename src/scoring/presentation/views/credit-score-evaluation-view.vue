<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import Paginator, { type PageState } from 'primevue/paginator'
import { useScoringStore } from '../../application/scoring.store'
import EvaluateScoreForm from '../components/evaluate-score-form.vue'
import CreditScoreGauge from '../components/credit-score-gauge.vue'
import RiskTierCard from '../components/risk-tier-card.vue'
import CreditScoreHistoryCard from '../components/credit-score-history-card.vue'

const { t } = useI18n()
const scoringStore = useScoringStore()

onMounted(() => {
  scoringStore.fetchCreditScores()
})

const onPageChange = (event: PageState) => {
  scoringStore.fetchCreditScores(event.page, event.rows)
}

const handleDelete = async (id: string) => {
  await scoringStore.deleteCreditScore(id)
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3.5 py-1 text-xs font-semibold text-purple-300 backdrop-blur-md mb-3 border border-purple-500/30">
          <i class="pi pi-bolt"></i>
          {{ t('scoring.headerBadge') }}
        </div>
        <h1 class="text-3xl font-black tracking-tight sm:text-4xl text-white">
          {{ t('scoring.headerTitle') }}
        </h1>
        <p class="mt-2 text-sm text-purple-100/80 leading-relaxed">
          {{ t('scoring.headerSubtitle') }}
        </p>
      </div>
    </div>

    <!-- Evaluation Form Section -->
    <EvaluateScoreForm />

    <!-- Current Evaluation Result Panel -->
    <div v-if="scoringStore.hasCurrentScore && scoringStore.currentScore" class="space-y-4">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
          <i class="pi pi-chart-bar text-sm"></i>
        </div>
        <h2 class="text-xl font-extrabold text-gray-900 dark:text-white">
          {{ t('scoring.resultTitle') }}
        </h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <!-- Gauge Speedometer Card -->
        <div class="lg:col-span-5 flex items-center justify-center rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <CreditScoreGauge :score="scoringStore.currentScore.score" />
        </div>

        <!-- Risk Tier Breakdown Card -->
        <div class="lg:col-span-7">
          <RiskTierCard :creditScore="scoringStore.currentScore" />
        </div>
      </div>
    </div>

    <!-- Evaluation History Section -->
    <div class="space-y-4 pt-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="pi pi-history text-purple-600"></i>
            {{ t('scoring.historyTitle') }}
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('scoring.historySubtitle') }}
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="scoringStore.isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
        <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
        <p class="text-sm text-gray-500 font-medium">{{ t('scoring.loadingText') }}</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!scoringStore.hasCreditScores"
        class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center"
      >
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mb-4">
          <i class="pi pi-bolt text-2xl"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ t('scoring.emptyTitle') }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
          {{ t('scoring.emptySubtitle') }}
        </p>
      </div>

      <!-- Credit Scores Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CreditScoreHistoryCard
          v-for="item in scoringStore.creditScores"
          :key="item.id"
          :creditScore="item"
          @delete="handleDelete"
        />
      </div>

      <!-- Pagination -->
      <div v-if="scoringStore.totalPages > 1" class="flex justify-center pt-4">
        <Paginator
          :rows="scoringStore.pageSize"
          :totalRecords="scoringStore.totalElements"
          :first="scoringStore.currentPage * scoringStore.pageSize"
          class="!bg-transparent"
          @page="onPageChange"
        />
      </div>
    </div>
  </div>
</template>
