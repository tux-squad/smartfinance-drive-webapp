<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Message from 'primevue/message'
import { CalculateDepreciationCommand } from '../../domain/calculate-depreciation.command'
import { useProjectionsStore } from '../../application/projections.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'

const { t } = useI18n()
const projectionsStore = useProjectionsStore()
const catalogStore = useCatalogStore()

const selectedVehicleId = ref<string>('')
const initialValueAmount = ref<number | null>(25000)
const currency = ref<'USD' | 'PEN'>('USD')
const manufactureYear = ref<number>(new Date().getFullYear())
const annualDepreciationRatePct = ref<number>(10)
const projectionYears = ref<number>(5)

const validationError = ref<string | null>(null)

const currencyOptions = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'PEN (S/)', value: 'PEN' }
]

const yearsOptions = [
  { label: '3 años', value: 3 },
  { label: '5 años (Estándar)', value: 5 },
  { label: '7 años', value: 7 },
  { label: '10 años', value: 10 }
]

onMounted(async () => {
  if (!catalogStore.hasVehicles) {
    await catalogStore.fetchVehicles({ size: 50 })
  }
})

watch(selectedVehicleId, (newId) => {
  if (newId) {
    const vehicle = catalogStore.vehicles.find((v) => v.id === newId)
    if (vehicle) {
      initialValueAmount.value = vehicle.priceAmount
      currency.value = vehicle.currency as 'USD' | 'PEN'
      manufactureYear.value = vehicle.manufactureYear
    }
  }
})

const handleCalculate = async () => {
  validationError.value = null

  if (!initialValueAmount.value || initialValueAmount.value <= 0) {
    validationError.value = t('projections.form.errorInvalidAmount')
    return
  }
  if (!annualDepreciationRatePct.value || annualDepreciationRatePct.value <= 0) {
    validationError.value = t('projections.form.errorInvalidRate')
    return
  }

  const command = new CalculateDepreciationCommand(
    initialValueAmount.value,
    currency.value,
    manufactureYear.value,
    annualDepreciationRatePct.value,
    projectionYears.value,
    selectedVehicleId.value || undefined
  )

  await projectionsStore.calculateDepreciation(command)
}
</script>

<template>
  <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        <i class="pi pi-chart-line text-lg"></i>
      </div>
      <div>
        <h3 class="text-base font-bold text-gray-900 dark:text-white">
          {{ t('projections.form.title') }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('projections.form.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Error Alert -->
    <Message v-if="validationError || projectionsStore.error" severity="error" class="!rounded-xl !text-xs">
      {{ validationError || projectionsStore.error }}
    </Message>

    <!-- Optional Vehicle Selector from Catalog -->
    <div v-if="catalogStore.hasVehicles" class="space-y-1.5">
      <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
        {{ t('projections.form.selectVehicleLabel') }}
      </label>
      <Select
        v-model="selectedVehicleId"
        :options="catalogStore.vehicles"
        optionLabel="displayName"
        optionValue="id"
        placeholder="Seleccionar vehículo del catálogo (Opcional)..."
        showClear
        class="w-full !rounded-xl !text-xs"
      />
    </div>

    <!-- Inputs Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Initial Amount -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
          {{ t('projections.form.initialValueLabel') }} *
        </label>
        <InputNumber
          v-model="initialValueAmount"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          :min="0"
          placeholder="25000.00"
          class="w-full !rounded-xl !text-xs"
        />
      </div>

      <!-- Currency -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
          {{ t('projections.form.currencyLabel') }} *
        </label>
        <Select
          v-model="currency"
          :options="currencyOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full !rounded-xl !text-xs"
        />
      </div>

      <!-- Year -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
          {{ t('projections.form.manufactureYearLabel') }} *
        </label>
        <InputNumber
          v-model="manufactureYear"
          :useGrouping="false"
          :min="1990"
          :max="2030"
          class="w-full !rounded-xl !text-xs"
        />
      </div>

      <!-- Annual Depreciation Rate % -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
          {{ t('projections.form.annualRateLabel') }} *
        </label>
        <InputNumber
          v-model="annualDepreciationRatePct"
          suffix=" %"
          :min="1"
          :max="50"
          class="w-full !rounded-xl !text-xs"
        />
      </div>

      <!-- Projection Years -->
      <div class="space-y-1.5 sm:col-span-2">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
          {{ t('projections.form.projectionYearsLabel') }} *
        </label>
        <Select
          v-model="projectionYears"
          :options="yearsOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full !rounded-xl !text-xs"
        />
      </div>
    </div>

    <!-- Submit Action -->
    <div class="pt-2">
      <Button
        :label="t('projections.form.calculateBtn')"
        icon="pi pi-chart-line"
        :loading="projectionsStore.isLoading"
        class="w-full !rounded-xl py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
        @click="handleCalculate"
      />
    </div>
  </div>
</template>
