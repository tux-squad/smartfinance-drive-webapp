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
const vehicleInsuranceType = ref<string>('FULL_COVERAGE')
const gracePeriodType = ref<string>('NONE')
const gracePeriodMonths = ref<number>(0)
const initialFeesAmount = ref<number>(150)
const discountRate = ref<number>(8.0)
const startDate = ref<string>((new Date().toISOString().split('T')[0] as string))

// Selected Foreign Keys / References
const vehicleId = ref<string>('')
const financialEntityId = ref<string>('')

const currencyOptions = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'PEN (S/)', value: 'PEN' }
]

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

const handleSubmit = async () => {
  const currentUserId = iamStore.currentUser?.id ? String(iamStore.currentUser.id) : '101'

  const command = new CreateSimulationCommand(
    title.value,
    currentUserId,
    vehicleId.value || 'c9d8e7f6-5432-1098-7654-3210fe210987',
    financialEntityId.value || 'b1c2d3e4-f5a6-7b8c-9d0e-112233445566',
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
  <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
        <i class="pi pi-calculator text-lg"></i>
      </div>
      <div>
        <h3 class="text-base font-bold text-gray-900 dark:text-white">
          {{ t('financing.formTitle') }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('financing.formSubtitle') }}
        </p>
      </div>
    </div>

    <!-- Error Alert -->
    <Message v-if="financingStore.error" severity="error" class="!rounded-xl !text-xs">
      {{ financingStore.error }}
    </Message>

    <!-- Simulation Inputs Grid -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Dynamic Vehicle Selector -->
        <div class="flex flex-col gap-1.5 sm:col-span-2">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {{ t('financing.selectVehicleLabel') || 'Vehículo a Financiar' }}
          </label>
          <Select
            v-model="vehicleId"
            :options="vehicleOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecciona un vehículo del catálogo..."
            class="w-full !rounded-xl !text-sm"
          />
        </div>

        <!-- Dynamic Financial Entity Selector -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {{ t('financing.selectEntityLabel') || 'Entidad Financiera' }}
          </label>
          <Select
            v-model="financialEntityId"
            :options="financialEntityOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecciona una entidad..."
            class="w-full !rounded-xl !text-sm"
          />
        </div>

        <!-- Title Input -->
        <div class="flex flex-col gap-1.5 sm:col-span-2">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('financing.titleLabel') }}</label>
          <InputText v-model="title" class="w-full !rounded-xl !text-sm" />
        </div>

        <!-- Currency -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('financing.currencyLabel') }}</label>
          <Select
            v-model="currency"
            :options="currencyOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full !rounded-xl !text-sm"
          />
        </div>

        <!-- Vehicle Price -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('financing.vehiclePriceLabel') }}</label>
          <InputNumber
            v-model="vehiclePriceAmount"
            mode="currency"
            :currency="currency"
            locale="en-US"
            class="w-full !rounded-xl !text-sm"
          />
        </div>

        <!-- Down Payment % -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('financing.downPaymentPctLabel') }}</label>
          <InputNumber
            v-model="downPaymentPercentage"
            suffix="%"
            :min="10"
            :max="90"
            class="w-full !rounded-xl !text-sm"
          />
        </div>

        <!-- Loan Term Months -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('financing.termMonthsLabel') }}</label>
          <Select
            v-model="loanTermMonths"
            :options="termOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full !rounded-xl !text-sm"
          />
        </div>

        <!-- Annual Effective Rate (TEA %) -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('financing.teaRateLabel') }}</label>
          <InputNumber
            v-model="annualEffectiveRate"
            suffix="%"
            :minFractionDigits="2"
            class="w-full !rounded-xl !text-sm"
          />
        </div>

        <!-- Credit Life Insurance % -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('financing.creditInsuranceLabel') }}</label>
          <InputNumber
            v-model="monthlyCreditLifeInsuranceRate"
            suffix="%"
            :minFractionDigits="2"
            class="w-full !rounded-xl !text-sm"
          />
        </div>

        <!-- Vehicle Insurance Fee -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('financing.vehicleInsuranceLabel') }}</label>
          <InputNumber
            v-model="vehicleInsuranceFeeAmount"
            mode="currency"
            :currency="currency"
            locale="en-US"
            class="w-full !rounded-xl !text-sm"
          />
        </div>

        <!-- Grace Period Type -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('financing.graceTypeLabel') }}</label>
          <Select
            v-model="gracePeriodType"
            :options="gracePeriodOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full !rounded-xl !text-sm"
          />
        </div>

        <!-- Grace Period Months -->
        <div class="flex flex-col gap-1.5" v-if="gracePeriodType !== 'NONE'">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('financing.graceMonthsLabel') }}</label>
          <InputNumber v-model="gracePeriodMonths" :min="1" :max="6" class="w-full !rounded-xl !text-sm" />
        </div>

        <!-- Start Date -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('financing.startDateLabel') }}</label>
          <InputText v-model="startDate" type="date" class="w-full !rounded-xl !text-sm" />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end pt-2">
        <Button
          type="submit"
          :label="t('financing.calculateBtn')"
          icon="pi pi-play"
          :loading="financingStore.isLoading"
          severity="success"
          class="w-full sm:w-auto px-8 !rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-600/30"
        />
      </div>
    </form>
  </div>
</template>
