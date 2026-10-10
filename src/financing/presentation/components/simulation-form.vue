<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { CreateSimulationCommand } from '../../domain/create-simulation.command'
import { useFinancingStore } from '../../application/financing.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { usePartnersStore } from '@/partners/application/partners.store'
import { useIamStore } from '@/iam/application/iam.store'

const { t } = useI18n()
const route = useRoute()
const financingStore = useFinancingStore()
const catalogStore = useCatalogStore()
const partnersStore = usePartnersStore()
const iamStore = useIamStore()

// Form reactive fields
const title = ref<string>('Simulación de Crédito Vehicular')
const currency = ref<string>('USD')
const vehiclePriceAmount = ref<number>(25000)
const downPaymentPercentage = ref<number>(20)
const loanTermMonths = ref<number>(36)
const annualEffectiveRate = ref<number>(9.5)
const monthlyCreditLifeInsuranceRate = ref<number>(0.05)
const vehicleInsuranceFeeAmount = ref<number>(60)
const vehicleInsuranceType = ref<string>('MENSUAL')
const gracePeriodType = ref<string>('NONE')
const gracePeriodMonths = ref<number>(0)
const initialFeesAmount = ref<number>(150)
const discountRate = ref<number>(8.0)
const startDate = ref<string>((new Date().toISOString().split('T')[0] as string))

// Selected Foreign Keys / References
const vehicleId = ref<string>('')
const financialEntityId = ref<string>('')

const currencyOptions = [
  { label: 'USD ($) - Dólares', value: 'USD' },
  { label: 'PEN (S/) - Soles', value: 'PEN' }
]

const vehicleInsuranceTypeOptions = [
  { label: 'Cuota Mensual (MENSUAL)', value: 'MENSUAL' },
  { label: 'Financiado en el Préstamo (FINANCIADO)', value: 'FINANCIADO' },
  { label: 'Póliza Endosada / Propia (ENDOSADO)', value: 'ENDOSADO' }
]

const termPresets = [12, 24, 36, 48, 60]
const downPaymentPresets = [10, 20, 30, 50]

const termOptions = [
  { label: '12 meses (1 año)', value: 12 },
  { label: '24 meses (2 años)', value: 24 },
  { label: '36 meses (3 años)', value: 36 },
  { label: '48 meses (4 años)', value: 48 },
  { label: '60 meses (5 años)', value: 60 }
]

const gracePeriodOptions = [
  { label: 'Sin Gracia (NONE)', value: 'NONE' },
  { label: 'Gracia Total (TOTAL)', value: 'TOTAL' },
  { label: 'Gracia Parcial (PARTIAL)', value: 'PARTIAL' }
]

// Computed calculations for live preview
const calculatedDownPaymentAmount = computed(() => {
  return (vehiclePriceAmount.value * downPaymentPercentage.value) / 100
})

const calculatedLoanPrincipal = computed(() => {
  return Math.max(0, vehiclePriceAmount.value - calculatedDownPaymentAmount.value)
})

const currencySymbol = computed(() => {
  return currency.value === 'PEN' ? 'S/' : '$'
})

// Dynamic Select Options from Stores
const vehicleOptions = computed(() => {
  return catalogStore.vehicles.map((v) => ({
    label: `${v.brand} ${v.model} (${v.manufactureYear}) - ${v.formattedPrice}`,
    value: v.id,
    price: v.priceAmount,
    currency: v.currency,
    brand: v.brand,
    model: v.model
  }))
})

const financialEntityOptions = computed(() => {
  return partnersStore.financialEntities.map((e) => ({
    label: e.name + (e.ruc ? ` (RUC: ${e.ruc})` : ''),
    value: e.id,
    entity: e
  }))
})

onMounted(async () => {
  // Load background stores for dynamic selectors
  if (!catalogStore.hasVehicles) {
    await catalogStore.fetchVehicles()
  }
  if (!partnersStore.hasEntities) {
    await partnersStore.fetchFinancialEntities()
  }

  // Pre-select vehicle if passed in query param or available from store
  if (route.query.vehicleId) {
    vehicleId.value = route.query.vehicleId as string
  } else if (catalogStore.vehicles.length > 0) {
    vehicleId.value = catalogStore.vehicles[0]?.id || ''
  }

  // Pre-select financial entity if passed in query param or available from store
  if (route.query.financialEntityId) {
    financialEntityId.value = route.query.financialEntityId as string
  } else if (partnersStore.financialEntities.length > 0) {
    financialEntityId.value = partnersStore.financialEntities[0]?.id || ''
  }
})

// Sync form values when vehicle selection changes
watch(vehicleId, (newVehicleId) => {
  const selected = catalogStore.vehicles.find((v) => v.id === newVehicleId)
  if (selected) {
    vehiclePriceAmount.value = selected.priceAmount
    currency.value = selected.currency || 'USD'
    title.value = `Simulación ${selected.brand} ${selected.model}`
  }
})

// Sync TEA rate when financial entity or term changes
watch([financialEntityId, loanTermMonths], ([newEntityId, newTerm]) => {
  const entity = partnersStore.financialEntities.find((e) => e.id === newEntityId)
  if (entity) {
    const benchmark = entity.getBenchmarkForTerm(newTerm)
    if (benchmark) {
      annualEffectiveRate.value = benchmark.annualEffectiveRate
      monthlyCreditLifeInsuranceRate.value = benchmark.monthlyCreditLifeInsuranceRate
    }
  }
})

const resolveCurrentUserId = (): string => {
  if (iamStore.currentUser?.id && String(iamStore.currentUser.id) !== 'undefined' && String(iamStore.currentUser.id) !== 'null') {
    return String(iamStore.currentUser.id)
  }
  const saved = localStorage.getItem('user_id')
  if (saved && saved !== 'undefined' && saved !== 'null') {
    return saved
  }
  const token = localStorage.getItem('access_token')
  if (token) {
    try {
      const parts = token.split('.')
      if (parts.length === 3 && parts[1]) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
        if (payload.id) return String(payload.id)
        if (payload.userId) return String(payload.userId)
        if (payload.sub && !payload.sub.includes('@')) return String(payload.sub)
      }
    } catch {
      // Ignore
    }
  }
  return '101'
}

const handleSubmit = async () => {
  const currentUserId = resolveCurrentUserId()

  const selectedVehicleId = vehicleId.value || (catalogStore.vehicles[0]?.id || '')
  const selectedEntityId = financialEntityId.value || (partnersStore.financialEntities[0]?.id || '')

  if (!selectedVehicleId) {
    financingStore.error = 'Por favor selecciona un vehículo del catálogo para calcular la simulación.'
    return
  }

  if (!selectedEntityId) {
    financingStore.error = 'Por favor selecciona una entidad financiera aliada para calcular la simulación.'
    return
  }

  const command = new CreateSimulationCommand(
    title.value || `Simulación de Crédito`,
    currentUserId,
    selectedVehicleId,
    selectedEntityId,
    vehiclePriceAmount.value,
    currency.value,
    downPaymentPercentage.value,
    0, // balloonPaymentPercentage
    annualEffectiveRate.value,
    monthlyCreditLifeInsuranceRate.value,
    vehicleInsuranceFeeAmount.value,
    vehicleInsuranceType.value,
    loanTermMonths.value,
    gracePeriodType.value,
    gracePeriodMonths.value,
    initialFeesAmount.value,
    discountRate.value,
    startDate.value
  )

  await financingStore.createSimulation(command)
}
</script>

<template>
  <div class="rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
      <div class="flex items-center gap-3.5">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
          <i class="pi pi-sliders-h text-xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {{ t('financing.formTitle') }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {{ t('financing.formSubtitle') }}
          </p>
        </div>
      </div>

      <!-- Quick live financed readout badge -->
      <div class="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-4 py-2 text-xs">
        <span class="text-slate-500 dark:text-slate-400">Monto a Financiar:</span>
        <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">
          {{ currencySymbol }} {{ calculatedLoanPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        </span>
      </div>
    </div>

    <!-- Error Alert -->
    <Message v-if="financingStore.error" severity="error" class="!rounded-2xl !text-xs">
      {{ financingStore.error }}
    </Message>

    <!-- Simulation Inputs Form -->
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Section 1: Auto & Entidad -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <i class="pi pi-car"></i>
          <span>1. Selección de Vehículo y Entidad Bancaria</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <!-- Dynamic Vehicle Selector -->
          <div class="flex flex-col gap-2 sm:col-span-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{{ t('financing.selectVehicleLabel') || 'Vehículo a Financiar' }}</span>
              <span class="text-[11px] font-normal text-slate-400">Catálogo disponible</span>
            </label>
            <Select
              v-model="vehicleId"
              :options="vehicleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona un vehículo del catálogo..."
              class="w-full !rounded-2xl !text-sm border-slate-200 dark:border-slate-800"
            />
          </div>

          <!-- Dynamic Financial Entity Selector -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {{ t('financing.selectEntityLabel') || 'Entidad Financiera' }}
            </label>
            <Select
              v-model="financialEntityId"
              :options="financialEntityOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona una entidad..."
              class="w-full !rounded-2xl !text-sm border-slate-200 dark:border-slate-800"
            />
          </div>
        </div>
      </div>

      <!-- Section 2: Montos y Plazos -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <i class="pi pi-dollar"></i>
          <span>2. Parámetros de Préstamo y Cuota Inicial</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <!-- Title Input -->
          <div class="flex flex-col gap-2 sm:col-span-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ t('financing.titleLabel') }}</label>
            <InputText v-model="title" class="w-full !rounded-2xl !text-sm border-slate-200 dark:border-slate-800" />
          </div>

          <!-- Currency -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ t('financing.currencyLabel') }}</label>
            <Select
              v-model="currency"
              :options="currencyOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full !rounded-2xl !text-sm border-slate-200 dark:border-slate-800"
            />
          </div>

          <!-- Vehicle Price -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ t('financing.vehiclePriceLabel') }}</label>
            <InputNumber
              v-model="vehiclePriceAmount"
              mode="currency"
              :currency="currency"
              locale="en-US"
              class="w-full !rounded-2xl !text-sm"
            />
          </div>

          <!-- Down Payment % with Quick Chips -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ t('financing.downPaymentPctLabel') }}</label>
              <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {{ currencySymbol }} {{ calculatedDownPaymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </span>
            </div>
            <InputNumber
              v-model="downPaymentPercentage"
              suffix="%"
              :min="10"
              :max="90"
              class="w-full !rounded-2xl !text-sm"
            />
            <!-- Quick Chips for Down Payment -->
            <div class="flex items-center gap-1.5 pt-1">
              <span class="text-[10px] text-slate-400">Presets:</span>
              <button
                v-for="preset in downPaymentPresets"
                :key="preset"
                type="button"
                @click="downPaymentPercentage = preset"
                :class="[
                  'px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all',
                  downPaymentPercentage === preset
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                ]"
              >
                {{ preset }}%
              </button>
            </div>
          </div>

          <!-- Loan Term Months with Quick Chips -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ t('financing.termMonthsLabel') }}</label>
            <Select
              v-model="loanTermMonths"
              :options="termOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full !rounded-2xl !text-sm border-slate-200 dark:border-slate-800"
            />
            <!-- Quick Chips for Term -->
            <div class="flex items-center gap-1.5 pt-1">
              <span class="text-[10px] text-slate-400">Plazos:</span>
              <button
                v-for="preset in termPresets"
                :key="preset"
                type="button"
                @click="loanTermMonths = preset"
                :class="[
                  'px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all',
                  loanTermMonths === preset
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                ]"
              >
                {{ preset }}m
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Tasas y Seguros -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <i class="pi pi-percentage"></i>
          <span>3. Tasas de Interés, Seguros y Periodo de Gracia</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Annual Effective Rate (TEA %) -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ t('financing.teaRateLabel') }}</label>
            <InputNumber
              v-model="annualEffectiveRate"
              suffix="%"
              :minFractionDigits="2"
              class="w-full !rounded-2xl !text-sm"
            />
          </div>

          <!-- Credit Life Insurance % -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ t('financing.creditInsuranceLabel') }}</label>
            <InputNumber
              v-model="monthlyCreditLifeInsuranceRate"
              suffix="%"
              :minFractionDigits="2"
              class="w-full !rounded-2xl !text-sm"
            />
          </div>

          <!-- Vehicle Insurance Fee -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ t('financing.vehicleInsuranceLabel') }}</label>
            <InputNumber
              v-model="vehicleInsuranceFeeAmount"
              mode="currency"
              :currency="currency"
              locale="en-US"
              class="w-full !rounded-2xl !text-sm"
            />
          </div>

          <!-- Vehicle Insurance Type -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Tipo de Seguro Vehicular</label>
            <Select
              v-model="vehicleInsuranceType"
              :options="vehicleInsuranceTypeOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full !rounded-2xl !text-sm border-slate-200 dark:border-slate-800"
            />
          </div>

          <!-- Grace Period Type -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ t('financing.graceTypeLabel') }}</label>
            <Select
              v-model="gracePeriodType"
              :options="gracePeriodOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full !rounded-2xl !text-sm border-slate-200 dark:border-slate-800"
            />
          </div>

          <!-- Grace Period Months (conditional) -->
          <div class="flex flex-col gap-2" v-if="gracePeriodType !== 'NONE'">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ t('financing.graceMonthsLabel') }}</label>
            <InputNumber v-model="gracePeriodMonths" :min="1" :max="6" class="w-full !rounded-2xl !text-sm" />
          </div>

          <!-- Start Date -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ t('financing.startDateLabel') }}</label>
            <InputText v-model="startDate" type="date" class="w-full !rounded-2xl !text-sm border-slate-200 dark:border-slate-800" />
          </div>
        </div>
      </div>

      <!-- Submit Action Bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <i class="pi pi-shield text-emerald-500"></i>
          <span>Cálculo financiero según normativa SBS Perú (Método Francés).</span>
        </div>

        <Button
          type="submit"
          :label="t('financing.calculateBtn')"
          icon="pi pi-calculator"
          :loading="financingStore.isLoading"
          class="w-full sm:w-auto px-8 py-3.5 !rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all"
        />
      </div>
    </form>
  </div>
</template>

