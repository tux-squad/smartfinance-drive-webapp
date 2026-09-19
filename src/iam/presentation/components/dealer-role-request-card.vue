<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold shrink-0">
          <i :class="selectedRole === 'DEALER' ? 'pi pi-car' : 'pi pi-building-columns'" class="text-lg"></i>
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-900">
            {{ t('iam.businessElevationTitle') }}
          </h3>
          <p class="text-xs text-gray-500">
            {{ t('iam.businessElevationSubtitle') }}
          </p>
        </div>
      </div>

      <!-- Current Role Badges -->
      <div class="flex flex-wrap items-center gap-1.5">
        <span
          v-if="isDealer"
          class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
        >
          <i class="pi pi-check-circle text-xs"></i>
          <span>{{ t('iam.dealerActiveBadge') }}</span>
        </span>
        <span
          v-if="isFinancialInstitution"
          class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200"
        >
          <i class="pi pi-check-circle text-xs"></i>
          <span>{{ t('iam.financialActiveBadge') }}</span>
        </span>
        <span
          v-if="!isDealer && !isFinancialInstitution"
          class="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200"
        >
          <i class="pi pi-user text-xs"></i>
          <span>{{ t('iam.buyerBadge') }}</span>
        </span>
      </div>
    </div>

    <!-- Role Type Navigation Tabs -->
    <div class="flex border-b border-gray-200 text-xs font-bold">
      <button
        type="button"
        @click="switchTab('DEALER')"
        :class="[
          selectedRole === 'DEALER'
            ? 'border-blue-900 text-blue-900 bg-blue-50/50'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'flex items-center space-x-2 py-2.5 px-4 border-b-2 rounded-t-lg transition-colors'
        ]"
      >
        <i class="pi pi-car text-sm"></i>
        <span>{{ t('iam.tabDealer') }}</span>
        <i v-if="isDealer" class="pi pi-check text-emerald-600 text-[10px]"></i>
      </button>

      <button
        type="button"
        @click="switchTab('FINANCIAL_INSTITUTION')"
        :class="[
          selectedRole === 'FINANCIAL_INSTITUTION'
            ? 'border-blue-900 text-blue-900 bg-blue-50/50'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'flex items-center space-x-2 py-2.5 px-4 border-b-2 rounded-t-lg transition-colors'
        ]"
      >
        <i class="pi pi-building-columns text-sm"></i>
        <span>{{ t('iam.tabFinancial') }}</span>
        <i v-if="isFinancialInstitution" class="pi pi-check text-emerald-600 text-[10px]"></i>
      </button>
    </div>

    <!-- Content for DEALER Tab -->
    <div v-if="selectedRole === 'DEALER'" class="space-y-4">
      <!-- State 1: User is already an accredited Dealer -->
      <div v-if="isDealer" class="bg-emerald-50/70 rounded-xl p-5 border border-emerald-200 space-y-3">
        <div class="flex items-start space-x-3">
          <i class="pi pi-verified text-xl text-emerald-600 mt-0.5 shrink-0"></i>
          <div class="space-y-1">
            <h4 class="text-sm font-bold text-emerald-950">
              {{ t('iam.dealerAccreditedTitle') }}
            </h4>
            <p class="text-xs text-emerald-800 leading-relaxed">
              {{ t('iam.dealerAccreditedDesc') }}
            </p>
          </div>
        </div>

        <div class="pt-2 flex flex-wrap gap-2">
          <router-link
            to="/vehicles"
            class="inline-flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
          >
            <i class="pi pi-plus-circle text-xs"></i>
            <span>{{ t('catalog.registerVehicleBtn') }}</span>
          </router-link>
        </div>
      </div>

      <!-- State 2: Requesting Dealer Role via SUNAT (CIIU 451) -->
      <div v-else class="space-y-4">
        <!-- Sunat Requirement Alert Notice -->
        <div class="bg-blue-50/60 rounded-xl p-4 border border-blue-100 flex items-start space-x-3 text-xs text-blue-900 leading-relaxed">
          <i class="pi pi-info-circle text-blue-600 text-base mt-0.5 shrink-0"></i>
          <div>
            <p class="font-semibold text-blue-950 mb-0.5">{{ t('iam.sunatRequirementTitle') }}</p>
            <p>{{ t('iam.sunatRequirementDesc') }}</p>
          </div>
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg text-xs text-emerald-800 flex items-center space-x-2">
          <i class="pi pi-check-circle text-emerald-600 text-sm"></i>
          <span class="font-medium">{{ successMessage }}</span>
        </div>

        <!-- Error Alert -->
        <div v-if="iamStore.error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-xs text-red-700 flex items-center space-x-2">
          <i class="pi pi-exclamation-circle text-red-500 text-sm"></i>
          <span>{{ iamStore.error }}</span>
        </div>

        <!-- Dealer Elevation Form -->
        <form @submit.prevent="handleRequestDealerRole" class="space-y-4">
          <div>
            <div class="flex justify-between items-center mb-1">
              <label for="dealer-ruc" class="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                {{ t('iam.rucNumber') }} (SUNAT)
              </label>
              <button
                type="button"
                @click="fillDemoDealerRuc"
                class="text-xs text-blue-900 hover:text-blue-700 font-semibold underline flex items-center space-x-1"
              >
                <i class="pi pi-sparkles text-[11px]"></i>
                <span>{{ t('iam.fillDemoRucBtn') }}</span>
              </button>
            </div>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <i class="pi pi-car text-sm"></i>
              </span>
              <input
                id="dealer-ruc"
                v-model="ruc"
                type="text"
                required
                maxlength="11"
                minlength="11"
                pattern="[0-9]{11}"
                placeholder="20100138019"
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
              />
            </div>
            <p class="text-[11px] text-gray-500 mt-1">
              {{ t('iam.rucFormatHint') }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="iamStore.isLoading || !ruc || ruc.length !== 11"
            class="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="iamStore.isLoading" class="pi pi-spin pi-spinner text-sm"></i>
            <i v-else class="pi pi-shield text-sm"></i>
            <span>{{ iamStore.isLoading ? t('iam.verifyingSunat') : t('iam.requestDealerBtn') }}</span>
          </button>
        </form>
      </div>
    </div>

    <!-- Content for FINANCIAL_INSTITUTION Tab -->
    <div v-if="selectedRole === 'FINANCIAL_INSTITUTION'" class="space-y-4">
      <!-- State 1: User is already an accredited Financial Institution -->
      <div v-if="isFinancialInstitution" class="bg-blue-50/70 rounded-xl p-5 border border-blue-200 space-y-3">
        <div class="flex items-start space-x-3">
          <i class="pi pi-verified text-xl text-blue-700 mt-0.5 shrink-0"></i>
          <div class="space-y-1">
            <h4 class="text-sm font-bold text-blue-950">
              {{ t('iam.financialAccreditedTitle') }}
            </h4>
            <p class="text-xs text-blue-900 leading-relaxed">
              {{ t('iam.financialAccreditedDesc') }}
            </p>
          </div>
        </div>

        <div class="pt-2 flex flex-wrap gap-2">
          <router-link
            to="/concessionaries"
            class="inline-flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-900 hover:bg-blue-800 text-white shadow-xs transition-colors"
          >
            <i class="pi pi-building-columns text-xs"></i>
            <span>{{ t('iam.goToFinancialEntitiesBtn') }}</span>
          </router-link>
        </div>
      </div>

      <!-- State 2: Requesting Financial Institution Role via SUNAT (CIIU 64/66) -->
      <div v-else class="space-y-4">
        <!-- Sunat Requirement Alert Notice -->
        <div class="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100 flex items-start space-x-3 text-xs text-indigo-950 leading-relaxed">
          <i class="pi pi-info-circle text-indigo-600 text-base mt-0.5 shrink-0"></i>
          <div>
            <p class="font-semibold text-indigo-950 mb-0.5">{{ t('iam.financialSunatRequirementTitle') }}</p>
            <p>{{ t('iam.financialSunatRequirementDesc') }}</p>
          </div>
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg text-xs text-emerald-800 flex items-center space-x-2">
          <i class="pi pi-check-circle text-emerald-600 text-sm"></i>
          <span class="font-medium">{{ successMessage }}</span>
        </div>

        <!-- Error Alert -->
        <div v-if="iamStore.error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-xs text-red-700 flex items-center space-x-2">
          <i class="pi pi-exclamation-circle text-red-500 text-sm"></i>
          <span>{{ iamStore.error }}</span>
        </div>

        <!-- Financial Elevation Form -->
        <form @submit.prevent="handleRequestFinancialRole" class="space-y-4">
          <div>
            <div class="flex justify-between items-center mb-1">
              <label for="financial-ruc" class="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                {{ t('iam.rucNumber') }} (SUNAT)
              </label>
              <button
                type="button"
                @click="fillDemoFinancialRuc"
                class="text-xs text-blue-900 hover:text-blue-700 font-semibold underline flex items-center space-x-1"
              >
                <i class="pi pi-sparkles text-[11px]"></i>
                <span>{{ t('iam.fillDemoFinancialRucBtn') }}</span>
              </button>
            </div>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <i class="pi pi-building-columns text-sm"></i>
              </span>
              <input
                id="financial-ruc"
                v-model="ruc"
                type="text"
                required
                maxlength="11"
                minlength="11"
                pattern="[0-9]{11}"
                placeholder="20100047218"
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
              />
            </div>
            <p class="text-[11px] text-gray-500 mt-1">
              {{ t('iam.financialRucFormatHint') }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="iamStore.isLoading || !ruc || ruc.length !== 11"
            class="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="iamStore.isLoading" class="pi pi-spin pi-spinner text-sm"></i>
            <i v-else class="pi pi-shield text-sm"></i>
            <span>{{ iamStore.isLoading ? t('iam.verifyingSunat') : t('iam.requestFinancialBtn') }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../application/iam.store'
import { RoleRequestCommand } from '../../domain/role-request.command'

type ElevationTab = 'DEALER' | 'FINANCIAL_INSTITUTION'

const { t } = useI18n()
const iamStore = useIamStore()

const selectedRole = ref<ElevationTab>('DEALER')
const ruc = ref('')
const successMessage = ref('')

const isDealer = computed(() => {
  return iamStore.roles.includes('ROLE_DEALER')
})

const isFinancialInstitution = computed(() => {
  return iamStore.roles.includes('ROLE_FINANCIAL_INSTITUTION')
})

const switchTab = (tab: ElevationTab) => {
  selectedRole.value = tab
  ruc.value = ''
  successMessage.value = ''
  iamStore.error = null
}

const fillDemoDealerRuc = () => {
  // Toyota del Perú S.A. (Automotive CIIU 451 registered in SUNAT)
  ruc.value = '20100138019'
}

const fillDemoFinancialRuc = () => {
  // Banco de Crédito del Perú BCP (Financial Intermediation CIIU 6419 registered in SUNAT)
  ruc.value = '20100047218'
}

const handleRequestDealerRole = async () => {
  if (!iamStore.currentUser?.id) return

  successMessage.value = ''
  const command = new RoleRequestCommand({
    userId: iamStore.currentUser.id,
    ruc: ruc.value
  })

  const success = await iamStore.requestDealerRole(command)
  if (success) {
    successMessage.value = t('iam.dealerRequestSuccess')
    ruc.value = ''
  }
}

const handleRequestFinancialRole = async () => {
  if (!iamStore.currentUser?.id) return

  successMessage.value = ''
  const command = new RoleRequestCommand({
    userId: iamStore.currentUser.id,
    ruc: ruc.value
  })

  const success = await iamStore.requestFinancialInstitutionRole(command)
  if (success) {
    successMessage.value = t('iam.financialRequestSuccess')
    ruc.value = ''
  }
}
</script>
