<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Message from 'primevue/message'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { EvaluateScoreCommand } from '../../domain/evaluate-score.command'
import { useScoringStore } from '../../application/scoring.store'
import { useProfilesStore } from '@/profiles/application/profiles.store'
import { useIamStore } from '@/iam/application/iam.store'
import { useFinancingStore } from '@/financing/application/financing.store'

const { t } = useI18n()
const scoringStore = useScoringStore()
const profilesStore = useProfilesStore()
const iamStore = useIamStore()
const financingStore = useFinancingStore()

const selectedProfileId = ref<string>('')
const selectedSimulationId = ref<string>('')

onMounted(async () => {
  const promises: Promise<any>[] = [financingStore.fetchSimulations()]
  if (iamStore.currentUser?.id) {
    promises.push(profilesStore.fetchProfileByUserId(iamStore.currentUser.id))
  }
  await Promise.all(promises)
  if (profilesStore.currentProfile?.id) {
    selectedProfileId.value = profilesStore.currentProfile.id
  }
  if (financingStore.simulations.length > 0) {
    selectedSimulationId.value = financingStore.simulations[0]?.id || ''
  }
})

const hasActiveProfile = computed(() => !!profilesStore.currentProfile)

const handleEvaluate = async () => {
  const profile = profilesStore.currentProfile
  const profileIdToUse = profile?.id || selectedProfileId.value
  let simId = selectedSimulationId.value || financingStore.simulations[0]?.id
  let activeSim = financingStore.simulations.find(s => s.id === simId) || financingStore.simulations[0]

  if (!simId) {
    const todayStr = new Date().toISOString().split('T')[0] ?? '2026-09-19'
    const success = await financingStore.createSimulation({
      title: 'Simulación base de evaluación',
      userId: String(iamStore.currentUser?.id || localStorage.getItem('user_id') || '1'),
      vehicleId: '1',
      financialEntityId: 'b1c2d3e4-f5a6-7b8c-9d0e-112233445566',
      vehiclePriceAmount: 25000,
      currency: 'USD',
      downPaymentPercentage: 20,
      balloonPaymentPercentage: 0,
      annualEffectiveRate: 11.5,
      monthlyCreditLifeInsuranceRate: 0.05,
      vehicleInsuranceFeeAmount: 70,
      vehicleInsuranceType: 'FULL_COVERAGE',
      loanTermMonths: 36,
      gracePeriodType: 'NONE',
      gracePeriodMonths: 0,
      initialFeesAmount: 100,
      discountRate: 8.5,
      startDate: todayStr
    })
    if (success && financingStore.currentSimulation) {
      simId = financingStore.currentSimulation.id
      activeSim = financingStore.currentSimulation
      selectedSimulationId.value = simId
    }
  }

  if (!simId) return

  const income = profile?.monthlyIncomeAmount && profile.monthlyIncomeAmount > 0 ? profile.monthlyIncomeAmount : 3500
  const installment = activeSim?.monthlyPaymentAmount && activeSim.monthlyPaymentAmount > 0 ? activeSim.monthlyPaymentAmount : 500
  const currency = profile?.currency || activeSim?.currency || 'USD'

  const command = new EvaluateScoreCommand(
    profileIdToUse,
    simId,
    income,
    installment,
    currency
  )
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

    <!-- Simulation Selector Card -->
    <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700 space-y-2">
      <label class="block text-xs font-bold text-gray-700 dark:text-gray-300">
        Simulación de Crédito a Contrastar
      </label>
      <div v-if="financingStore.simulations.length > 0">
        <Select
          v-model="selectedSimulationId"
          :options="financingStore.simulations"
          optionLabel="title"
          optionValue="id"
          placeholder="Seleccionar simulación de crédito..."
          class="w-full text-xs"
        />
      </div>
      <p v-else class="text-xs text-gray-500 dark:text-gray-400">
        No se encontraron simulaciones previas. Al evaluar, el sistema creará automáticamente una simulación paramétrica real asociada.
      </p>
    </div>

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
