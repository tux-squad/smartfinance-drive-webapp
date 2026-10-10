<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950 to-orange-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md mb-3 border border-amber-500/30">
          <i class="pi pi-car"></i>
          Red Oficial de Distribución
        </div>
        <h1 class="text-3xl font-black tracking-tight sm:text-4xl text-white">
          Concesionarias Aliadas
        </h1>
        <p class="mt-2 text-sm text-amber-100/80 leading-relaxed">
          Explora inventarios certificados de las mejores agencias con planes de financiamiento integrados en Lima y provincias.
        </p>
      </div>
    </div>

    <!-- Search & Location Filter Bar -->
    <div class="flex flex-col sm:flex-row gap-3 items-stretch">
      <!-- Search Input -->
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <i class="pi pi-search text-sm"></i>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar concesionaria por nombre o RUC..."
          class="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm transition-all"
        />
      </div>

      <!-- Location Dropdown Selector -->
      <div class="relative sm:w-56 shrink-0">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <i class="pi pi-map-marker text-sm"></i>
        </span>
        <select
          v-model="selectedLocation"
          class="w-full pl-9 pr-8 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm transition-all appearance-none cursor-pointer"
        >
          <option value="">Todas las ubicaciones</option>
          <option value="Perú">Perú</option>
          <option value="Lima">Lima</option>
        </select>
        <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <i class="pi pi-chevron-down text-xs"></i>
        </span>
      </div>
    </div>

    <!-- Anonymous state notice -->
    <div
      v-if="!iamStore.isAuthenticated"
      class="rounded-3xl border border-amber-200 dark:border-amber-800/40 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-amber-950/30 p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
    >
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <i class="pi pi-lock text-xl"></i>
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            Acceso exclusivo a Concesionarias Oficiales
          </h3>
          <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
            El directorio oficial y la consulta de inventarios B2B en tiempo real requieren una cuenta activa en la plataforma SmartFinance Drive.
          </p>
        </div>
      </div>
      <router-link
        to="/sign-in"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 active:scale-[0.98] transition-all shrink-0"
      >
        <i class="pi pi-sign-in"></i>
        Iniciar Sesión
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-else-if="partnersStore.isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-slate-500 font-medium">Cargando concesionarias y entidades aliadas...</p>
    </div>

    <!-- Empty State when API has no partners -->
    <div
      v-else-if="filteredDealers.length === 0"
      class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center"
    >
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-4">
        <i class="pi pi-building text-2xl"></i>
      </div>
      <h3 class="text-base font-bold text-slate-900 dark:text-white">
        No se encontraron concesionarias
      </h3>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md">
        Actualmente no hay concesionarias o entidades aliadas registradas en el sistema que coincidan con tu búsqueda.
      </p>
    </div>

    <!-- Concesionarias Cards Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="dealer in filteredDealers"
        :key="dealer.id"
        class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
      >
        <!-- Card Thumbnail -->
        <div class="p-5 pb-0">
          <div class="relative h-44 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800">
            <div class="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-sm flex items-center justify-center text-amber-600 dark:text-amber-400">
              <i class="pi pi-building text-xs"></i>
            </div>
            <i class="pi pi-car text-5xl text-amber-900/20 dark:text-amber-400/20"></i>
          </div>
        </div>

        <!-- Card Content -->
        <div class="p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div class="space-y-2">
            <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
              {{ dealer.name }}
            </h3>

            <div class="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
              <i class="pi pi-map-marker text-xs text-amber-500"></i>
              <span>{{ dealer.location }}</span>
            </div>

            <!-- Tag -->
            <div class="pt-1">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
                {{ dealer.tag }}
              </span>
            </div>
          </div>

          <!-- Action Button: Ver inventario -->
          <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              @click="handleViewInventory(dealer)"
              class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs text-center shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all"
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
import { useIamStore } from '@/iam/application/iam.store'

const router = useRouter()
const iamStore = useIamStore()
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
  if (iamStore.isAuthenticated) {
    await Promise.all([
      partnersStore.fetchDealerships(),
      partnersStore.fetchFinancialEntities()
    ])
  }
})

const filteredDealers = computed<ConcessionaireCard[]>(() => {
  if (partnersStore.dealerships.length > 0) {
    return partnersStore.dealerships.map((dealer) => ({
      id: dealer.id,
      name: dealer.name,
      location: dealer.formattedLocation,
      tag: dealer.vehicleCount > 0 ? `${dealer.vehicleCount} Vehículos en stock` : 'Concesionaria Oficial Certificada'
    })).filter(d => {
      const q = searchQuery.value.toLowerCase().trim()
      const matchesSearch = !q ||
        d.name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q)
      const matchesLocation = !selectedLocation.value || d.location.includes(selectedLocation.value)
      return matchesSearch && matchesLocation
    })
  }

  return []
})

const handleViewInventory = (dealer: ConcessionaireCard) => {
  router.push(`/concessionaries/${dealer.id}`)
}
</script>
