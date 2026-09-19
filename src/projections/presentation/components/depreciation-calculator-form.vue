<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Message from 'primevue/message'
import { CalculateDepreciationCommand } from '../../domain/calculate-depreciation.command'
import { useProjectionsStore } from '../../application/projections.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'

const { t } = useI18n()
const projectionsStore = useProjectionsStore()
const catalogStore = useCatalogStore()

const selectedVehicleId = ref<string>('')
const manualVehicleId = ref<string>('')
const projectionYears = ref<number>(5)
const validationError = ref<string | null>(null)

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
  if (catalogStore.vehicles.length > 0 && catalogStore.vehicles[0]?.id) {
    selectedVehicleId.value = catalogStore.vehicles[0].id
  }
})

watch(selectedVehicleId, (newId) => {
  if (newId) {
    manualVehicleId.value = newId
  }
})

const handleCalculate = async () => {
  validationError.value = null

  const vehicleIdToUse = selectedVehicleId.value.trim() || manualVehicleId.value.trim()

  if (!vehicleIdToUse) {
    validationError.value = 'Por favor selecciona o ingresa un UUID de vehículo.'
    return
  }

  const command = new CalculateDepreciationCommand(
    vehicleIdToUse,
    projectionYears.value
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

    <!-- Vehicle Selector from Catalog -->
    <div v-if="catalogStore.hasVehicles" class="space-y-1.5">
      <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
        {{ t('projections.form.selectVehicleLabel') }} *
      </label>
      <Select
        v-model="selectedVehicleId"
        :options="catalogStore.vehicles"
        optionLabel="displayName"
        optionValue="id"
        placeholder="Seleccionar vehículo del catálogo..."
        class="w-full !rounded-xl !text-xs"
      />
    </div>

    <!-- Manual Vehicle UUID Input (Fallback) -->
    <div v-else class="space-y-1.5">
      <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
        UUID del Vehículo *
      </label>
      <InputText
        v-model="manualVehicleId"
        placeholder="Ingresar UUID de vehículo..."
        class="w-full !rounded-xl !text-xs font-mono"
      />
    </div>

    <!-- Projection Years Select -->
    <div class="space-y-1.5">
      <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
        {{ t('projections.form.projectionYearsLabel') }} (Años) *
      </label>
      <Select
        v-model="projectionYears"
        :options="yearsOptions"
        optionLabel="label"
        optionValue="value"
        class="w-full !rounded-xl !text-xs"
      />
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
