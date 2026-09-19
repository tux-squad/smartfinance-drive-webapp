<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header matching Mockup Image 3 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
      <div class="space-y-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
          Mis Solicitudes
        </h1>
        <p class="text-sm text-gray-500">
          Historial de evaluaciones de crédito vehicular enviadas a concesionarias y bancos.
        </p>
      </div>

      <!-- Quick Action: Nueva Pre-evaluación -->
      <div>
        <router-link
          to="/vehicles"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-semibold text-xs shadow-xs transition-colors"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>Nueva Pre-evaluación</span>
        </router-link>
      </div>
    </div>

    <!-- Search / Filter Bar -->
    <div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <i class="pi pi-search text-xs"></i>
        </span>
        <input
          v-model="searchFilter"
          type="text"
          placeholder="Buscar por vehículo o concesionaria..."
          class="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-xs"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select
          v-model="statusFilter"
          class="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs cursor-pointer"
        >
          <option value="">Todos los estados</option>
          <option value="Aprobado">Aprobado</option>
          <option value="En evaluación">En evaluación</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="financingStore.isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">Cargando solicitudes de financiamiento...</p>
    </div>

    <!-- Empty State when API has no simulations -->
    <div
      v-else-if="filteredApplications.length === 0"
      class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center"
    >
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
        <i class="pi pi-file text-2xl"></i>
      </div>
      <h3 class="text-base font-bold text-gray-900">
        No tienes solicitudes registradas
      </h3>
      <p class="mt-1 text-xs text-gray-500 max-w-md">
        Aún no has enviado ninguna solicitud o simulación de crédito vehicular. Puedes comenzar seleccionando un vehículo en el catálogo.
      </p>
      <div class="mt-5">
        <router-link
          to="/vehicles"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-semibold text-xs transition-colors"
        >
          <i class="pi pi-car text-xs"></i>
          <span>Explorar Vehículos</span>
        </router-link>
      </div>
    </div>

    <!-- Applications Table from Backend API -->
    <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50/70 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <th scope="col" class="py-4 px-6">Vehículo</th>
              <th scope="col" class="py-4 px-6">Concesionaria / Entidad</th>
              <th scope="col" class="py-4 px-6">Fecha</th>
              <th scope="col" class="py-4 px-6 text-center">Estado de Crédito</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr
              v-for="item in filteredApplications"
              :key="item.id"
              class="hover:bg-gray-50/60 transition-colors"
            >
              <!-- Vehículo -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <i class="pi pi-car text-sm"></i>
                  </div>
                  <div>
                    <span class="font-bold text-gray-900 block leading-tight">{{ item.vehicle }}</span>
                    <span class="text-xs text-gray-400 font-mono">Ref: #{{ item.id.substring(0, 8) }}</span>
                  </div>
                </div>
              </td>

              <!-- Concesionaria -->
              <td class="py-4 px-6 font-medium text-gray-700">
                <div class="flex items-center gap-1.5">
                  <i class="pi pi-building text-xs text-gray-400"></i>
                  <span>{{ item.concessionaire }}</span>
                </div>
              </td>

              <!-- Fecha -->
              <td class="py-4 px-6 text-xs text-gray-500 font-medium">
                {{ item.date }}
              </td>

              <!-- Estado de Crédito -->
              <td class="py-4 px-6 text-center">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide',
                    item.status === 'Aprobado'
                      ? 'bg-[#00a887] text-white'
                      : 'bg-[#ffe8d6] text-[#c96316] border border-[#ffd1a9]'
                  ]"
                >
                  <span
                    :class="[
                      'w-1.5 h-1.5 rounded-full mr-1.5',
                      item.status === 'Aprobado' ? 'bg-white' : 'bg-[#c96316]'
                    ]"
                  ></span>
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer / Pagination bar -->
      <div class="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Mostrando {{ filteredApplications.length }} solicitudes registradas en la base de datos</span>
        <span>Actualizado en tiempo real</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import { useFinancingStore } from '@/financing/application/financing.store'
import { usePartnersStore } from '@/partners/application/partners.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'

const financingStore = useFinancingStore()
const partnersStore = usePartnersStore()
const catalogStore = useCatalogStore()

const searchFilter = ref<string>('')
const statusFilter = ref<string>('')

interface ApplicationRow {
  id: string
  vehicle: string
  concessionaire: string
  date: string
  status: string
  isSimulationPromotion?: boolean
}

onMounted(async () => {
  await Promise.all([
    financingStore.fetchMyCreditApplications(),
    financingStore.fetchSimulations(0, 50),
    partnersStore.fetchFinancialEntities(),
    catalogStore.fetchVehicles()
  ])
})

const applications = computed<ApplicationRow[]>(() => {
  // If user has formal credit applications from API /api/v1/credit-applications/me
  if (financingStore.creditApplications.length > 0) {
    return financingStore.creditApplications.map((app) => {
      const entity = partnersStore.financialEntities.find(e => e.id === app.financialEntityId)
      const vehicle = catalogStore.vehicles.find(v => v.id === app.vehicleId)
      const entityName = entity ? entity.name : 'Entidad Financiera Aliada'
      const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.manufactureYear})` : (app.vehicleTitle || 'Crédito Vehicular Solicitado')

      return {
        id: app.id,
        vehicle: vehicleName,
        concessionaire: entityName,
        date: app.formattedDate,
        status: app.statusLabel
      }
    })
  }

  // Fallback: list existing credit simulations
  return financingStore.simulations.map((sim) => {
    const entity = partnersStore.financialEntities.find(e => e.id === sim.financialEntityId)
    const entityName = entity ? entity.name : 'Entidad Financiera Aliada'
    const dateFormatted = sim.startDate ? new Date(sim.startDate).toLocaleDateString('es-PE') : 'Reciente'
    const statusVal = sim.tcea > 0 ? 'Pre-evaluado' : 'En evaluación'

    return {
      id: sim.id,
      vehicle: sim.title || `Simulación Crédito (${sim.currency} ${sim.vehiclePriceAmount.toLocaleString()})`,
      concessionaire: entityName,
      date: dateFormatted,
      status: statusVal,
      isSimulationPromotion: true
    }
  })
})

const filteredApplications = computed(() => {
  return applications.value.filter(app => {
    const q = searchFilter.value.toLowerCase().trim()
    const matchesQuery = !q ||
      app.vehicle.toLowerCase().includes(q) ||
      app.concessionaire.toLowerCase().includes(q) ||
      app.id.toLowerCase().includes(q)
    const matchesStatus = !statusFilter.value || app.status === statusFilter.value
    return matchesQuery && matchesStatus
  })
})
</script>

<style scoped>
</style>
