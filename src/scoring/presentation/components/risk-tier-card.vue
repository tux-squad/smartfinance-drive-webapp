<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Tag from 'primevue/tag'
import type { CreditScore } from '../../domain/credit-score.entity'

const props = defineProps<{
  creditScore: CreditScore
}>()

const { t } = useI18n()
</script>

<template>
  <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
    <!-- Header: Risk Tier Category -->
    <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
      <div>
        <span class="text-xs text-gray-500 dark:text-gray-400 block mb-1">
          {{ t('scoring.riskTierCategoryLabel') }}
        </span>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ creditScore.riskTierLabel }}
        </h3>
      </div>

      <Tag
        :value="creditScore.riskTier"
        :severity="creditScore.riskTierSeverity"
        class="!text-xs font-bold px-3 py-1.5 rounded-full"
      />
    </div>

    <!-- Max Recommended Loan Card -->
    <div class="rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-5 border border-emerald-500/20 space-y-1">
      <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
        {{ t('scoring.maxRecommendedLoanLabel') }}
      </span>
      <div class="text-3xl font-black text-emerald-600 dark:text-emerald-400">
        {{ creditScore.formattedMaxLoan }}
      </div>
      <p class="text-xs text-emerald-700/80 dark:text-emerald-400/80">
        {{ t('scoring.maxLoanNote') }}
      </p>
    </div>

    <!-- Recommendations Bullets -->
    <div class="space-y-2 text-xs text-gray-600 dark:text-gray-300">
      <div v-if="creditScore.riskTier === 'LOW_RISK'" class="flex items-center gap-2">
        <i class="pi pi-check-circle text-emerald-500"></i>
        <span>{{ t('scoring.lowRiskBenefit') }}</span>
      </div>
      <div v-else-if="creditScore.riskTier === 'MEDIUM_RISK'" class="flex items-center gap-2">
        <i class="pi pi-exclamation-circle text-amber-500"></i>
        <span>{{ t('scoring.mediumRiskNotice') }}</span>
      </div>
      <div v-else class="flex items-center gap-2">
        <i class="pi pi-times-circle text-red-500"></i>
        <span>{{ t('scoring.highRiskNotice') }}</span>
      </div>
    </div>
  </div>
</template>
