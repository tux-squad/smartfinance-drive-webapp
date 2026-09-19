<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">Cargando inventario de la concesionaria...</p>
    </div>

    <template v-else>
      <!-- Dealership Header Card matching Mockup Image 1 -->
      <div class="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center gap-5">
          <!-- Icon Box -->
          <div class="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <i class="pi pi-building text-3xl"></i>
          </div>

          <!-- Dealership Details -->
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-3">
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950">
                {{ currentEntity?.name || 'Concesionaria Aliada' }}
              </h1>
              <span class="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-[#00a887] text-white shadow-xs">
                Concesionaria Verificada
              </span>
            </div>

            <div class="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <i class="pi pi-map-marker text-gray-400"></i>
              <span>{{ locationText }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Bar matching Mockup Image 1 -->
      <div class="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <!-- Condición -->
          <div class="space-y-1.5">
            <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              Condición (Nuevo/Usado)
            </label>
            <select
              v-model="conditionFilter"
              class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="">Todos</option>
              <option value="NEW">Nuevo</option>
              <option value="USED">Usado</option>
            </select>
          </div>

          <!-- Marca -->
          <div class="space-y-1.5">
            <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              Marca
            </label>
            <select
              v-model="brandFilter"
              class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="">Todas las marcas</option>
              <option v-for="brand in availableBrands" :key="brand" :value="brand">
                {{ brand }}
              </option>
            </select>
          </div>

          <!-- Rango de Precio -->
          <div class="space-y-1.5">
            <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              Rango de Precio
            </label>
            <select
              v-model="priceRangeFilter"
              class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="">Cualquier precio</option>
              <option value="0-20000">$0 - $20,000 USD</option>
              <option value="20000-35000">$20,000 - $35,000 USD</option>
              <option value="35000-999999">$35,000+ USD</option>
            </select>
          </div>

          <!-- Botón Buscar -->
          <div>
            <button
              type="button"
              @click="applyFilters"
              class="w-full py-2.5 px-4 rounded-xl bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-xs transition-colors"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredVehicles.length === 0"
        class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center"
      >
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
          <i class="pi pi-car text-2xl"></i>
        </div>
        <h3 class="text-base font-bold text-gray-900">
          No hay unidades disponibles con los filtros seleccionados
        </h3>
        <p class="mt-1 text-xs text-gray-500 max-w-sm">
          Esta concesionaria actualmente no tiene vehículos registrados con estos criterios en el inventario oficial.
        </p>
      </div>

      <!-- Vehicles Grid matching Mockup Image 1 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="vehicle in filteredVehicles"
          :key="vehicle.id"
          class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <!-- Thumbnail Media -->
          <div class="relative h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
            <img
              v-if="vehicle.imagePath"
              :src="vehicle.imagePath"
              :alt="vehicle.displayName"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div v-else class="flex flex-col items-center justify-center text-gray-300">
              <i class="pi pi-car text-4xl text-blue-900/20"></i>
              <span class="text-[10px] font-semibold text-gray-400 mt-1 uppercase">{{ vehicle.brand }}</span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div class="space-y-1">
              <h3 class="text-sm font-bold text-gray-900 leading-snug">
                {{ vehicle.brand }} {{ vehicle.model }} {{ vehicle.manufactureYear }}
              </h3>
              <div class="text-base font-extrabold text-[#0a1936]">
                {{ vehicle.formattedPrice }}
              </div>
              <div class="flex items-center gap-1 text-[11px] text-gray-500">
                <i class="pi pi-map-marker text-gray-400 text-[10px]"></i>
                <span>Perú · {{ vehicle.condition === 'NEW' ? '0 km' : 'Certificado' }}</span>
              </div>
            </div>

            <div class="pt-1">
              <button
                type="button"
                @click="goToDetail(vehicle.id)"
                class="w-full py-2 px-3 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-semibold text-xs text-center shadow-xs transition-colors"
              >
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import { usePartnersStore } from '@/partners/application/partners.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import type { FinancialEntity } from '@/partners/domain/financial-entity.entity'

const route = useRoute()
const router = useRouter()
const partnersStore = usePartnersStore()
const catalogStore = useCatalogStore()

const isLoading = ref(true)
const conditionFilter = ref<string>('')
const brandFilter = ref<string>('')
const priceRangeFilter = ref<string>('')

const entityId = computed(() => route.params.id as string)

const currentEntity = computed<FinancialEntity | undefined>(() => {
  return partnersStore.financialEntities.find(e => e.id === entityId.value)
})

const locationText = computed(() => {
  if (currentEntity.value?.ruc) {
    return `RUC: ${currentEntity.value.ruc} · Sede Central, Lima, Perú`
  }
  return 'Lima, Perú'
})

onMounted(async () => {
  isLoading.value = true
  await Promise.all([
    partnersStore.fetchFinancialEntities(),
    catalogStore.fetchVehicles()
  ])
  isLoading.value = false
})

const availableBrands = computed(() => {
  const brands = new Set(catalogStore.vehicles.map(v => v.brand).filter(Boolean))
  return Array.from(brands)
})

const filteredVehicles = computed(() => {
  // If vehicles have financialEntityId matching current entity, filter by it, otherwise show all dealership catalog
  const entityVehicles = catalogStore.vehicles.filter(v => {
    if (v.financialEntityId && currentEntity.value?.id) {
      return v.financialEntityId === currentEntity.value.id
    }
    return true
  })

  return entityVehicles.filter(v => {
    const matchesCondition = !conditionFilter.value || v.condition === conditionFilter.value
    const matchesBrand = !brandFilter.value || v.brand.toLowerCase() === brandFilter.value.toLowerCase()

    let matchesPrice = true
    if (priceRangeFilter.value) {
      const parts = priceRangeFilter.value.split('-').map(Number)
      const min = parts[0] ?? 0
      const max = parts[1] ?? Infinity
      matchesPrice = v.priceAmount >= min && v.priceAmount <= max
    }

    return matchesCondition && matchesBrand && matchesPrice
  })
})

const applyFilters = () => {
  // Filters reactive automatically
}

const goToDetail = (id: string) => {
  router.push(`/vehicles/${id}`)
}
</script>

<style scoped>
</style>
