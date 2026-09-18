<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import type { CreditScore } from '../../domain/credit-score.entity'

const props = defineProps<{
  creditScore: CreditScore
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()

const { t } = useI18n()

const onDelete = () => {
  emit('delete', props.creditScore.id)
}
</script>

<template>
  <div
    class="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-2">
        <span class="text-2xl font-black text-gray-900 dark:text-white">
          {{ creditScore.score }}
        </span>
        <span class="text-xs text-gray-400">/ 850</span>
      </div>

      <div class="flex items-center gap-2">
        <Tag
          :value="creditScore.riskTier"
          :severity="creditScore.riskTierSeverity"
          class="!text-xs font-bold px-2.5 py-0.5 rounded-full"
        />
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
    </div>

    <!-- Details -->
    <div class="mt-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 text-xs">
      <span class="text-gray-500 dark:text-gray-400 block mb-0.5">{{ t('scoring.maxRecommendedLoanLabel') }}</span>
      <span class="font-extrabold text-purple-700 dark:text-purple-300 text-sm">
        {{ creditScore.formattedMaxLoan }}
      </span>
    </div>
  </div>
</template>
