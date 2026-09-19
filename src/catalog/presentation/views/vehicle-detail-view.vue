<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Loading State -->
    <div v-if="catalogStore.isLoading" class="flex flex-col items-center justify-center py-24 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">Cargando detalles oficiales del vehículo...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="catalogStore.error || !vehicle"
      class="rounded-3xl border border-red-200 bg-red-50/60 p-12 text-center max-w-2xl mx-auto space-y-4"
    >
      <div class="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
        <i class="pi pi-exclamation-triangle text-2xl"></i>
      </div>
      <h3 class="text-lg font-bold text-gray-900">
        Vehículo no encontrado
      </h3>
      <p class="text-xs text-gray-600">
        {{ catalogStore.error || 'La unidad vehicular solicitada no se encuentra disponible en la base de datos.' }}
      </p>
      <router-link
        to="/vehicles"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a1936] text-white text-xs font-semibold hover:bg-blue-900 transition-colors"
      >
        <i class="pi pi-arrow-left text-xs"></i>
        <span>Volver a Vehículos a buscar</span>
      </router-link>
    </div>

    <!-- Main Detail Content matching Mockup Image 2 -->
    <template v-else>
      <!-- Header Bar matching Mockup Image 2 -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
            Detalle del Vehículo
          </h1>
          <p class="text-sm text-gray-500">
            Revisa el auto seleccionado y continúa con tu solicitud.
          </p>
        </div>

        <div>
          <span class="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-mono font-semibold bg-gray-100 text-gray-700 border border-gray-200 shadow-2xs">
            Código SF-{{ vehicle.manufactureYear }}-{{ vehicle.model.toUpperCase().replace(/\s+/g, '') }}
          </span>
        </div>
      </div>

      <!-- 2-Column Layout matching Mockup Image 2 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Column: Media & Highlights (approx 7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Hero Image -->
          <div class="relative rounded-3xl overflow-hidden border border-gray-200 bg-gray-100 h-96 shadow-xs flex items-center justify-center">
            <!-- Verified Badge -->
            <span class="absolute top-4 left-4 z-10 inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-[#00a887] text-white shadow-sm">
              Vehículo Verificado
            </span>

            <img
              v-if="currentHeroImage"
              :src="currentHeroImage"
              :alt="vehicle.displayName"
              class="w-full h-full object-cover transition-all duration-300"
              @error="onImageError($event, vehicle.brand)"
            />
            <div v-else class="flex flex-col items-center justify-center text-gray-300 space-y-2">
              <i class="pi pi-car text-6xl text-blue-900/20"></i>
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ vehicle.brand }}</span>
            </div>
          </div>

          <!-- Thumbnail Gallery Row -->
          <div class="grid grid-cols-4 gap-3">
            <div
              v-for="(imgUrl, index) in galleryImages"
              :key="index"
              @click="activeThumbnailIndex = index"
              :class="[
                'h-20 rounded-2xl border-2 overflow-hidden flex items-center justify-center bg-gray-50 transition-all cursor-pointer',
                activeThumbnailIndex === index ? 'border-blue-600 shadow-xs ring-2 ring-blue-400/30' : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <img
                :src="imgUrl"
                :alt="`Vista ${index + 1}`"
                class="w-full h-full object-cover"
                @error="onImageError($event, vehicle.brand)"
              />
            </div>
          </div>

          <!-- Equipamiento Destacado matching Mockup Image 2 -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 class="text-base font-bold text-gray-950">Equipamiento Destacado</h2>
              <p class="text-xs text-gray-500">Lo mejor del auto en mini-cards visuales.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Airbags -->
              <div class="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                <div class="w-9 h-9 rounded-lg bg-white shadow-2xs border border-gray-200 flex items-center justify-center text-blue-600 shrink-0">
                  <i class="pi pi-shield text-base"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-gray-900">Airbags</div>
                  <div class="text-[11px] text-gray-500">7 airbags de serie</div>
                </div>
              </div>

              <!-- Pantalla -->
              <div class="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                <div class="w-9 h-9 rounded-lg bg-white shadow-2xs border border-gray-200 flex items-center justify-center text-blue-600 shrink-0">
                  <i class="pi pi-desktop text-base"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-gray-900">Pantalla</div>
                  <div class="text-[11px] text-gray-500">Pantalla táctil 9"</div>
                </div>
              </div>

              <!-- Conectividad -->
              <div class="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                <div class="w-9 h-9 rounded-lg bg-white shadow-2xs border border-gray-200 flex items-center justify-center text-blue-600 shrink-0">
                  <i class="pi pi-wifi text-base"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-gray-900">Conectividad</div>
                  <div class="text-[11px] text-gray-500">Apple CarPlay y Android Auto</div>
                </div>
              </div>

              <!-- Híbrido / Motor -->
              <div class="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                <div class="w-9 h-9 rounded-lg bg-white shadow-2xs border border-gray-200 flex items-center justify-center text-blue-600 shrink-0">
                  <i class="pi pi-bolt text-base"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-gray-900">{{ isHybridOrEfficient ? 'Híbrido' : 'Motor Eficiente' }}</div>
                  <div class="text-[11px] text-gray-500">Inyección electrónica de alto rendimiento</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Confianza y Transparencia matching Mockup Image 2 -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 class="text-base font-bold text-gray-950">Confianza y transparencia</h2>
              <p class="text-xs text-gray-500">Todo lo que necesitas para tomar una decisión segura.</p>
            </div>

            <div class="space-y-3 text-xs text-gray-700">
              <div class="flex items-start gap-2.5">
                <i class="pi pi-check-circle text-[#00a887] text-base shrink-0 mt-0.5"></i>
                <span>Inspección legal y mecánica realizada por SmartFinance.</span>
              </div>
              <div class="flex items-start gap-2.5">
                <i class="pi pi-check-circle text-[#00a887] text-base shrink-0 mt-0.5"></i>
                <span>Documentación y origen del vehículo verificados ante registros públicos.</span>
              </div>
              <div class="flex items-start gap-2.5">
                <i class="pi pi-check-circle text-[#00a887] text-base shrink-0 mt-0.5"></i>
                <span>Soporte financiero y acompañamiento bancario durante todo el proceso.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Pricing, Loan Simulation & Concessionaire (approx 5 cols) -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-6">
            <!-- Vehicle Main Title & Spec Line -->
            <div class="space-y-1">
              <h2 class="text-2xl font-extrabold text-gray-950 tracking-tight">
                {{ vehicle.brand }} {{ vehicle.model }} {{ vehicle.manufactureYear }}
              </h2>
              <p class="text-xs text-gray-500 font-medium">
                {{ vehicle.condition === 'NEW' ? '0 km' : 'Certificado' }} · Automática · {{ vehicle.condition === 'NEW' ? 'Nuevo' : 'Seminuevo' }}
              </p>
            </div>

            <!-- Price -->
            <div class="space-y-0.5">
              <div class="text-3xl font-black text-gray-950">
                {{ vehicle.formattedPrice }}
              </div>
              <div class="text-xs font-semibold text-[#eb8f47]">
                Cuota desde ${{ estimatedMonthlyPayment }}/mes
              </div>
            </div>

            <!-- Simulador de Cuota Card matching Mockup Image 2 -->
            <div class="rounded-2xl bg-gray-50/70 border border-gray-200 p-4 space-y-3">
              <div class="text-xs font-bold text-gray-900">Simulador de cuota</div>

              <div class="space-y-2 text-xs">
                <div class="flex justify-between text-gray-600">
                  <span>Plazo</span>
                  <span class="font-bold text-gray-900">48 meses</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Enganche</span>
                  <span class="font-bold text-gray-900">10%</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Tasa estimada</span>
                  <span class="font-bold text-gray-900">8.9% anual</span>
                </div>
              </div>

              <div class="pt-1">
                <div class="w-full py-2 px-3 rounded-xl bg-[#f7ab6d] text-white text-center font-bold text-xs shadow-2xs">
                  ${{ estimatedMonthlyPayment }}/mes
                </div>
              </div>
            </div>

            <!-- Concessionaire Card matching Mockup Image 2 -->
            <div class="rounded-2xl border border-gray-200 p-4 flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-xl bg-[#1e40af] text-white font-black text-sm flex items-center justify-center shrink-0">
                {{ dealerInitials }}
              </div>
              <div class="space-y-0.5">
                <div class="text-xs text-gray-400 font-medium">Concesionario</div>
                <div class="text-xs font-bold text-gray-900">{{ dealerName }}</div>
                <div class="text-[11px] text-gray-500">Lima, Perú · 4.9/5</div>
              </div>
            </div>

            <!-- Action Buttons matching Mockup Image 2 -->
            <div class="space-y-2.5 pt-2">
              <button
                type="button"
                @click="goToPreEvaluation"
                class="w-full py-3 px-4 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-semibold text-xs text-center shadow-xs transition-colors"
              >
                Solicitar Pre-evaluación
              </button>

              <button
                type="button"
                @click="goToScheduleVisit"
                class="w-full py-2.5 px-4 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs text-center transition-colors"
              >
                Agendar Visita
              </button>
            </div>

            <!-- Disclaimer note -->
            <p class="text-[11px] text-gray-400 leading-relaxed pt-1">
              Tu solicitud se envía directamente al concesionario y un asesor financiero te contacta para confirmar disponibilidad y condiciones.
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import { useCatalogStore } from '../../application/catalog.store'
import { usePartnersStore } from '@/partners/application/partners.store'

const route = useRoute()
const router = useRouter()
const catalogStore = useCatalogStore()
const partnersStore = usePartnersStore()

const vehicleId = computed(() => route.params.id as string)
const vehicle = computed(() => catalogStore.selectedVehicle)
const activeThumbnailIndex = ref<number>(0)

const galleryImages = computed<string[]>(() => {
  if (!vehicle.value) return []
  if (vehicle.value.images && vehicle.value.images.length > 0) {
    return vehicle.value.images.slice(0, 4)
  }
  if (vehicle.value.imagePath) {
    return [vehicle.value.imagePath, vehicle.value.imagePath, vehicle.value.imagePath, vehicle.value.imagePath]
  }
  return []
})

const currentHeroImage = computed<string>(() => {
  if (galleryImages.value.length > 0 && galleryImages.value[activeThumbnailIndex.value]) {
    return galleryImages.value[activeThumbnailIndex.value]!
  }
  return vehicle.value?.imagePath || ''
})

const onImageError = (event: Event, brand?: string) => {
  const target = event.target as HTMLImageElement
  const b = (brand || '').toLowerCase()
  if (b.includes('toyota')) {
    target.src = 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80'
  } else if (b.includes('honda')) {
    target.src = 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80'
  } else {
    target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
  }
}

onMounted(async () => {
  if (vehicleId.value) {
    await Promise.all([
      catalogStore.fetchVehicleById(vehicleId.value),
      partnersStore.fetchFinancialEntities()
    ])
  }
})

const isHybridOrEfficient = computed(() => {
  if (!vehicle.value) return false
  const text = `${vehicle.value.brand} ${vehicle.value.model}`.toLowerCase()
  return text.includes('hybrid') || text.includes('híbrido') || text.includes('rav4') || text.includes('corolla')
})

const estimatedMonthlyPayment = computed(() => {
  if (!vehicle.value) return '250'
  const price = vehicle.value.priceAmount
  // Standard 48 months with 10% down payment and ~8.9% rate:
  const financed = price * 0.9
  const monthlyRate = 0.089 / 12
  const months = 48
  const pmt = (financed * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(pmt).toLocaleString('en-US')
})

const dealerEntity = computed(() => {
  if (!vehicle.value?.financialEntityId) return undefined
  return partnersStore.financialEntities.find(e => e.id === vehicle.value?.financialEntityId)
})

const dealerName = computed(() => {
  return dealerEntity.value?.name || 'AutoPlaza Oficial'
})

const dealerInitials = computed(() => {
  const parts = dealerName.value.split(' ')
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
  }
  return dealerName.value.substring(0, 2).toUpperCase()
})

const goToPreEvaluation = () => {
  if (vehicle.value) {
    router.push(`/vehicles/${vehicle.value.id}/pre-evaluation`)
  }
}

const goToScheduleVisit = () => {
  if (vehicle.value) {
    router.push({
      path: '/messages',
      query: {
        vehicleId: vehicle.value.id,
        dealerId: vehicle.value.financialEntityId || undefined
      }
    })
  }
}
</script>

<style scoped>
</style>
