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

      <!-- Feedback Banner -->
      <div
        v-if="bannerFeedback"
        class="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-800 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <i class="pi pi-check-circle text-emerald-600 text-sm"></i>
          <span>{{ bannerFeedback }}</span>
        </div>
        <button type="button" @click="bannerFeedback = null" class="text-emerald-500 hover:text-emerald-800">
          <i class="pi pi-times text-xs"></i>
        </button>
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
                'h-20 rounded-2xl border-2 overflow-hidden flex items-center justify-center bg-gray-50 transition-all cursor-pointer relative group',
                activeThumbnailIndex === index ? 'border-blue-600 shadow-xs ring-2 ring-blue-400/30' : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <img
                :src="imgUrl"
                :alt="`Vista ${index + 1}`"
                class="w-full h-full object-cover"
                @error="onImageError($event, vehicle.brand)"
              />
              <button
                v-if="isDealerOrOwner"
                type="button"
                @click.stop="handleDeleteGalleryImage(index)"
                title="Eliminar foto de la galería"
                class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <i class="pi pi-times text-[9px]"></i>
              </button>
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

            <!-- Action Buttons matching Mockup Image 2 & CRM integration -->
            <div class="space-y-2.5 pt-2">
              <button
                type="button"
                @click="openProspectModal"
                class="w-full py-3 px-4 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-bold text-xs text-center shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <i class="pi pi-heart text-xs"></i>
                <span>Estoy interesado (Contactar Asesor)</span>
              </button>

              <button
                type="button"
                @click="openTestDriveModal"
                class="w-full py-2.5 px-4 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs text-center transition-colors flex items-center justify-center gap-2"
              >
                <i class="pi pi-calendar-plus text-xs"></i>
                <span>Agendar Test Drive</span>
              </button>

              <button
                type="button"
                @click="goToPreEvaluation"
                class="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs text-center transition-colors"
              >
                Solicitar Pre-evaluación Financiera
              </button>

              <button
                type="button"
                @click="router.push(`/projections?vehicleId=${vehicleId}`)"
                class="w-full py-2 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs text-center transition-colors flex items-center justify-center gap-2"
              >
                <i class="pi pi-chart-line text-xs"></i>
                <span>Ver Proyección de Depreciación</span>
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

    <!-- Modal Estoy Interesado (2.41 createProspect) -->
    <Dialog
      v-model:visible="isProspectOpen"
      modal
      header="Estoy interesado en este vehículo"
      :style="{ width: '500px', maxWidth: '95vw' }"
      :dismissableMask="true"
    >
      <form @submit.prevent="handleSubmitProspect" class="space-y-4 pt-2">
        <p class="text-xs text-gray-500">
          Envía tus datos de contacto para que el equipo comercial de <strong>{{ vehicle?.brand }} {{ vehicle?.model }}</strong> se comunique contigo de inmediato.
        </p>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Nombre Completo</label>
          <InputText v-model="prospectForm.fullName" class="w-full text-xs" placeholder="Ej. Juan Pérez" required />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico</label>
            <InputText v-model="prospectForm.email" type="email" class="w-full text-xs" placeholder="juan@ejemplo.com" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Teléfono / WhatsApp</label>
            <InputText v-model="prospectForm.phone" class="w-full text-xs" placeholder="+51 987654321" required />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Ingreso Mensual (USD)</label>
            <InputNumber v-model="prospectForm.monthlyIncome" class="w-full text-xs" :min="0" mode="currency" currency="USD" locale="en-US" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Cuota Inicial (USD)</label>
            <InputNumber v-model="prospectForm.downPayment" class="w-full text-xs" :min="0" mode="currency" currency="USD" locale="en-US" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Mensaje o Consulta Opcional</label>
          <textarea
            v-model="prospectForm.notes"
            rows="3"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
            placeholder="Hola, deseo información sobre disponibilidad de entrega inmediata y opciones de financiamiento..."
          ></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <Button label="Cancelar" text severity="secondary" @click="isProspectOpen = false" class="!text-xs" />
          <Button
            type="submit"
            label="Registrar Interés"
            icon="pi pi-send"
            :loading="isProspectSubmitting"
            class="!text-xs !bg-[#eb8f47] !border-[#eb8f47]"
          />
        </div>
      </form>
    </Dialog>

    <!-- Modal Agendar Test Drive (scheduleTestDrive & 2.44 getTestDriveById) -->
    <Dialog
      v-model:visible="isTestDriveOpen"
      modal
      header="Agendar Prueba de Manejo (Test Drive)"
      :style="{ width: '500px', maxWidth: '95vw' }"
      :dismissableMask="true"
    >
      <!-- Confirmed Detail View -->
      <div v-if="scheduledConfirmation" class="space-y-4 pt-2">
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
          <div class="flex items-center gap-2 font-bold text-sm">
            <i class="pi pi-check-circle text-emerald-600"></i>
            <span>¡Test Drive Confirmado!</span>
          </div>
          <p class="text-xs text-emerald-700">
            Tu cita ha sido registrada y validada exitosamente en el sistema oficial del concesionario.
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-500">ID de Cita:</span>
            <span class="font-mono font-bold text-gray-900">{{ scheduledConfirmation.id }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Vehículo:</span>
            <span class="font-bold text-gray-900">{{ vehicle?.brand }} {{ vehicle?.model }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Fecha y Hora:</span>
            <span class="font-bold text-blue-700">{{ new Date(scheduledConfirmation.scheduledDateTime).toLocaleString('es-PE') }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Estado:</span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f7f4] text-[#00a887]">
              {{ scheduledConfirmation.status }}
            </span>
          </div>
          <div v-if="scheduledConfirmation.notes" class="pt-1 text-gray-600 border-t border-gray-200">
            <span class="font-medium text-gray-700">Nota:</span> {{ scheduledConfirmation.notes }}
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <Button label="Entendido" @click="isTestDriveOpen = false" class="!text-xs !bg-[#0a1936]" />
        </div>
      </div>

      <!-- Schedule Form View -->
      <form v-else @submit.prevent="handleSubmitTestDrive" class="space-y-4 pt-2">
        <p class="text-xs text-gray-500">
          Selecciona tu disponibilidad para probar este <strong>{{ vehicle?.brand }} {{ vehicle?.model }}</strong> en la concesionaria.
        </p>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Fecha y Hora Deseada</label>
          <input
            v-model="testDriveForm.scheduledDateTime"
            type="datetime-local"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Instrucciones o requerimientos</label>
          <textarea
            v-model="testDriveForm.notes"
            rows="3"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
            placeholder="Deseo probar en ruta urbana y revisar la capacidad de maletera..."
          ></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <Button label="Cancelar" text severity="secondary" @click="isTestDriveOpen = false" class="!text-xs" />
          <Button
            type="submit"
            label="Confirmar Cita de Test Drive"
            icon="pi pi-calendar"
            :loading="isTestDriveSubmitting"
            class="!text-xs !bg-blue-600 !border-blue-600"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { useCatalogStore } from '../../application/catalog.store'
import { usePartnersStore } from '@/partners/application/partners.store'
import { useCrmStore } from '@/financing/application/crm.store'
import { useIamStore } from '@/iam/application/iam.store'
import type { TestDrive } from '@/financing/domain/test-drive.entity'

const route = useRoute()
const router = useRouter()
const catalogStore = useCatalogStore()
const partnersStore = usePartnersStore()
const crmStore = useCrmStore()
const iamStore = useIamStore()

const vehicleId = computed(() => route.params.id as string)
const vehicle = computed(() => catalogStore.selectedVehicle)
const activeThumbnailIndex = ref<number>(0)
const bannerFeedback = ref<string | null>(null)

const isDealerOrOwner = computed(() => {
  return iamStore.roles.includes('ROLE_DEALER') ||
         iamStore.roles.includes('ROLE_ADMIN') ||
         Boolean(vehicle.value && iamStore.currentUser?.id && String(iamStore.currentUser.id) === String(vehicle.value.userId))
})

const handleDeleteGalleryImage = async (index: number) => {
  if (!vehicle.value?.id) return
  if (!window.confirm(`¿Estás seguro de eliminar la imagen #${index + 1} de la galería?`)) return
  try {
    const success = await catalogStore.deleteGalleryImage(vehicle.value.id, index)
    if (success) {
      bannerFeedback.value = `Imagen #${index + 1} eliminada exitosamente.`
      if (activeThumbnailIndex.value >= galleryImages.value.length) {
        activeThumbnailIndex.value = Math.max(0, galleryImages.value.length - 1)
      }
    }
  } catch (e: any) {
    bannerFeedback.value = `Error al eliminar la imagen: ${e?.message || 'Error desconocido'}`
  }
}

// 2.41 createProspect state
const isProspectOpen = ref(false)
const isProspectSubmitting = ref(false)
const prospectForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  monthlyIncome: 2500,
  downPayment: 5000,
  notes: ''
})

// 2.44 getTestDriveById & scheduleTestDrive state
const isTestDriveOpen = ref(false)
const isTestDriveSubmitting = ref(false)
const scheduledConfirmation = ref<TestDrive | null>(null)
const defaultDate = new Date(Date.now() + 86400000).toISOString().slice(0, 16)
const testDriveForm = reactive({
  scheduledDateTime: defaultDate,
  notes: ''
})

const galleryImages = computed<string[]>(() => {
  if (!vehicle.value) return []
  if (vehicle.value.images && vehicle.value.images.length > 0) {
    return vehicle.value.images.slice(0, 4)
  }
  if (vehicle.value.imagePath) {
    return [vehicle.value.imagePath]
  }
  return []
})

const currentHeroImage = computed<string>(() => {
  if (galleryImages.value.length > 0 && galleryImages.value[activeThumbnailIndex.value]) {
    return galleryImages.value[activeThumbnailIndex.value]!
  }
  return vehicle.value?.imagePath || ''
})

const onImageError = (event: Event, _brand?: string) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
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
  if (!vehicle.value) return '0'
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
  return dealerEntity.value?.name || 'Concesionaria Oficial'
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

const openProspectModal = () => {
  if (iamStore.currentUser) {
    prospectForm.fullName = iamStore.currentUser.username || ''
    prospectForm.email = iamStore.currentUser.username.includes('@') ? iamStore.currentUser.username : ''
  }
  isProspectOpen.value = true
}

const handleSubmitProspect = async () => {
  if (!vehicle.value) return
  isProspectSubmitting.value = true
  try {
    const prospect = await crmStore.createProspect({
      fullName: prospectForm.fullName,
      email: prospectForm.email,
      phone: prospectForm.phone,
      interestedVehicleId: vehicle.value.id,
      monthlyIncome: prospectForm.monthlyIncome,
      downPayment: prospectForm.downPayment,
      notes: prospectForm.notes
    })
    if (prospect) {
      bannerFeedback.value = `¡Tu solicitud de interés para ${vehicle.value.brand} ${vehicle.value.model} ha sido registrada con éxito! Un asesor se pondrá en contacto.`
      isProspectOpen.value = false
    } else {
      bannerFeedback.value = crmStore.error || 'No se pudo enviar la solicitud de interés.'
    }
  } finally {
    isProspectSubmitting.value = false
  }
}

const openTestDriveModal = () => {
  scheduledConfirmation.value = null
  isTestDriveOpen.value = true
}

const handleSubmitTestDrive = async () => {
  if (!vehicle.value) return
  isTestDriveSubmitting.value = true
  try {
    const scheduled = await crmStore.scheduleTestDrive({
      vehicleId: vehicle.value.id,
      dealershipId: vehicle.value.financialEntityId || '',
      scheduledDateTime: new Date(testDriveForm.scheduledDateTime).toISOString(),
      notes: testDriveForm.notes
    })

    if (scheduled) {
      // 2.44 Exercise getTestDriveById to load fresh confirmed details from backend
      const confirmed = await crmStore.fetchTestDriveById(scheduled.id)
      scheduledConfirmation.value = confirmed || scheduled
      bannerFeedback.value = `Cita de Test Drive #${scheduled.id.slice(0, 8)} confirmada exitosamente.`
    } else {
      bannerFeedback.value = crmStore.error || 'No se pudo agendar la cita de prueba de manejo.'
    }
  } finally {
    isTestDriveSubmitting.value = false
  }
}
</script>

<style scoped>
</style>
