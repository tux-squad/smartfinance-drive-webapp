<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Select from 'primevue/select'
import { EvaluateScoreCommand } from '../../domain/evaluate-score.command'
import { useScoringStore } from '../../application/scoring.store'
import { useProfilesStore } from '@/profiles/application/profiles.store'
import { useIamStore } from '@/iam/application/iam.store'

const { t } = useI18n()
const scoringStore = useScoringStore()
const profilesStore = useProfilesStore()
const iamStore = useIamStore()

const selectedProfileId = ref<string>('a1b2c3d4-e5f6-7a8b-9c0d-112233445566')

onMounted(async () => {
  if (iamStore.currentUser?.id) {
    await profilesStore.fetchProfileByUserId(iamStore.currentUser.id)
    if (profilesStore.currentProfile?.id) {
      selectedProfileId.value = profilesStore.currentProfile.id
    }
  }
})

const hasActiveProfile = computed(() => !!profilesStore.currentProfile)

const handleEvaluate = async () => {
  const profileIdToUse = profilesStore.currentProfile?.id || selectedProfileId.value
  const command = new EvaluateScoreCommand(profileIdToUse)
  await scoringStore.evaluateCreditScore(command)
}
</script>

<template>
  <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
        <i class="pi pi-bolt text-lg"></i>
      </div>
      <div>
        <h3 class="text-base font-bold text-gray-900 dark:text-white">
          {{ t('scoring.formTitle') }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('scoring.formSubtitle') }}
        </p>
      </div>
    </div>

    <!-- Error Alert -->
    <Message v-if="scoringStore.error" severity="error" class="!rounded-xl !text-xs">
      {{ scoringStore.error }}
    </Message>

    <!-- Active Profile Overview Card -->
    <div v-if="hasActiveProfile && profilesStore.currentProfile" class="rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <span class="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider block mb-0.5">
          {{ t('scoring.activeProfileLabel') }}
        </span>
        <h4 class="text-sm font-extrabold text-gray-900 dark:text-white">
          {{ profilesStore.currentProfile.firstName }} {{ profilesStore.currentProfile.lastName }}
        </h4>
        <p class="text-xs text-gray-500 font-mono">
          DNI: {{ profilesStore.currentProfile.dni }} | {{ t('profiles.monthlyIncome') }}: {{ profilesStore.currentProfile.currency }} {{ profilesStore.currentProfile.monthlyIncomeAmount }}
        </p>
      </div>

      <Button
        :label="t('scoring.evaluateBtn')"
        icon="pi pi-bolt"
        :loading="scoringStore.isLoading"
        severity="help"
        class="w-full sm:w-auto px-6 !rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-purple-600/20"
        @click="handleEvaluate"
      />
    </div>

    <!-- Fallback Manual Trigger -->
    <div v-else class="space-y-4">
      <div class="rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-4 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
        {{ t('scoring.noProfileNotice') }}
      </div>

      <div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <InputText
          v-model="selectedProfileId"
          placeholder="UUID de Perfil..."
          class="w-full sm:w-96 !rounded-xl !text-xs font-mono"
        />

        <Button
          :label="t('scoring.evaluateBtn')"
          icon="pi pi-bolt"
          :loading="scoringStore.isLoading"
          severity="help"
          class="w-full sm:w-auto px-6 !rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
          @click="handleEvaluate"
        />
      </div>
    </div>
  </div>
</template>
