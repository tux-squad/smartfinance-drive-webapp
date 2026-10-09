<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner with Search and Compare Quick-Action -->
    <div class="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md mb-3 border border-emerald-500/30">
            <i class="pi pi-shield-check"></i>
            Canal Virtual Directo · Concesionarias Verificadas
          </div>
          <h1 class="text-3xl font-black tracking-tight sm:text-4xl text-white">
            Catálogo Oficial de Vehículos
          </h1>
          <p class="mt-2 text-sm text-emerald-100/80 leading-relaxed">
            Explora autos nuevos y seminuevos certificados en el Perú, con simulación de cuotas bancarias en tiempo real.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <router-link
            to="/vehicles/compare"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 shadow-lg active:scale-[0.98] transition-all"
          >
            <i class="pi pi-arrows-h text-emerald-300"></i>
            <span>Comparar Modelos</span>
          </router-link>
          <router-link
            to="/simulations"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all"
          >
            <i class="pi pi-calculator"></i>
            <span>Simulador Financiero</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Layout: Left Filters + Right Vehicles Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Filtros de Búsqueda -->
      <aside class="lg:col-span-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2.5">
            <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <i class="pi pi-filter text-sm"></i>
            </div>
            <h2 class="text-sm font-bold text-slate-900 dark:text-white">
              Filtros de Búsqueda
            </h2>
          </div>
          <button
            v-if="hasActiveFilters"
            type="button"
            @click="resetFilters"
            class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Limpiar
          </button>
        </div>

        <!-- Filter 1: Condición (Nuevo/Usado) -->
        <div class="space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Condición del Vehículo
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="filterConditionNew = !filterConditionNew"
              :class="[
                'px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5',
                filterConditionNew
                  ? 'bg-emerald-50 border-emerald-500/50 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              ]"
            >
              <i v-if="filterConditionNew" class="pi pi-check text-[10px]"></i>
              <span>Nuevos (0 km)</span>
            </button>

            <button
              type="button"
              @click="filterConditionUsed = !filterConditionUsed"
              :class="[
                'px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5',
                filterConditionUsed
                  ? 'bg-emerald-50 border-emerald-500/50 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              ]"
            >
              <i v-if="filterConditionUsed" class="pi pi-check text-[10px]"></i>
              <span>Seminuevos</span>
            </button>
          </div>
        </div>

        <!-- Filter 2: Marca -->
        <div class="space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Marca
          </label>
          <div class="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            <button
              v-for="brand in availableBrands"
              :key="brand"
              type="button"
              @click="toggleBrand(brand)"
              :class="[
                'px-2.5 py-1 rounded-xl text-xs font-medium border transition-all',
                selectedBrands.includes(brand)
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              ]"
            >
              {{ brand }}
            </button>
          </div>
        </div>

        <!-- Filter 3: Rango de Precio -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Precio Máximo</span>
            <span class="font-mono text-emerald-600 dark:text-emerald-400 font-bold">${{ maxPrice.toLocaleString() }} USD</span>
          </div>
          <div class="space-y-2">
            <input
              type="range"
              min="5000"
              max="90000"
              step="2500"
              v-model.number="maxPrice"
              class="w-full accent-emerald-600 cursor-pointer"
            />
            <div class="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$5,000</span>
              <span>$90,000+</span>
            </div>
          </div>
        </div>

        <!-- Filter 4: Año Mínimo -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Año de Fabricación</span>
            <span class="font-mono text-slate-700 dark:text-slate-300 font-bold">Desde {{ minYear }}</span>
          </div>
          <div class="space-y-2">
            <input
              type="range"
              min="2018"
              max="2026"
              step="1"
              v-model.number="minYear"
              class="w-full accent-emerald-600 cursor-pointer"
            />
            <div class="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>2018</span>
              <span>2026</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Right Column: Results Bar & Vehicles Grid -->
      <main class="lg:col-span-8 space-y-6">
        <!-- Results Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span class="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>{{ filteredVehicles.length }} vehículos disponibles</span>
          </div>

          <!-- Sort Selector -->
          <div class="flex items-center gap-2">
            <label class="text-xs text-slate-500 dark:text-slate-400 font-medium">Ordenar por:</label>
            <div class="relative">
              <select
                v-model="sortCriteria"
                class="pl-3 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer shadow-sm"
              >
                <option value="recommended">Recomendados</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
                <option value="year_desc">Más recientes</option>
              </select>
              <span class="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <i class="pi pi-chevron-down text-[10px]"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="catalogStore.isLoading" class="flex flex-col items-center justify-center py-24 gap-3">
          <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
          <p class="text-sm text-slate-500 font-medium">Cargando catálogo oficial...</p>
        </div>

        <!-- Empty State when no vehicles match -->
        <div
          v-else-if="filteredVehicles.length === 0"
          class="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4"
        >
          <div class="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <i class="pi pi-car text-3xl"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">No se encontraron vehículos</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No hay vehículos que cumplan con los filtros de búsqueda seleccionados. Intenta ajustar el rango de precios o marcas.
          </p>
          <div>
            <button
              type="button"
              @click="resetFilters"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Restablecer filtros
            </button>
          </div>
        </div>

        <!-- Vehicles Grid (2 cols on sm/md/lg) using VehicleCard -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <VehicleCard
            v-for="car in filteredVehicles"
            :key="car.id"
            :vehicle="car"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import type { Vehicle } from '@/catalog/domain/vehicle.entity'
import VehicleCard from '../components/vehicle-card.vue'

const catalogStore = useCatalogStore()

const filterConditionNew = ref(true)
const filterConditionUsed = ref(false)
const selectedBrands = ref<string[]>([])
const minPrice = ref(5000)
const maxPrice = ref(60000)
const minYear = ref(2018)
const maxYear = ref(2026)
const sortCriteria = ref('recommended')

onMounted(async () => {
  if (!catalogStore.hasVehicles) {
    await catalogStore.fetchVehicles()
  }
})

const availableBrands = computed(() => {
  const brands = new Set(catalogStore.vehicles.map(v => v.brand).filter(Boolean))
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
    maxPrice.value < 60000 ||
    minYear.value > 2018
  )
})

const toggleBrand = (brand: string) => {
  const index = selectedBrands.value.indexOf(brand)
  if (index >= 0) {
    selectedBrands.value.splice(index, 1)
  } else {
    selectedBrands.value.push(brand)
  }
}

const resetFilters = () => {
  filterConditionNew.value = true
  filterConditionUsed.value = false
  selectedBrands.value = []
  minPrice.value = 5000
  maxPrice.value = 60000
  minYear.value = 2018
  maxYear.value = 2026
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
</script>
