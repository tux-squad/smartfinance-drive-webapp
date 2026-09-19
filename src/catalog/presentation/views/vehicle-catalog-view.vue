<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header matching Mockup Screenshot -->
    <div class="border-b border-gray-100 pb-6 space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
        Catálogo General de Vehículos
      </h1>
      <p class="text-sm text-gray-500">
        Canal Virtual Directo · Explora vehículos disponibles en concesionarias verificadas.
      </p>
    </div>

    <!-- Main Layout: Left Filters + Right Vehicles Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Filtros de Búsqueda (approx 4 cols / w-80) -->
      <aside class="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 class="text-base font-extrabold text-gray-950">
            Filtros de Búsqueda
          </h2>
          <button
            v-if="hasActiveFilters"
            type="button"
            @click="resetFilters"
            class="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
          >
            Limpiar
          </button>
        </div>

        <!-- Filter 1: Condición (Nuevo/Usado) -->
        <div class="space-y-2.5">
          <label class="block text-xs font-bold text-gray-700">
            Condición (Nuevo/Usado)
          </label>
          <div class="space-y-2">
            <label class="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none">
              <input
                v-model="filterConditionNew"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Nuevo</span>
            </label>
            <label class="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none">
              <input
                v-model="filterConditionUsed"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Usado</span>
            </label>
          </div>
        </div>

        <!-- Filter 2: Marca -->
        <div class="space-y-2.5">
          <label class="block text-xs font-bold text-gray-700">
            Marca
          </label>
          <div class="space-y-2 max-h-44 overflow-y-auto pr-1">
            <label
              v-for="brand in availableBrands"
              :key="brand"
              class="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                :value="brand"
                v-model="selectedBrands"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>{{ brand }}</span>
            </label>
          </div>
        </div>

        <!-- Filter 3: Rango de Precio -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-gray-700">Rango de Precio</span>
            <span class="font-mono text-gray-500 font-semibold">${{ minPrice.toLocaleString() }} - ${{ maxPrice.toLocaleString() }}</span>
          </div>
          <div class="space-y-2">
            <input
              type="range"
              min="5000"
              max="80000"
              step="2500"
              v-model.number="maxPrice"
              class="w-full accent-blue-600 cursor-pointer"
            />
            <div class="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>$10,000</span>
              <span>$35,000+</span>
            </div>
          </div>
        </div>

        <!-- Filter 4: Año -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-gray-700">Año</span>
            <span class="font-mono text-gray-500 font-semibold">{{ minYear }} - {{ maxYear }}</span>
          </div>
          <div class="space-y-2">
            <input
              type="range"
              min="2018"
              max="2026"
              step="1"
              v-model.number="minYear"
              class="w-full accent-blue-600 cursor-pointer"
            />
            <div class="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>2019</span>
              <span>2024</span>
            </div>
          </div>
        </div>

        <!-- Filter 5: Kilometraje -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-gray-700">Kilometraje</span>
            <span class="font-mono text-gray-500 font-semibold">Hasta {{ maxKm.toLocaleString() }} km</span>
          </div>
          <div class="space-y-2">
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              v-model.number="maxKm"
              class="w-full accent-blue-600 cursor-pointer"
            />
            <div class="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>0 km</span>
              <span>50,000 km</span>
            </div>
          </div>
        </div>

        <!-- Button: Aplicar filtros matching Mockup Screenshot -->
        <div class="pt-2">
          <button
            type="button"
            @click="handleApplyFilters"
            class="w-full py-2.5 px-4 rounded-xl bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-bold text-xs text-center shadow-xs transition-colors"
          >
            Aplicar filtros
          </button>
        </div>
      </aside>

      <!-- Right Column: Results Bar & Vehicles Grid (approx 8 cols) -->
      <main class="lg:col-span-8 space-y-6">
        <!-- Results Bar matching Mockup Screenshot -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div class="text-xs font-bold text-gray-700">
            {{ filteredVehicles.length }} vehículos encontrados
          </div>

          <!-- Sort Selector matching Mockup Screenshot -->
          <div class="flex items-center gap-2">
            <label class="text-xs text-gray-500 font-medium">Ordenar:</label>
            <div class="relative">
              <select
                v-model="sortCriteria"
                class="pl-3 pr-7 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-600 appearance-none cursor-pointer shadow-2xs"
              >
                <option value="recommended">Recomendados</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
                <option value="year_desc">Más recientes</option>
              </select>
              <span class="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
                <i class="pi pi-chevron-down text-[10px]"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="catalogStore.isLoading" class="flex flex-col items-center justify-center py-24 gap-3">
          <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
          <p class="text-sm text-gray-500 font-medium">Cargando catálogo oficial...</p>
        </div>

        <!-- Empty State when no vehicles match -->
        <div
          v-else-if="filteredVehicles.length === 0"
          class="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center space-y-4"
        >
          <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <i class="pi pi-car text-2xl"></i>
          </div>
          <h3 class="text-base font-bold text-gray-900">No se encontraron vehículos</h3>
          <p class="text-xs text-gray-500 max-w-sm mx-auto">
            No hay vehículos que cumplan con los filtros de búsqueda seleccionados en el catálogo oficial.
          </p>
          <div>
            <button
              type="button"
              @click="resetFilters"
              class="px-4 py-2 rounded-xl bg-[#eb8f47] text-white text-xs font-semibold"
            >
              Restablecer filtros
            </button>
          </div>
        </div>

        <!-- Vehicles Grid matching Mockup Screenshot (2 cols on md/lg) -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            v-for="car in filteredVehicles"
            :key="car.id"
            class="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <!-- Card Image Media -->
            <div class="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
              <img
                v-if="car.imagePath"
                :src="car.imagePath"
                :alt="car.displayName"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div v-else class="flex flex-col items-center justify-center text-gray-300">
                <i class="pi pi-car text-5xl text-blue-900/20"></i>
                <span class="text-[10px] font-semibold text-gray-400 mt-1 uppercase">{{ car.brand }}</span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div class="space-y-1.5">
                <h3 class="text-base font-bold text-gray-950 leading-snug">
                  {{ car.brand }} {{ car.model }} {{ car.manufactureYear }}
                </h3>
                <div class="text-xl font-extrabold text-gray-950">
                  {{ car.formattedPrice }}
                </div>
                <div class="text-xs text-gray-500 font-medium">
                  {{ car.manufactureYear }} · {{ car.condition === 'NEW' ? '0 km' : '15,000 km' }} · Lima
                </div>
              </div>

              <!-- Button: Ver más matching Mockup Screenshot -->
              <div class="pt-1">
                <button
                  type="button"
                  @click="goToDetail(car.id)"
                  class="w-full py-2.5 px-4 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-semibold text-xs text-center shadow-xs transition-colors"
                >
                  Ver más
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import type { Vehicle } from '@/catalog/domain/vehicle.entity'

const router = useRouter()
const catalogStore = useCatalogStore()

const filterConditionNew = ref(true)
const filterConditionUsed = ref(false)
const selectedBrands = ref<string[]>([])
const minPrice = ref(5000)
const maxPrice = ref(45000)
const minYear = ref(2019)
const maxYear = ref(2026)
const maxKm = ref(50000)
const sortCriteria = ref('recommended')

onMounted(async () => {
  await catalogStore.fetchVehicles()
})

const availableBrands = computed(() => {
  const brands = new Set(catalogStore.vehicles.map(v => v.brand).filter(Boolean))
  // Return list of available brands or standard car brands
  if (brands.size > 0) {
    return Array.from(brands)
  }
  return ['Toyota', 'Honda', 'Mazda', 'Kia', 'Nissan', 'Hyundai', 'Volkswagen']
})

const hasActiveFilters = computed(() => {
  return (
    !filterConditionNew.value ||
    filterConditionUsed.value ||
    selectedBrands.value.length > 0 ||
    maxPrice.value < 45000 ||
    minYear.value > 2019
  )
})

const resetFilters = () => {
  filterConditionNew.value = true
  filterConditionUsed.value = false
  selectedBrands.value = []
  minPrice.value = 5000
  maxPrice.value = 45000
  minYear.value = 2019
  maxYear.value = 2026
  maxKm.value = 50000
}

const handleApplyFilters = async () => {
  // Let client-side filtering filter reactive catalog or backend
}

const filteredVehicles = computed<Vehicle[]>(() => {
  let list = [...catalogStore.vehicles]

  // Filter Condition
  if (filterConditionNew.value && !filterConditionUsed.value) {
    list = list.filter(v => v.condition === 'NEW')
  } else if (!filterConditionNew.value && filterConditionUsed.value) {
    list = list.filter(v => v.condition !== 'NEW')
  }

  // Filter Brands
  if (selectedBrands.value.length > 0) {
    list = list.filter(v => selectedBrands.value.includes(v.brand))
  }

  // Filter Price
  list = list.filter(v => v.priceAmount >= minPrice.value && v.priceAmount <= maxPrice.value)

  // Filter Year
  list = list.filter(v => v.manufactureYear >= minYear.value && v.manufactureYear <= maxYear.value)

  // Sort
  if (sortCriteria.value === 'price_asc') {
    list.sort((a, b) => a.priceAmount - b.priceAmount)
  } else if (sortCriteria.value === 'price_desc') {
    list.sort((a, b) => b.priceAmount - a.priceAmount)
  } else if (sortCriteria.value === 'year_desc') {
    list.sort((a, b) => b.manufactureYear - a.manufactureYear)
  }

  return list
})

const goToDetail = (id: string) => {
  router.push(`/vehicles/${id}`)
}
</script>

<style scoped>
</style>
