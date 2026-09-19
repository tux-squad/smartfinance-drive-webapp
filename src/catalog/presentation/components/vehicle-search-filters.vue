<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { useCatalogStore } from '../../application/catalog.store'

const { t } = useI18n()
const catalogStore = useCatalogStore()

// Local filter reactive form state
const brandInput = ref<string>(catalogStore.filters.brand || '')
const modelInput = ref<string>(catalogStore.filters.model || '')
const conditionInput = ref<string>(catalogStore.filters.condition || '')
const minPriceInput = ref<number | undefined>(catalogStore.filters.minPrice)
const maxPriceInput = ref<number | undefined>(catalogStore.filters.maxPrice)
const minYearInput = ref<number | undefined>(catalogStore.filters.minYear)
const maxYearInput = ref<number | undefined>(catalogStore.filters.maxYear)

onMounted(() => {
  catalogStore.fetchBrands()
})

const conditionOptions = [
  { label: t('catalog.allConditions'), value: '' },
  { label: t('catalog.conditionNew'), value: 'NEW' },
  { label: t('catalog.conditionUsed'), value: 'USED' }
]

const handleSearch = () => {
  catalogStore.fetchVehicles({
    brand: brandInput.value,
    model: modelInput.value,
    condition: conditionInput.value,
    minPrice: minPriceInput.value,
    maxPrice: maxPriceInput.value,
    minYear: minYearInput.value,
    maxYear: maxYearInput.value,
    page: 0
  })
}

const handleReset = () => {
  brandInput.value = ''
  modelInput.value = ''
  conditionInput.value = ''
  minPriceInput.value = undefined
  maxPriceInput.value = undefined
  minYearInput.value = undefined
  maxYearInput.value = undefined
  catalogStore.resetFilters()
}

// Watch store filters for external reset changes
watch(
  () => catalogStore.filters,
  (newFilters) => {
    brandInput.value = newFilters.brand || ''
    modelInput.value = newFilters.model || ''
    conditionInput.value = newFilters.condition || ''
    minPriceInput.value = newFilters.minPrice
    maxPriceInput.value = newFilters.maxPrice
    minYearInput.value = newFilters.minYear
    maxYearInput.value = newFilters.maxYear
  },
  { deep: true }
)
</script>

<template>
  <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <i class="pi pi-filter text-sm"></i>
        </div>
        <h3 class="text-base font-bold text-gray-900 dark:text-white">
          {{ t('catalog.filtersTitle') }}
        </h3>
        <span
          v-if="catalogStore.activeFiltersCount > 0"
          class="inline-flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300"
        >
          {{ catalogStore.activeFiltersCount }}
        </span>
      </div>

      <Button
        v-if="catalogStore.activeFiltersCount > 0"
        :label="t('catalog.clearFiltersBtn')"
        icon="pi pi-filter-slash"
        text
        severity="secondary"
        size="small"
        class="!text-xs !py-1 text-gray-500 hover:text-red-600"
        @click="handleReset"
      />
    </div>

    <!-- Filter Form Controls Grid -->
    <form @submit.prevent="handleSearch" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
      <!-- Brand Input with Brands Datalist from GET /api/v1/vehicles/brands -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('catalog.brandLabel') }}</label>
        <span class="p-input-icon-left w-full">
          <InputText
            v-model="brandInput"
            list="vehicle-brands-list"
            :placeholder="t('catalog.brandPlaceholder')"
            class="w-full !rounded-xl !text-sm"
          />
          <datalist id="vehicle-brands-list">
            <option v-for="brand in catalogStore.brands" :key="brand" :value="brand" />
          </datalist>
        </span>
      </div>

      <!-- Model Input -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('catalog.modelLabel') }}</label>
        <InputText
          v-model="modelInput"
          :placeholder="t('catalog.modelPlaceholder')"
          class="w-full !rounded-xl !text-sm"
        />
      </div>

      <!-- Condition Selector -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('catalog.conditionLabel') }}</label>
        <Select
          v-model="conditionInput"
          :options="conditionOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full !rounded-xl !text-sm"
        />
      </div>

      <!-- Price Range Grid -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('catalog.priceRangeLabel') }}</label>
        <div class="flex items-center gap-2">
          <InputNumber
            v-model="minPriceInput"
            :placeholder="t('catalog.minPricePlaceholder')"
            mode="currency"
            currency="USD"
            locale="en-US"
            class="w-full !rounded-xl !text-sm"
          />
          <span class="text-gray-400 text-xs">-</span>
          <InputNumber
            v-model="maxPriceInput"
            :placeholder="t('catalog.maxPricePlaceholder')"
            mode="currency"
            currency="USD"
            locale="en-US"
            class="w-full !rounded-xl !text-sm"
          />
        </div>
      </div>

      <!-- Year Range Grid -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('catalog.yearRangeLabel') }}</label>
        <div class="flex items-center gap-2">
          <InputNumber
            v-model="minYearInput"
            :placeholder="t('catalog.minYearPlaceholder')"
            :useGrouping="false"
            :min="1990"
            :max="2026"
            class="w-full !rounded-xl !text-sm"
          />
          <span class="text-gray-400 text-xs">-</span>
          <InputNumber
            v-model="maxYearInput"
            :placeholder="t('catalog.maxYearPlaceholder')"
            :useGrouping="false"
            :min="1990"
            :max="2026"
            class="w-full !rounded-xl !text-sm"
          />
        </div>
      </div>

      <!-- Submit Search Button -->
      <div class="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
        <Button
          type="submit"
          :label="t('catalog.searchBtn')"
          icon="pi pi-search"
          severity="success"
          class="w-full sm:w-auto px-6 !rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20"
        />
      </div>
    </form>
  </div>
</template>
