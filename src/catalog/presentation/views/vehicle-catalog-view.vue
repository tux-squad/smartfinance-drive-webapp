<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner / Greeting matching Mockup Image 1 -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
          Bienvenido, {{ userFirstName }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Gestiona tus búsquedas y solicitudes de financiamiento automotriz desde un solo lugar.
        </p>
      </div>

      <!-- Action Button if Dealer / Admin -->
      <div v-if="isDealerOrAdmin">
        <Button
          :label="t('catalog.registerVehicleBtn')"
          icon="pi pi-plus"
          severity="success"
          class="!rounded-xl !py-2.5 !px-5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs"
          @click="isRegisterModalOpen = true"
        />
      </div>
    </div>

    <!-- Search Bar matching Mockup Image 1 -->
    <div class="relative">
      <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        <i class="pi pi-search text-base"></i>
      </span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar vehículos por marca, modelo o año..."
        class="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-xs transition-all"
        @input="handleSearchInput"
      />
    </div>

    <!-- Section: Recomendados para ti matching Mockup Image 1 -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-950">
          Recomendados para ti
        </h2>
        <span class="text-xs text-gray-500 font-medium">
          {{ displayVehicles.length }} unidades disponibles
        </span>
      </div>

      <!-- Loading State -->
      <div v-if="catalogStore.isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
        <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
        <p class="text-sm text-gray-500 font-medium">{{ t('catalog.loadingText') }}</p>
      </div>

      <!-- Empty State when API has no vehicles -->
      <div
        v-else-if="displayVehicles.length === 0"
        class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center"
      >
        <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          <i class="pi pi-car text-2xl"></i>
        </div>
        <h3 class="text-base font-bold text-gray-900">No se encontraron vehículos</h3>
        <p class="text-xs text-gray-500 mt-1 max-w-sm">
          No hay unidades vehiculares disponibles en el catálogo oficial en este momento.
        </p>
      </div>

      <!-- Vehicles Grid from Backend API -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="car in displayVehicles"
          :key="car.id"
          class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <!-- Card Media Container -->
          <div class="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
            <!-- Badge Recomendado -->
            <span
              v-if="car.isRecommended"
              class="absolute top-3.5 left-3.5 z-10 bg-[#00a887] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs"
            >
              Recomendado
            </span>

            <!-- Image or Styled Car Vector -->
            <img
              v-if="car.imageUrl"
              :src="car.imageUrl"
              :alt="car.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-300 space-y-2 bg-gradient-to-br from-slate-100 to-blue-50/50">
              <i class="pi pi-car text-5xl text-blue-900/30"></i>
              <span class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{{ car.brand }}</span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div class="space-y-1.5">
              <h3 class="text-base font-bold text-gray-900 leading-snug">
                {{ car.title }}
              </h3>
              <div class="text-xl font-extrabold text-gray-950">
                {{ car.formattedPrice }}
              </div>
              <div class="flex items-center space-x-1.5 text-xs text-gray-500">
                <i class="pi pi-map-marker text-[11px] text-gray-400"></i>
                <span>{{ car.location }} · {{ car.mileage }}</span>
              </div>
            </div>

            <!-- Action Button: Solicitar Pre-evaluación -->
            <div class="pt-2">
              <button
                type="button"
                @click="handlePreEvaluation(car)"
                class="w-full py-2.5 px-4 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-semibold text-xs text-center shadow-xs transition-colors"
              >
                Solicitar Pre-evaluación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Vehicle Modal (Dealer / Admin only) -->
    <RegisterVehicleDialog
      v-if="isDealerOrAdmin"
      v-model:visible="isRegisterModalOpen"
      @created="onVehicleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'
import { useCatalogStore } from '../../application/catalog.store'
import { useIamStore } from '@/iam/application/iam.store'
import { useProfilesStore } from '@/profiles/application/profiles.store'
import RegisterVehicleDialog from '../components/register-vehicle-dialog.vue'

const { t } = useI18n()
const router = useRouter()
const catalogStore = useCatalogStore()
const iamStore = useIamStore()
const profilesStore = useProfilesStore()

const isRegisterModalOpen = ref<boolean>(false)
const searchQuery = ref<string>('')

interface DisplayVehicle {
  id: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  formattedPrice: string
  location: string
  mileage: string
  isRecommended: boolean
  imageUrl?: string
}

const isDealerOrAdmin = computed(() => {
  return iamStore.roles.includes('ROLE_DEALER') || iamStore.roles.includes('ROLE_ADMIN')
})

const userFirstName = computed(() => {
  if (profilesStore.currentProfile?.firstName) {
    return profilesStore.currentProfile.firstName
  }
  if (iamStore.username && iamStore.username !== 'Invitado') {
    const raw = iamStore.username.split('@')[0] || ''
    const clean = raw.replace(/[._-]/g, ' ')
    if (clean) return clean.split(' ')[0]
  }
  return 'Comprador'
})

const displayVehicles = computed<DisplayVehicle[]>(() => {
  let list: DisplayVehicle[] = catalogStore.vehicles.map((v) => ({
    id: v.id,
    title: `${v.brand} ${v.model} ${v.manufactureYear}`,
    brand: v.brand,
    model: v.model,
    year: v.manufactureYear,
    price: v.priceAmount,
    formattedPrice: v.formattedPrice || `$${v.priceAmount.toLocaleString()} USD`,
    location: 'Perú',
    mileage: v.condition === 'NEW' ? '0 km (Nuevo)' : 'Certificado',
    isRecommended: true,
    imageUrl: v.imagePath
  }))

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    return list.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      String(v.year).includes(q)
    )
  }

  return list
})

onMounted(async () => {
  await catalogStore.fetchVehicles()
})

const handleSearchInput = () => {
  // Client-side live filter for instant feedback
}

const handlePreEvaluation = (car: DisplayVehicle) => {
  router.push({
    name: 'simulations',
    query: {
      vehicleId: car.id,
      vehiclePrice: car.price,
      vehicleModel: car.title
    }
  })
}

const onVehicleCreated = () => {
  catalogStore.fetchVehicles({ page: 0 })
}
</script>

<style scoped>
</style>
