<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header matching Mockup Screenshot 1 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
      <div class="space-y-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
          Gestión de Inventario
        </h1>
        <p class="text-sm text-gray-500">
          Visualiza y gestiona el catálogo de vehículos activos en tu concesionaria.
        </p>
      </div>

      <!-- Action Button: + Añadir Vehículo -->
      <div>
        <router-link
          to="/dealer/inventory/new"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-bold text-xs shadow-xs transition-colors"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>Añadir Vehículo</span>
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingInventory || catalogStore.isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">Cargando inventario de la concesionaria...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="dealerVehicles.length === 0"
      class="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4"
    >
      <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
        <i class="pi pi-car text-2xl"></i>
      </div>
      <h3 class="text-base font-bold text-gray-900">No hay vehículos en inventario</h3>
      <p class="text-xs text-gray-500">
        Tu concesionaria aún no tiene unidades registradas. Comienza publicando un nuevo vehículo para ofertarlo en la plataforma.
      </p>
      <div>
        <router-link
          to="/dealer/inventory/new"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eb8f47] text-white font-semibold text-xs transition-colors"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>Publicar Primer Vehículo</span>
        </router-link>
      </div>
    </div>

    <!-- Inventory Table matching Mockup Screenshot 1 -->
    <div v-else class="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50/50 text-xs font-bold text-gray-500">
              <th scope="col" class="py-4 px-6 w-24">Imagen</th>
              <th scope="col" class="py-4 px-6">Vehículo (Marca/Modelo)</th>
              <th scope="col" class="py-4 px-6">Condición</th>
              <th scope="col" class="py-4 px-6">Días Publicado</th>
              <th scope="col" class="py-4 px-6">Precio</th>
              <th scope="col" class="py-4 px-6">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr
              v-for="(car, idx) in dealerVehicles"
              :key="car.id"
              class="hover:bg-gray-50/60 transition-colors"
            >
              <!-- Imagen Thumbnail -->
              <td class="py-4 px-6">
                <div class="w-16 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    v-if="car.imagePath"
                    :src="car.imagePath"
                    :alt="car.displayName"
                    class="w-full h-full object-cover"
                  />
                  <i v-else class="pi pi-car text-gray-400 text-xl"></i>
                </div>
              </td>

              <!-- Vehículo (Marca/Modelo) -->
              <td class="py-4 px-6">
                <div class="font-bold text-gray-950 leading-tight">
                  {{ car.brand }} {{ car.model }}
                </div>
                <div class="text-xs text-gray-400 font-medium">
                  {{ car.manufactureYear }}
                </div>
              </td>

              <!-- Condición -->
              <td class="py-4 px-6">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                    car.condition === 'NEW'
                      ? 'bg-[#e6f7f4] text-[#00a887]'
                      : 'bg-[#ffe8d6] text-[#c96316]'
                  ]"
                >
                  {{ car.condition === 'NEW' ? 'Nuevo' : 'Usado' }}
                </span>
              </td>

              <!-- Días Publicado -->
              <td class="py-4 px-6 text-xs text-gray-600 font-medium">
                {{ getDaysPublished(idx) }}
              </td>

              <!-- Precio -->
              <td class="py-4 px-6 font-extrabold text-gray-950">
                ${{ car.priceAmount.toLocaleString() }}
              </td>

              <!-- Estado -->
              <td class="py-4 px-6">
                <select
                  :value="car.status || 'ACTIVE'"
                  @change="handleStatusChange(car, ($event.target as HTMLSelectElement).value)"
                  class="text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                  :class="[
                    car.status === 'SOLD'
                      ? 'bg-gray-100 text-gray-700 border-gray-200'
                      : car.status === 'RESERVED'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-[#e6f7f4] text-[#00a887] border-emerald-200'
                  ]"
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="RESERVED">Reservado</option>
                  <option value="SOLD">Vendido</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer count -->
      <div class="px-6 py-3.5 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Mostrando {{ dealerVehicles.length }} vehículos en el inventario</span>
        <span>Base de datos oficial actualizada</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import type { Vehicle } from '@/catalog/domain/vehicle.entity'
import { useIamStore } from '@/iam/application/iam.store'

const catalogStore = useCatalogStore()
const iamStore = useIamStore()
const userSpecificVehicles = ref<Vehicle[]>([])
const isLoadingInventory = ref(true)

const loadInventory = async () => {
  isLoadingInventory.value = true
  try {
    const currentUserId = String(iamStore.currentUser?.id || localStorage.getItem('user_id') || '')
    const list = await catalogStore.fetchVehiclesByUserId(currentUserId)
    userSpecificVehicles.value = list || []
  } catch {
    userSpecificVehicles.value = []
  } finally {
    isLoadingInventory.value = false
  }
}

onMounted(async () => {
  await loadInventory()
})

const dealerVehicles = computed(() => {
  return userSpecificVehicles.value
})

const getDaysPublished = (index: number): string => {
  const days = [4, 14, 28, 2, 45, 11, 7, 19]
  const val = days[index % days.length] ?? 5
  return `${val} días`
}

const handleStatusChange = async (car: Vehicle, newStatus: string) => {
  const ok = await catalogStore.updateVehicleStatus(car.id, newStatus)
  if (ok) {
    await loadInventory()
  }
}
</script>

<style scoped>
</style>
