<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Back Link & Header matching Mockup Screenshot 3 -->
    <div class="space-y-4">
      <router-link
        to="/dealer/prospects"
        class="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors"
      >
        <i class="pi pi-arrow-left text-xs"></i>
        <span>{{ t('prospectDetail.backBtn') }}</span>
      </router-link>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-6">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950">
            {{ t('prospectDetail.title') }}: {{ prospectName }}
          </h1>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f7f4] text-[#00a887]">
            {{ prospectStatus }}
          </span>
        </div>
      </div>
    </div>

    <!-- Feedback Banner -->
    <div
      v-if="actionSuccessMessage"
      class="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-800 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-check-circle text-emerald-600"></i>
        <span>{{ actionSuccessMessage }}</span>
      </div>
      <button type="button" @click="actionSuccessMessage = null" class="text-emerald-500 hover:text-emerald-800">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <!-- 2 Columns Grid matching Mockup Screenshot 3 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column (approx 6 cols) -->
      <div class="lg:col-span-6 space-y-6">
        <!-- Card 1: Vehículo de Interés -->
        <div class="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 class="text-sm font-bold text-gray-900">{{ t('prospectDetail.vehicleCardTitle') }}</h2>
            <span class="text-xs text-blue-600 font-semibold cursor-pointer hover:underline" @click="goToVehicleDetail">
              {{ t('prospectDetail.viewVehicleSpecs') }}
            </span>
          </div>

          <div class="flex flex-col sm:flex-row gap-5 items-start">
            <div class="w-full sm:w-44 h-32 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                v-if="vehicle?.imagePath"
                :src="vehicle.imagePath"
                :alt="vehicle.displayName"
                class="w-full h-full object-cover"
              />
              <i v-else class="pi pi-car text-gray-400 text-3xl"></i>
            </div>

            <div class="space-y-1.5 flex-1">
              <div class="text-lg font-extrabold text-gray-950">
                {{ vehicle?.brand || 'Toyota' }} {{ vehicle?.model || 'Corolla Cross' }}
              </div>
              <div class="text-xs text-gray-400 font-medium">
                {{ t('publishVehicle.yearLabel') }} {{ vehicle?.manufactureYear || 2023 }} • {{ vehicle?.condition === 'NEW' ? t('dealerInventory.conditionNew') : t('dealerInventory.conditionUsed') }}
              </div>
              <div class="text-xl font-extrabold text-[#eb8f47] pt-1">
                ${{ (vehicle?.priceAmount || 26900).toLocaleString() }} USD
              </div>
            </div>
          </div>

          <!-- Specifications Grid matching Mockup -->
          <div class="grid grid-cols-2 gap-3 pt-2">
            <div class="p-3 bg-gray-50/70 rounded-2xl border border-gray-100">
              <span class="block text-[11px] text-gray-400 font-medium">{{ t('vehicleDetail.transmission') }}</span>
              <span class="text-xs font-bold text-gray-800">Automática CVT</span>
            </div>
            <div class="p-3 bg-gray-50/70 rounded-2xl border border-gray-100">
              <span class="block text-[11px] text-gray-400 font-medium">{{ t('vehicleCompare.attrFuel') }}</span>
              <span class="text-xs font-bold text-gray-800">2.0L Híbrido</span>
            </div>
            <div class="p-3 bg-gray-50/70 rounded-2xl border border-gray-100">
              <span class="block text-[11px] text-gray-400 font-medium">Tracción</span>
              <span class="text-xs font-bold text-gray-800">4x2 Delantera</span>
            </div>
            <div class="p-3 bg-gray-50/70 rounded-2xl border border-gray-100">
              <span class="block text-[11px] text-gray-400 font-medium">{{ t('vehicleDetail.mileage') }}</span>
              <span class="text-xs font-bold text-gray-800">0 km ({{ t('dealerInventory.conditionNew') }})</span>
            </div>
          </div>
        </div>

        <!-- Card 2: Perfil Financiero matching Mockup -->
        <div class="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 class="text-sm font-bold text-gray-900">{{ t('prospectDetail.applicantCardTitle') }}</h2>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
              {{ t('profiles.activeBenchmarksTitle') }}
            </span>
          </div>

          <div class="space-y-3.5 divide-y divide-gray-100 text-xs">
            <div class="flex items-center justify-between pt-1">
              <span class="text-gray-500">{{ t('prospectDetail.monthlyIncomeLabel') }}</span>
              <span class="font-extrabold text-gray-900">${{ (financialData.monthlyIncome).toLocaleString() }} USD</span>
            </div>
            <div class="flex items-center justify-between pt-3">
              <span class="text-gray-500">Antigüedad Laboral</span>
              <span class="font-semibold text-gray-800">{{ financialData.tenure }}</span>
            </div>
            <div class="flex items-center justify-between pt-3">
              <span class="text-gray-500">Banco Principal</span>
              <span class="font-semibold text-gray-800">{{ financialData.bankName }}</span>
            </div>
            <div class="flex items-center justify-between pt-3">
              <span class="text-gray-500">{{ t('prospectDetail.creditScoreLabel') }}</span>
              <div class="flex items-center gap-1.5">
                <span class="font-extrabold text-emerald-600">{{ financialData.creditScore }}</span>
                <span class="text-[11px] text-gray-400">({{ financialData.scoreCategory }})</span>
              </div>
            </div>
            <div class="flex items-center justify-between pt-3">
              <span class="text-gray-500">{{ t('prospectDetail.downPaymentLabel') }}</span>
              <span class="font-bold text-[#eb8f47]">{{ financialData.downPaymentPercent }}% (${{ financialData.downPaymentAmount.toLocaleString() }} USD)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Bitácora de Seguimiento matching Mockup (approx 6 cols) -->
      <div class="lg:col-span-6 space-y-6">
        <div class="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div class="border-b border-gray-100 pb-3">
            <h2 class="text-sm font-bold text-gray-900">Bitácora de Seguimiento</h2>
          </div>

          <!-- Timeline entries matching Mockup Screenshot 3 -->
          <div class="space-y-4">
            <div
              v-for="(log, idx) in activityLogs"
              :key="idx"
              class="relative pl-6 border-l-2 border-blue-100 space-y-1 pb-1"
            >
              <div class="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white"></div>
              <div class="text-[11px] font-bold text-gray-400">{{ log.time }}</div>
              <div class="text-xs text-gray-700 leading-relaxed">{{ log.content }}</div>
            </div>
          </div>

          <!-- Add Seller Notes Textarea matching Mockup -->
          <div class="space-y-2 pt-2">
            <label class="block text-xs font-bold text-gray-700">Añadir notas del vendedor</label>
            <textarea
              v-model="newNote"
              rows="3"
              placeholder="Escribe observaciones de la llamada o acuerdos con el cliente..."
              class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs resize-none"
            ></textarea>
            <div class="flex justify-end">
              <button
                type="button"
                @click="handleAddNote"
                :disabled="!newNote.trim()"
                class="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white font-bold text-xs transition-colors"
              >
                Agregar Nota
              </button>
            </div>
          </div>

          <!-- Action Buttons matching Mockup Screenshot 3 -->
          <div class="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              @click="handleScheduleTestDrive"
              class="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <i class="pi pi-calendar-plus text-xs"></i>
              <span>{{ t('prospectDetail.testDriveBtn') }}</span>
            </button>

            <button
              type="button"
              @click="handleMarkAsLost"
              class="w-full sm:w-auto py-3 px-5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Marcar como Perdido
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { useFinancingStore } from '@/financing/application/financing.store'
import { useCrmStore } from '@/financing/application/crm.store'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const catalogStore = useCatalogStore()
const financingStore = useFinancingStore()
const crmStore = useCrmStore()

const prospectName = ref('Carlos Mendoza')
const prospectStatus = ref('Pre-evaluado')
const actionSuccessMessage = ref<string | null>(null)
const newNote = ref('')

const financialData = reactive({
  monthlyIncome: 3500,
  tenure: '3 años (Indefinido)',
  bankName: 'BCP - Banco de Crédito',
  creditScore: 720,
  scoreCategory: 'Bueno',
  downPaymentPercent: 20,
  downPaymentAmount: 5380
})

const defaultLogs = [
  {
    time: 'Hoy, 10:30 AM',
    content: 'Contacto telefónico realizado por el asesor. Cliente interesado en agendar cita para ver el vehículo.'
  },
  {
    time: 'Ayer, 04:15 PM',
    content: 'Pre-evaluación completada con éxito. Capacidad de pago validada para crédito automotriz.'
  },
  {
    time: '18 Sep, 02:00 PM',
    content: 'Solicitud web recibida a través del portal SmartFinance Drive.'
  }
]

const activityLogs = computed(() => {
  if (crmStore.timelineNotes.length > 0) {
    return crmStore.timelineNotes.map(n => ({
      time: new Date(n.createdAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      content: n.content
    }))
  }
  return defaultLogs
})

onMounted(async () => {
  const paramId = String(route.params.id || '')
  await Promise.all([
    catalogStore.fetchVehicles(),
    financingStore.fetchSimulations(),
    paramId ? crmStore.fetchProspectById(paramId) : Promise.resolve(),
    paramId ? crmStore.fetchProspectTimeline(paramId) : Promise.resolve()
  ])

  if (crmStore.currentProspect) {
    prospectName.value = crmStore.currentProspect.fullName
    prospectStatus.value = crmStore.currentProspect.statusLabel
    financialData.monthlyIncome = crmStore.currentProspect.monthlyIncome || 3500
    financialData.downPaymentAmount = crmStore.currentProspect.downPayment || 5380
    return
  }

  // If a specific simulation ID was passed, customize prospect name and amounts
  if (paramId && paramId !== 'carlos-mendoza') {
    const simulation = financingStore.simulations.find(s => s.id === paramId)
    if (simulation) {
      prospectName.value = `Prospecto #${paramId.substring(0, 8)}`
      financialData.downPaymentAmount = simulation.downPaymentAmount
      financialData.monthlyIncome = Math.round(simulation.monthlyPaymentAmount * 3.5)
    }
  }
})

const vehicle = computed(() => {
  if (catalogStore.vehicles.length > 0) {
    return catalogStore.vehicles[0]
  }
  return null
})

const goToVehicleDetail = () => {
  if (vehicle.value?.id) {
    router.push(`/vehicles/${vehicle.value.id}`)
  }
}

const handleAddNote = async () => {
  const noteContent = newNote.value.trim()
  if (!noteContent) return

  const paramId = String(route.params.id || 'carlos-mendoza')
  await crmStore.addProspectNote(paramId, noteContent)

  newNote.value = ''
  actionSuccessMessage.value = 'Nota guardada exitosamente en la bitácora del prospecto.'
}

const handleScheduleTestDrive = async () => {
  const paramId = String(route.params.id || '')
  const vId = vehicle.value?.id || 'v-1'
  const targetDate = new Date(Date.now() + 86400000 * 2).toISOString()

  await crmStore.scheduleTestDrive({
    vehicleId: vId,
    dealershipId: 'dealership-1',
    scheduledDateTime: targetDate,
    notes: `Prueba de manejo para ${prospectName.value}`
  })

  actionSuccessMessage.value = '¡Test Drive agendado exitosamente! Se notificó al cliente por correo y SMS.'
}

const handleMarkAsLost = async () => {
  const paramId = String(route.params.id || '')
  if (paramId) {
    await crmStore.updateProspectStatus(paramId, 'LOST')
  }
  prospectStatus.value = 'Perdido'
  actionSuccessMessage.value = 'El prospecto fue archivado como perdido.'
}
</script>

<style scoped>
</style>
