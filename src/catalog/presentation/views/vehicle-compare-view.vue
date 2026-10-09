<template>
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md mb-3 border border-emerald-500/30">
            <i class="pi pi-arrows-h"></i>
            Comparador Inteligente de Modelos
          </div>
          <h1 class="text-3xl font-black tracking-tight sm:text-4xl text-white">
            Comparar Vehículos Lado a Lado
          </h1>
          <p class="mt-2 text-sm text-emerald-100/80 leading-relaxed">
            Analiza especificaciones, precios al contado y cuotas bancarias estimadas para tomar la mejor decisión de financiamiento.
          </p>
        </div>

        <div>
          <router-link
            to="/vehicles"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 shadow-lg active:scale-[0.98] transition-all"
          >
            <i class="pi pi-car"></i>
            <span>Ver Catálogo Completo</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="catalogStore.isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-slate-500 font-medium">Cargando vehículos para comparación...</p>
    </div>

    <!-- Empty / Not Enough Vehicles State -->
    <div
      v-else-if="catalogStore.vehicles.length < 2"
      class="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm"
    >
      <div class="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
        <i class="pi pi-car text-3xl"></i>
      </div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-white">Se requieren al menos 2 vehículos</h3>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Actualmente no hay suficientes unidades registradas en el catálogo para realizar una comparación lado a lado.
      </p>
      <div>
        <router-link to="/vehicles" class="inline-flex items-center px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20">
          Explorar Catálogo
        </router-link>
      </div>
    </div>

    <!-- Comparison Table Card -->
    <div v-else class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800">
              <!-- Column Header 1: Label -->
              <th scope="col" class="w-1/4 p-6 text-left text-xs font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                ESPECIFICACIÓN
              </th>

              <!-- Column Header 2: Vehicle 1 Selector & Title -->
              <th scope="col" class="w-3/8 p-6 text-left border-l border-slate-100 dark:border-slate-800 space-y-3">
                <div class="space-y-2">
                  <div class="h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                    <img
                      :src="vehicle1?.imagePath || defaultImage"
                      :alt="vehicle1?.displayName"
                      class="w-full h-full object-cover"
                      @error="(e: Event) => ((e.target as HTMLImageElement).src = defaultImage)"
                    />
                  </div>
                  <div class="text-lg font-black text-slate-900 dark:text-white">
                    {{ vehicle1?.brand }} {{ vehicle1?.model }} {{ vehicle1?.manufactureYear }}
                  </div>
                  <!-- Vehicle 1 Switcher -->
                  <select
                    v-model="selectedId1"
                    class="w-full text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option v-for="v in catalogStore.vehicles" :key="v.id" :value="v.id">
                      {{ v.brand }} {{ v.model }} ({{ v.manufactureYear }}) - {{ v.formattedPrice }}
                    </option>
                  </select>
                </div>
              </th>

              <!-- Column Header 3: Vehicle 2 Selector & Title -->
              <th scope="col" class="w-3/8 p-6 text-left border-l border-slate-100 dark:border-slate-800 space-y-3">
                <div class="space-y-2">
                  <div class="h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                    <img
                      :src="vehicle2?.imagePath || defaultImage"
                      :alt="vehicle2?.displayName"
                      class="w-full h-full object-cover"
                      @error="(e: Event) => ((e.target as HTMLImageElement).src = defaultImage)"
                    />
                  </div>
                  <div class="text-lg font-black text-slate-900 dark:text-white">
                    {{ vehicle2?.brand }} {{ vehicle2?.model }} {{ vehicle2?.manufactureYear }}
                  </div>
                  <!-- Vehicle 2 Switcher -->
                  <select
                    v-model="selectedId2"
                    class="w-full text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option v-for="v in catalogStore.vehicles" :key="v.id" :value="v.id">
                      {{ v.brand }} {{ v.model }} ({{ v.manufactureYear }}) - {{ v.formattedPrice }}
                    </option>
                  </select>
                </div>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            <!-- Row: Precio Contado -->
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="p-6 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-800/20">Precio Contado</td>
              <td class="p-6 border-l border-slate-100 dark:border-slate-800 font-mono font-black text-slate-900 dark:text-white text-lg">
                {{ vehicle1?.formattedPrice }}
              </td>
              <td class="p-6 border-l border-slate-100 dark:border-slate-800 font-mono font-black text-slate-900 dark:text-white text-lg">
                {{ vehicle2?.formattedPrice }}
              </td>
            </tr>

            <!-- Row: Condición -->
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="p-6 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-800/20">Condición</td>
              <td class="p-6 border-l border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold" :class="vehicle1?.condition === 'NEW' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'">
                  {{ vehicle1?.condition === 'NEW' ? 'Nuevo (0 km)' : 'Seminuevo certificado' }}
                </span>
              </td>
              <td class="p-6 border-l border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold" :class="vehicle2?.condition === 'NEW' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'">
                  {{ vehicle2?.condition === 'NEW' ? 'Nuevo (0 km)' : 'Seminuevo certificado' }}
                </span>
              </td>
            </tr>

            <!-- Row: Año de Fabricación -->
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="p-6 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-800/20">Año Modelo</td>
              <td class="p-6 border-l border-slate-100 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {{ vehicle1?.manufactureYear }}
              </td>
              <td class="p-6 border-l border-slate-100 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {{ vehicle2?.manufactureYear }}
              </td>
            </tr>

            <!-- Row: Cuota mensual estimada -->
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors bg-emerald-50/30 dark:bg-emerald-950/20">
              <td class="p-6 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/40">Cuota Bancaria Estimada (48m)</td>
              <td class="p-6 border-l border-slate-100 dark:border-slate-800 text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                ${{ calculateMonthly(vehicle1?.priceAmount) }} USD / mes
              </td>
              <td class="p-6 border-l border-slate-100 dark:border-slate-800 text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                ${{ calculateMonthly(vehicle2?.priceAmount) }} USD / mes
              </td>
            </tr>

            <!-- Row: Action CTAs -->
            <tr>
              <td class="p-6 bg-slate-50/30 dark:bg-slate-800/20"></td>
              <!-- CTA Vehicle 1 -->
              <td class="p-6 border-l border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  type="button"
                  @click="goToSimulation(vehicle1?.id)"
                  class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs text-center shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
                >
                  Simular este Auto
                </button>
                <button
                  type="button"
                  @click="goToDetail(vehicle1?.id)"
                  class="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs text-center transition-all"
                >
                  Ver Ficha Detallada
                </button>
              </td>

              <!-- CTA Vehicle 2 -->
              <td class="p-6 border-l border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  type="button"
                  @click="goToSimulation(vehicle2?.id)"
                  class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs text-center shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
                >
                  Simular este Auto
                </button>
                <button
                  type="button"
                  @click="goToDetail(vehicle2?.id)"
                  class="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs text-center transition-all"
                >
                  Ver Ficha Detallada
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import { useCatalogStore } from '@/catalog/application/catalog.store'

const router = useRouter()
const route = useRoute()
const catalogStore = useCatalogStore()

const defaultImage = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'

const selectedId1 = ref<string>('')
const selectedId2 = ref<string>('')

onMounted(async () => {
  if (!catalogStore.hasVehicles) {
    await catalogStore.fetchVehicles()
  }

  const q1 = route.query.v1 as string | undefined
  const q2 = route.query.v2 as string | undefined

  if (catalogStore.vehicles.length >= 2) {
    selectedId1.value = q1 || catalogStore.vehicles[0]?.id || ''
    selectedId2.value = q2 || catalogStore.vehicles[1]?.id || ''
  } else if (catalogStore.vehicles.length === 1) {
    selectedId1.value = catalogStore.vehicles[0]?.id || ''
  }
})

const vehicle1 = computed(() => {
  return catalogStore.vehicles.find(v => v.id === selectedId1.value)
})

const vehicle2 = computed(() => {
  return catalogStore.vehicles.find(v => v.id === selectedId2.value)
})

const calculateMonthly = (price?: number): string => {
  if (!price) return '0'
  const financed = price * 0.8
  const monthlyRate = 0.095 / 12
  const months = 48
  const pmt = (financed * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(pmt).toLocaleString('en-US')
}

const goToSimulation = (id?: string) => {
  if (id) {
    router.push({ name: 'simulations', query: { vehicleId: id } })
  }
}

const goToDetail = (id?: string) => {
  if (id) {
    router.push({ name: 'vehicle-detail', params: { id } })
  }
}
</script>
