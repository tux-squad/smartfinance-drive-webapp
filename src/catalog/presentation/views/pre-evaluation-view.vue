<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Loading Vehicle -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">Preparando formulario de pre-evaluación...</p>
    </div>

    <div v-else-if="!vehicle" class="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-xl mx-auto space-y-4">
      <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
        <i class="pi pi-car text-2xl"></i>
      </div>
      <h2 class="text-lg font-bold text-gray-900">Vehículo no encontrado</h2>
      <p class="text-xs text-gray-500">No se pudo cargar la información del vehículo para la pre-evaluación.</p>
      <router-link to="/vehicles" class="inline-flex items-center px-4 py-2 rounded-xl bg-[#eb8f47] text-white text-xs font-semibold">
        Volver al Catálogo
      </router-link>
    </div>

    <!-- Centered Form Card matching Mockup Image 3 -->
    <div v-else class="max-w-xl mx-auto bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-xs space-y-7">
      <!-- Title & Subtitle -->
      <div class="space-y-1.5 text-left">
        <h1 class="text-2xl font-extrabold tracking-tight text-gray-950">
          Solicitud de Pre-evaluación Crediticia
        </h1>
        <p class="text-xs text-gray-500 leading-relaxed">
          Tus datos serán enviados a entidades bancarias externas de forma segura.
        </p>
      </div>

      <!-- Vehicle Summary Box -->
      <div class="rounded-2xl bg-gray-50/80 border border-gray-200/80 p-5 flex items-center justify-between">
        <div class="space-y-0.5">
          <div class="text-sm font-extrabold text-gray-950">
            {{ vehicle.brand }} {{ vehicle.model }} {{ vehicle.manufactureYear }}
          </div>
          <div class="text-xs font-bold text-gray-500">
            {{ vehicle.formattedPrice }}
          </div>
        </div>

        <div class="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 shadow-2xs">
          <i class="pi pi-car text-base"></i>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-700 flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <button type="button" @click="errorMessage = null" class="text-red-400 hover:text-red-700">
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <!-- Pre-evaluation Form -->
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- DNI -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
            Número de Documento (DNI)
          </label>
          <input
            v-model="form.dni"
            type="text"
            maxlength="8"
            required
            placeholder="72481940"
            class="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
          />
        </div>

        <!-- Ingreso Mensual -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
            Ingreso Mensual (USD)
          </label>
          <input
            v-model.number="form.monthlyIncome"
            type="number"
            min="100"
            required
            placeholder="2500"
            class="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
          />
        </div>

        <!-- Banco de Preferencia -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
            Banco de Preferencia
          </label>
          <div class="relative">
            <select
              v-model="form.selectedBankId"
              required
              class="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Selecciona una entidad financiera aliada</option>
              <option
                v-for="bank in availableBanks"
                :key="bank.id"
                :value="bank.id"
              >
                {{ bank.name }} {{ bank.ruc ? `(RUC: ${bank.ruc})` : '' }}
              </option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
              <i class="pi pi-chevron-down text-xs"></i>
            </span>
          </div>
        </div>

        <!-- Consent Checkbox -->
        <div class="pt-1 flex items-start gap-2.5">
          <input
            id="termsConsent"
            v-model="form.consent"
            type="checkbox"
            required
            class="h-4 w-4 rounded border-gray-300 text-[#eb8f47] focus:ring-[#eb8f47] mt-0.5 cursor-pointer"
          />
          <label for="termsConsent" class="text-xs text-gray-600 select-none cursor-pointer">
            Autorizo el tratamiento de mis datos para evaluación externa.
          </label>
        </div>

        <!-- Action Submit Button matching Mockup Image 3 -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="isSubmitting || !form.consent"
            class="w-full py-3.5 px-4 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] disabled:opacity-50 text-white font-bold text-xs text-center shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <i v-if="isSubmitting" class="pi pi-spin pi-spinner text-xs"></i>
            <span>Enviar Solicitud a Bancos</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { usePartnersStore } from '@/partners/application/partners.store'
import { useProfilesStore } from '@/profiles/application/profiles.store'
import { useFinancingStore } from '@/financing/application/financing.store'
import { useIamStore } from '@/iam/application/iam.store'

const route = useRoute()
const router = useRouter()
const catalogStore = useCatalogStore()
const partnersStore = usePartnersStore()
const profilesStore = useProfilesStore()
const financingStore = useFinancingStore()
const iamStore = useIamStore()

const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

const vehicleId = computed(() => route.params.id as string)
const vehicle = computed(() => catalogStore.selectedVehicle)

const form = reactive({
  dni: '',
  monthlyIncome: 2500,
  selectedBankId: '',
  consent: true
})

onMounted(async () => {
  isLoading.value = true
  const userId = iamStore.currentUser?.id || localStorage.getItem('user_id')

  await Promise.all([
    catalogStore.fetchVehicleById(vehicleId.value),
    partnersStore.fetchFinancialEntities(),
    userId ? profilesStore.fetchProfileByUserId(userId) : Promise.resolve()
  ])

  // Prefill from real profile if available
  if (profilesStore.currentProfile) {
    if (profilesStore.currentProfile.dni) {
      form.dni = profilesStore.currentProfile.dni
    }
    if (profilesStore.currentProfile.monthlyIncomeAmount) {
      form.monthlyIncome = profilesStore.currentProfile.monthlyIncomeAmount
    }
  }

  // Preselect bank if vehicle has financialEntityId or first bank in API
  if (vehicle.value?.financialEntityId) {
    form.selectedBankId = vehicle.value.financialEntityId
  } else if (partnersStore.financialEntities.length > 0) {
    const firstBank = partnersStore.financialEntities[0]
    if (firstBank) {
      form.selectedBankId = firstBank.id
    }
  }

  isLoading.value = false
})

const availableBanks = computed(() => {
  return partnersStore.financialEntities
})

const handleSubmit = async () => {
  if (!vehicle.value) return
  if (!form.selectedBankId) {
    errorMessage.value = 'Por favor selecciona un banco de preferencia.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  try {
    const todayStr = new Date().toISOString().split('T')[0] ?? '2026-09-19'
    const userId = String(iamStore.currentUser?.id || localStorage.getItem('user_id') || '1')

    const success = await financingStore.createSimulation({
      title: `Pre-evaluación ${vehicle.value.brand} ${vehicle.value.model}`,
      userId,
      vehicleId: vehicle.value.id,
      financialEntityId: form.selectedBankId,
      vehiclePriceAmount: vehicle.value.priceAmount,
      currency: vehicle.value.currency || 'USD',
      downPaymentPercentage: 10.0,
      balloonPaymentPercentage: 0.0,
      annualEffectiveRate: 8.9,
      monthlyCreditLifeInsuranceRate: 0.05,
      vehicleInsuranceFeeAmount: 80.0,
      vehicleInsuranceType: 'FULL_COVERAGE',
      loanTermMonths: 48,
      gracePeriodType: 'NONE',
      gracePeriodMonths: 0,
      initialFeesAmount: 150.0,
      discountRate: 8.0,
      startDate: todayStr
    })

    if (success) {
      // Navigate directly to applications report where the real simulation appears!
      router.push('/reports/applications')
    } else {
      errorMessage.value = financingStore.error || 'Ocurrió un error al procesar la solicitud con el banco.'
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Error al conectar con la entidad bancaria.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
</style>
