<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import { useCatalogStore } from '../../application/catalog.store'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const catalogStore = useCatalogStore()

const vehicleId = computed(() => route.params.id as string)

onMounted(async () => {
  if (vehicleId.value) {
    await catalogStore.fetchVehicleById(vehicleId.value)
  }
})

const defaultImage = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
const vehicle = computed(() => catalogStore.selectedVehicle)
const imageUrl = computed(() => vehicle.value?.imagePath || defaultImage)
const isNew = computed(() => vehicle.value?.condition === 'NEW')

const goBack = () => {
  router.push({ name: 'vehicle-catalog' })
}

const goToSimulation = () => {
  if (vehicle.value) {
    router.push({ name: 'simulations', query: { vehicleId: vehicle.value.id } })
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Back Button Bar -->
    <div>
      <Button
        :label="t('catalog.backToCatalog')"
        icon="pi pi-arrow-left"
        text
        severity="secondary"
        class="!text-sm hover:text-emerald-600"
        @click="goBack"
      />
    </div>

    <!-- Loading State -->
    <div v-if="catalogStore.isLoading" class="flex flex-col items-center justify-center py-24 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">{{ t('catalog.loadingDetailText') }}</p>
    </div>

    <!-- Error / Not Found State -->
    <div
      v-else-if="catalogStore.error || !vehicle"
      class="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center dark:border-red-900/30 dark:bg-red-950/20"
    >
      <i class="pi pi-exclamation-triangle text-3xl text-red-500 mb-2"></i>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">
        {{ t('catalog.vehicleNotFoundTitle') }}
      </h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ catalogStore.error || t('catalog.vehicleNotFoundSubtitle') }}
      </p>
      <Button
        :label="t('catalog.backToCatalog')"
        icon="pi pi-arrow-left"
        severity="success"
        class="mt-4 rounded-xl !text-xs"
        @click="goBack"
      />
    </div>

    <!-- Main Detail Layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Image Preview & Technical Specs -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Vehicle Hero Image -->
        <div class="relative overflow-hidden rounded-3xl border border-gray-100 bg-gray-900 shadow-lg dark:border-gray-800">
          <img
            :src="imageUrl"
            :alt="vehicle.displayName"
            class="h-96 w-full object-cover"
            @error="(e: Event) => ((e.target as HTMLImageElement).src = defaultImage)"
          />
          <div class="absolute top-4 left-4 flex gap-2">
            <Tag
              :value="isNew ? t('catalog.conditionNew') : t('catalog.conditionUsed')"
              :severity="isNew ? 'success' : 'warn'"
              class="!text-xs font-bold px-3 py-1.5 rounded-full shadow-md"
            />
            <span class="rounded-full bg-black/70 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white shadow-md">
              {{ vehicle.manufactureYear }}
            </span>
          </div>
        </div>

        <!-- Technical Specs Card -->
        <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="pi pi-list text-emerald-600"></i>
            {{ t('catalog.technicalSpecsTitle') }}
          </h3>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <span class="text-xs text-gray-500 dark:text-gray-400 block">{{ t('catalog.brandLabel') }}</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ vehicle.brand }}</span>
            </div>

            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <span class="text-xs text-gray-500 dark:text-gray-400 block">{{ t('catalog.modelLabel') }}</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ vehicle.model }}</span>
            </div>

            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <span class="text-xs text-gray-500 dark:text-gray-400 block">{{ t('catalog.yearLabel') }}</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ vehicle.manufactureYear }}</span>
            </div>

            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <span class="text-xs text-gray-500 dark:text-gray-400 block">{{ t('catalog.conditionLabel') }}</span>
              <span class="font-bold text-gray-900 dark:text-white">
                {{ isNew ? t('catalog.conditionNew') : t('catalog.conditionUsed') }}
              </span>
            </div>

            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 col-span-2">
              <span class="text-xs text-gray-500 dark:text-gray-400 block">{{ t('catalog.vehicleIdLabel') }}</span>
              <span class="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">{{ vehicle.id }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Financing & Pricing Action Box -->
      <div class="lg:col-span-5 space-y-6">
        <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 space-y-6">
          <div>
            <span class="inline-block rounded-full bg-emerald-50 dark:bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
              {{ t('catalog.financingAvailableBadge') }}
            </span>
            <h1 class="text-2xl font-black text-gray-900 dark:text-white">
              {{ vehicle.brand }} {{ vehicle.model }}
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('catalog.yearLabel') }}: {{ vehicle.manufactureYear }}
            </p>
          </div>

          <!-- Price Box -->
          <div class="rounded-2xl bg-emerald-500/10 p-5 border border-emerald-500/20">
            <span class="text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wider font-bold block mb-1">
              {{ t('catalog.cashPriceLabel') }}
            </span>
            <div class="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {{ vehicle.formattedPrice }}
            </div>
            <p class="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-1">
              * {{ t('catalog.priceNote') }}
            </p>
          </div>

          <!-- Feature Bullets -->
          <div class="space-y-3 pt-2 text-xs text-gray-600 dark:text-gray-300">
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-emerald-500"></i>
              <span>{{ t('catalog.benefit1') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-emerald-500"></i>
              <span>{{ t('catalog.benefit2') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-emerald-500"></i>
              <span>{{ t('catalog.benefit3') }}</span>
            </div>
          </div>

          <!-- Main CTA: Simulate Loan -->
          <Button
            :label="t('catalog.simulateLoanBtn')"
            icon="pi pi-calculator"
            severity="success"
            size="large"
            class="w-full !rounded-2xl !py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 border-none hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-600/30"
            @click="goToSimulation"
          />
        </div>
      </div>
    </div>
  </div>
</template>
