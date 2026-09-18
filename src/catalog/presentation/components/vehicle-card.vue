<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import type { Vehicle } from '../../domain/vehicle.entity'

const props = defineProps<{
  vehicle: Vehicle
}>()

const router = useRouter()
const { t } = useI18n()

// Default fallback image if vehicle has no custom image URL
const defaultImage = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
const imageUrl = computed(() => props.vehicle.imagePath || defaultImage)

const isNew = computed(() => props.vehicle.condition === 'NEW')

const goToDetail = () => {
  router.push({ name: 'vehicle-detail', params: { id: props.vehicle.id } })
}

const goToSimulation = () => {
  router.push({ name: 'simulations', query: { vehicleId: props.vehicle.id } })
}
</script>

<template>
  <div
    class="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
  >
    <!-- Card Header / Image Section -->
    <div class="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
      <img
        :src="imageUrl"
        :alt="vehicle.displayName"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        @error="(e: Event) => ((e.target as HTMLImageElement).src = defaultImage)"
      />
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

      <!-- Badges overlay -->
      <div class="absolute top-3 left-3 flex gap-2">
        <Tag
          :value="isNew ? t('catalog.conditionNew') : t('catalog.conditionUsed')"
          :severity="isNew ? 'success' : 'warn'"
          class="!text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm"
        />
        <span class="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white shadow-sm">
          {{ vehicle.manufactureYear }}
        </span>
      </div>

      <!-- Price Overlay at Bottom of Image -->
      <div class="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
        <span class="text-xs text-gray-200 uppercase tracking-wider font-medium">{{ t('catalog.priceLabel') }}</span>
        <span class="text-xl font-extrabold text-emerald-400 drop-shadow-md">
          {{ vehicle.formattedPrice }}
        </span>
      </div>
    </div>

    <!-- Card Content Section -->
    <div class="flex flex-1 flex-col justify-between p-5">
      <div>
        <!-- Brand & Model -->
        <h3 class="text-lg font-bold text-gray-900 group-hover:text-emerald-600 dark:text-white transition-colors">
          {{ vehicle.brand }} {{ vehicle.model }}
        </h3>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <i class="pi pi-car text-xs"></i>
          {{ t('catalog.vehicleCode') }}: <span class="font-mono text-gray-700 dark:text-gray-300">{{ vehicle.id.slice(0, 8) }}</span>
        </p>
      </div>

      <!-- Card Action Buttons -->
      <div class="mt-6 flex flex-col sm:flex-row items-center gap-2">
        <Button
          :label="t('catalog.viewDetailBtn')"
          icon="pi pi-eye"
          outlined
          severity="secondary"
          size="small"
          class="w-full sm:flex-1 rounded-xl !text-xs !py-2"
          @click="goToDetail"
        />
        <Button
          :label="t('catalog.simulateLoanBtn')"
          icon="pi pi-calculator"
          severity="success"
          size="small"
          class="w-full sm:flex-1 rounded-xl !text-xs !py-2 bg-gradient-to-r from-emerald-600 to-teal-600 border-none hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/20"
          @click="goToSimulation"
        />
      </div>
    </div>
  </div>
</template>
