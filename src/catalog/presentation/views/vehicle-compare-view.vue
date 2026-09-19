<template>
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header matching Mockup Image 4 -->
    <div class="border-b border-gray-100 pb-6 space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
        Comparar Vehículos
      </h1>
      <p class="text-sm text-gray-500">
        Revisa las características clave y elige la opción que mejor se adapta a ti.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="catalogStore.isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">Cargando vehículos para comparación...</p>
    </div>

    <!-- Empty / Not Enough Vehicles State -->
    <div
      v-else-if="catalogStore.vehicles.length < 2"
      class="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4"
    >
      <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
        <i class="pi pi-car text-2xl"></i>
      </div>
      <h3 class="text-base font-bold text-gray-900">Se requieren al menos 2 vehículos en el catálogo</h3>
      <p class="text-xs text-gray-500">
        Actualmente no hay suficientes unidades registradas en la base de datos para realizar una comparación lado a lado.
      </p>
      <div>
        <router-link to="/vehicles" class="inline-flex items-center px-4 py-2 rounded-xl bg-[#eb8f47] text-white text-xs font-semibold">
          Explorar Catálogo
        </router-link>
      </div>
    </div>

    <!-- Comparison Table Card matching Mockup Image 4 -->
    <div v-else class="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-gray-200">
              <!-- Column Header 1: Label -->
              <th scope="col" class="w-1/4 p-6 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                COMPARACIÓN
              </th>

              <!-- Column Header 2: Vehicle 1 Selector & Title -->
              <th scope="col" class="w-3/8 p-6 text-left border-l border-gray-100 space-y-2">
                <div class="space-y-1">
                  <div class="text-lg font-bold text-gray-950">
                    {{ vehicle1?.brand }} {{ vehicle1?.model }} {{ vehicle1?.manufactureYear }}
                  </div>
                  <!-- Vehicle 1 Switcher -->
                  <select
                    v-model="selectedId1"
                    class="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
                  >
                    <option v-for="v in catalogStore.vehicles" :key="v.id" :value="v.id">
                      {{ v.brand }} {{ v.model }} ({{ v.manufactureYear }}) - {{ v.formattedPrice }}
                    </option>
                  </select>
                </div>
              </th>

              <!-- Column Header 3: Vehicle 2 Selector & Title -->
              <th scope="col" class="w-3/8 p-6 text-left border-l border-gray-100 space-y-2">
                <div class="space-y-1">
                  <div class="text-lg font-bold text-gray-950">
                    {{ vehicle2?.brand }} {{ vehicle2?.model }} {{ vehicle2?.manufactureYear }}
                  </div>
                  <!-- Vehicle 2 Switcher -->
                  <select
                    v-model="selectedId2"
                    class="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
                  >
                    <option v-for="v in catalogStore.vehicles" :key="v.id" :value="v.id">
                      {{ v.brand }} {{ v.model }} ({{ v.manufactureYear }}) - {{ v.formattedPrice }}
                    </option>
                  </select>
                </div>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 text-sm">
            <!-- Row: Precio -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td class="p-6 text-xs font-bold text-gray-500 bg-gray-50/30">Precio</td>
              <td class="p-6 border-l border-gray-100 font-extrabold text-gray-950 text-base">
                {{ vehicle1?.formattedPrice }}
              </td>
              <td class="p-6 border-l border-gray-100 font-extrabold text-gray-950 text-base">
                {{ vehicle2?.formattedPrice }}
              </td>
            </tr>

            <!-- Row: Condición (Nuevo vs Usado) -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td class="p-6 text-xs font-bold text-gray-500 bg-gray-50/30">Condición (Nuevo vs Usado)</td>
              <td class="p-6 border-l border-gray-100 text-xs font-medium text-gray-700">
                {{ vehicle1?.condition === 'NEW' ? 'Nuevo' : 'Usado certificado' }}
              </td>
              <td class="p-6 border-l border-gray-100 text-xs font-medium text-gray-700">
                {{ vehicle2?.condition === 'NEW' ? 'Nuevo' : 'Usado certificado' }}
              </td>
            </tr>

            <!-- Row: Kilometraje -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td class="p-6 text-xs font-bold text-gray-500 bg-gray-50/30">Kilometraje</td>
              <td class="p-6 border-l border-gray-100 text-xs font-mono text-gray-700">
                {{ vehicle1?.condition === 'NEW' ? '0 km' : 'Certificado' }}
              </td>
              <td class="p-6 border-l border-gray-100 text-xs font-mono text-gray-700">
                {{ vehicle2?.condition === 'NEW' ? '0 km' : 'Certificado' }}
              </td>
            </tr>

            <!-- Row: Cuota mensual estimada -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td class="p-6 text-xs font-bold text-gray-500 bg-gray-50/30">Cuota mensual estimada</td>
              <td class="p-6 border-l border-gray-100 text-xs font-semibold text-gray-800">
                ${{ calculateMonthly(vehicle1?.priceAmount) }} USD / mes
              </td>
              <td class="p-6 border-l border-gray-100 text-xs font-semibold text-gray-800">
                ${{ calculateMonthly(vehicle2?.priceAmount) }} USD / mes
              </td>
            </tr>

            <!-- Row: Action Buttons matching Mockup Image 4 -->
            <tr>
              <td class="p-6 bg-gray-50/30"></td>
              <!-- CTA Vehicle 1 -->
              <td class="p-6 border-l border-gray-100">
                <button
                  type="button"
                  @click="goToPreEvaluation(vehicle1?.id)"
                  class="w-full py-3 px-4 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-semibold text-xs text-center shadow-xs transition-colors"
                >
                  Elegir y Pre-evaluar
                </button>
              </td>

              <!-- CTA Vehicle 2 -->
              <td class="p-6 border-l border-gray-100">
                <button
                  type="button"
                  @click="goToPreEvaluation(vehicle2?.id)"
                  class="w-full py-3 px-4 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-semibold text-xs text-center shadow-xs transition-colors"
                >
                  Elegir y Pre-evaluar
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

const selectedId1 = ref<string>('')
const selectedId2 = ref<string>('')

onMounted(async () => {
  await catalogStore.fetchVehicles()

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
  const financed = price * 0.9
  const monthlyRate = 0.089 / 12
  const months = 48
  const pmt = (financed * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(pmt).toLocaleString('en-US')
}

const goToPreEvaluation = (id?: string) => {
  if (id) {
    router.push(`/vehicles/${id}/pre-evaluation`)
  }
}
</script>

<style scoped>
</style>
