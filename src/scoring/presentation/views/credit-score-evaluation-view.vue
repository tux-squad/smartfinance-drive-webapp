<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import Paginator, { type PageState } from 'primevue/paginator'
import Button from 'primevue/button'
import { useScoringStore } from '../../application/scoring.store'
import { useProfilesStore } from '@/profiles/application/profiles.store'
import { useIamStore } from '@/iam/application/iam.store'
import EvaluateScoreForm from '../components/evaluate-score-form.vue'
import CreditScoreGauge from '../components/credit-score-gauge.vue'
import RiskTierCard from '../components/risk-tier-card.vue'
import CreditScoreHistoryCard from '../components/credit-score-history-card.vue'

const { t } = useI18n()
const route = useRoute()
const scoringStore = useScoringStore()
const profilesStore = useProfilesStore()
const iamStore = useIamStore()

const filterMode = ref<'all' | 'profile'>('all')

const currentProfileId = computed(() => profilesStore.currentProfile?.id)

onMounted(async () => {
  if (iamStore.currentUser?.id && !profilesStore.currentProfile) {
    await profilesStore.fetchProfileByUserId(iamStore.currentUser.id)
  }

  const queryScoreId = route.query.scoreId as string | undefined
  const queryProfileId = route.query.profileId as string | undefined

  if (queryScoreId) {
    await scoringStore.fetchCreditScoreById(queryScoreId)
  }

  if (queryProfileId) {
    filterMode.value = 'profile'
    await scoringStore.fetchScoresByProfileId(queryProfileId)
  } else {
    await scoringStore.fetchCreditScores()
  }
})

const handleToggleFilter = async (mode: 'all' | 'profile') => {
  filterMode.value = mode
  if (mode === 'profile') {
    const pId = currentProfileId.value || (route.query.profileId as string)
    if (pId) {
      await scoringStore.fetchScoresByProfileId(pId)
    } else {
      await scoringStore.fetchCreditScores()
    }
  } else {
    await scoringStore.fetchCreditScores()
  }
}

const handleSelectScore = async (id: string) => {
  await scoringStore.fetchCreditScoreById(id)
  window.scrollTo({ top: 400, behavior: 'smooth' })
}

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
    <div class="rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"></div>
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
    <div v-if="scoringStore.hasCurrentScore && scoringStore.currentScore" class="space-y-4 pt-2">
      <div class="flex items-center gap-2.5">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
          <i class="pi pi-chart-bar text-base"></i>
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">
            {{ t('scoring.resultTitle') }}
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Diagnóstico de elegibilidad financiera según Buró / SBS</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <!-- Gauge Speedometer Card -->
        <div class="lg:col-span-5 flex items-center justify-center rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-md">
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
      <div class="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="pi pi-history text-purple-600 dark:text-purple-400"></i>
            {{ t('scoring.historyTitle') }}
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {{ t('scoring.historySubtitle') }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <Button
            size="small"
            :severity="filterMode === 'all' ? 'primary' : 'secondary'"
            :outlined="filterMode !== 'all'"
            label="Todas las Evaluaciones"
            icon="pi pi-list"
            class="!rounded-xl !text-xs font-bold active:scale-[0.98] transition-all"
            @click="handleToggleFilter('all')"
          />
          <Button
            v-if="currentProfileId"
            size="small"
            :severity="filterMode === 'profile' ? 'primary' : 'secondary'"
            :outlined="filterMode !== 'profile'"
            label="Filtrar por Mi Perfil"
            icon="pi pi-user"
            class="!rounded-xl !text-xs font-bold active:scale-[0.98] transition-all"
            @click="handleToggleFilter('profile')"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="scoringStore.isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
        <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
        <p class="text-sm text-slate-500 font-medium">{{ t('scoring.loadingText') }}</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!scoringStore.hasCreditScores"
        class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center"
      >
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mb-4">
          <i class="pi pi-bolt text-2xl"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          {{ t('scoring.emptyTitle') }}
        </h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md">
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
          @select="handleSelectScore"
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

