<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header matching Mockup Screenshot 1 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
      <div class="space-y-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
          {{ t('dealerInventory.title') }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ t('dealerInventory.subtitle') }}
        </p>
      </div>

      <!-- Action Button: + Añadir Vehículo -->
      <div>
        <router-link
          to="/dealer/inventory/new"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-bold text-xs shadow-xs transition-colors"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>{{ t('dealerInventory.addBtn') }}</span>
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingInventory || catalogStore.isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">{{ t('dealerInventory.loading') }}</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="dealerVehicles.length === 0"
      class="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4"
    >
      <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
        <i class="pi pi-car text-2xl"></i>
      </div>
      <h3 class="text-base font-bold text-gray-900">{{ t('dealerInventory.emptyTitle') }}</h3>
      <p class="text-xs text-gray-500">
        {{ t('dealerInventory.emptySubtitle') }}
      </p>
      <div>
        <router-link
          to="/dealer/inventory/new"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eb8f47] text-white font-semibold text-xs transition-colors"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>{{ t('dealerInventory.emptyBtn') }}</span>
        </router-link>
      </div>
    </div>

    <!-- Inventory Table matching Mockup Screenshot 1 -->
    <div v-else class="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50/50 text-xs font-bold text-gray-500">
              <th scope="col" class="py-4 px-6 w-24">{{ t('dealerInventory.colImage') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('dealerInventory.colVehicle') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('dealerInventory.colCondition') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('dealerInventory.colDays') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('dealerInventory.colPrice') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('dealerInventory.colStatus') }}</th>
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
                  {{ car.condition === 'NEW' ? t('dealerInventory.conditionNew') : t('dealerInventory.conditionUsed') }}
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
                  <option value="ACTIVE">{{ t('dealerInventory.statusActive') }}</option>
                  <option value="RESERVED">{{ t('dealerInventory.statusReserved') }}</option>
                  <option value="SOLD">{{ t('dealerInventory.statusSold') }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer count -->
      <div class="px-6 py-3.5 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>{{ t('dealerInventory.showingFooter', { count: dealerVehicles.length }) }}</span>
        <span>{{ t('dealerInventory.dbUpdated') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import type { Vehicle } from '@/catalog/domain/vehicle.entity'
import { useIamStore } from '@/iam/application/iam.store'

const { t } = useI18n()

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

const fallbackVehicles: Vehicle[] = [
  {
    id: 'v-toyota-cross-2023',
    userId: 'dealer-user-1',
    financialEntityId: 'fe-bcp-1',
    brand: 'Toyota',
    model: 'Corolla Cross',
    manufactureYear: 2023,
    condition: 'NEW',
    priceAmount: 26900,
    currency: 'USD',
    imagePath: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    images: [],
    formattedPrice: '$ 26,900.00',
    displayName: 'Toyota Corolla Cross (2023)'
  } as unknown as Vehicle,
  {
    id: 'v-honda-crv-2024',
    userId: 'dealer-user-1',
    financialEntityId: 'fe-bbva-1',
    brand: 'Honda',
    model: 'CR-V',
    manufactureYear: 2024,
    condition: 'NEW',
    priceAmount: 34500,
    currency: 'USD',
    imagePath: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
    status: 'RESERVED',
    images: [],
    formattedPrice: '$ 34,500.00',
    displayName: 'Honda CR-V (2024)'
  } as unknown as Vehicle,
  {
    id: 'v-mazda-cx5-2023',
    userId: 'dealer-user-1',
    financialEntityId: 'fe-interbank-1',
    brand: 'Mazda',
    model: 'CX-5',
    manufactureYear: 2023,
    condition: 'NEW',
    priceAmount: 29800,
    currency: 'USD',
    imagePath: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    images: [],
    formattedPrice: '$ 29,800.00',
    displayName: 'Mazda CX-5 (2023)'
  } as unknown as Vehicle,
  {
    id: 'v-hyundai-tucson-2023',
    userId: 'dealer-user-1',
    financialEntityId: 'fe-banbif-1',
    brand: 'Hyundai',
    model: 'Tucson',
    manufactureYear: 2023,
    condition: 'NEW',
    priceAmount: 28900,
    currency: 'USD',
    imagePath: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    status: 'SOLD',
    images: [],
    formattedPrice: '$ 28,900.00',
    displayName: 'Hyundai Tucson (2023)'
  } as unknown as Vehicle
]

const dealerVehicles = computed(() => {
  if (userSpecificVehicles.value.length > 0) {
    return userSpecificVehicles.value
  }
  if (catalogStore.vehicles.length > 0) {
    return catalogStore.vehicles
  }
  return fallbackVehicles
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
