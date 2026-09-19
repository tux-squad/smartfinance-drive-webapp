<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header matching Mockup Image 2 -->
    <div class="border-b border-gray-100 pb-6 space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
        Concesionarias Aliadas
      </h1>
      <p class="text-sm text-gray-500">
        Explora inventarios certificados de las mejores agencias con planes de financiamiento integrados.
      </p>
    </div>

    <!-- Search & Location Filter Bar -->
    <div class="flex flex-col sm:flex-row gap-3 items-stretch">
      <!-- Search Input -->
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <i class="pi pi-search text-sm"></i>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar concesionaria por nombre o RUC..."
          class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-xs transition-all"
        />
      </div>

      <!-- Location Dropdown Selector -->
      <div class="relative sm:w-56 shrink-0">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <i class="pi pi-map-marker text-sm"></i>
        </span>
        <select
          v-model="selectedLocation"
          class="w-full pl-9 pr-8 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-xs transition-all appearance-none cursor-pointer"
        >
          <option value="">Todas las ubicaciones</option>
          <option value="Perú">Perú</option>
          <option value="Lima">Lima</option>
        </select>
        <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
          <i class="pi pi-chevron-down text-xs"></i>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="partnersStore.isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">Cargando concesionarias y entidades aliadas...</p>
    </div>

    <!-- Empty State when API has no partners -->
    <div
      v-else-if="filteredDealers.length === 0"
      class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center"
    >
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
        <i class="pi pi-building text-2xl"></i>
      </div>
      <h3 class="text-base font-bold text-gray-900">
        No se encontraron concesionarias
      </h3>
      <p class="mt-1 text-xs text-gray-500 max-w-md">
        Actualmente no hay concesionarias o entidades aliadas registradas en el sistema que coincidan con tu búsqueda.
      </p>
    </div>

    <!-- Concesionarias Cards Grid matching Mockup Image 2 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="dealer in filteredDealers"
        :key="dealer.id"
        class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
      >
        <!-- Card Thumbnail with cross badge icon -->
        <div class="p-5 pb-0">
          <div class="relative h-40 bg-gray-200/80 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
            <!-- Top Left Decorative Icon from Mockup -->
            <div class="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/90 shadow-xs flex items-center justify-center text-gray-700">
              <i class="pi pi-building text-xs text-gray-700"></i>
            </div>
            <i class="pi pi-building text-4xl text-gray-400/60"></i>
          </div>
        </div>

        <!-- Card Content -->
        <div class="p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div class="space-y-2">
            <h3 class="text-lg font-bold text-gray-900 leading-snug">
              {{ dealer.name }}
            </h3>

            <div class="flex items-center space-x-1.5 text-xs text-gray-500">
              <i class="pi pi-map-marker text-[11px] text-gray-400"></i>
              <span>{{ dealer.location }}</span>
            </div>

            <!-- Tag -->
            <div class="pt-1">
              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#e6f7f4] text-[#00a887] border border-[#b3ebe1]">
                {{ dealer.tag }}
              </span>
            </div>
          </div>

          <!-- Action Button: Ver inventario -->
          <div class="pt-2">
            <button
              type="button"
              @click="handleViewInventory(dealer)"
              class="w-full py-2.5 px-4 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-semibold text-xs text-center shadow-xs transition-colors"
            >
              Ver inventario
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import { usePartnersStore } from '../../application/partners.store'

const router = useRouter()
const partnersStore = usePartnersStore()

const searchQuery = ref<string>('')
const selectedLocation = ref<string>('')

interface ConcessionaireCard {
  id: string
  name: string
  location: string
  tag: string
}

onMounted(async () => {
  await partnersStore.fetchFinancialEntities()
})

const filteredDealers = computed<ConcessionaireCard[]>(() => {
  const list: ConcessionaireCard[] = partnersStore.financialEntities.map((entity) => ({
    id: entity.id,
    name: entity.name,
    location: entity.ruc ? `RUC: ${entity.ruc} · Perú` : 'Lima, Perú',
    tag: entity.rateBenchmarks.length > 0 ? `${entity.rateBenchmarks.length} Planes de tasa disponibles` : 'Entidad Verificada'
  }))

  return list.filter(d => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !q ||
      d.name.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q)
    const matchesLocation = !selectedLocation.value || d.location.includes(selectedLocation.value)
    return matchesSearch && matchesLocation
  })
})

const handleViewInventory = (dealer: ConcessionaireCard) => {
  router.push({
    path: '/vehicles',
    query: { entityId: dealer.id, entityName: dealer.name }
  })
}
</script>

<style scoped>
</style>
