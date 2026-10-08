<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-200 dark:border-surface-800 pb-6">
      <div class="space-y-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-surface-0">
          Mis Solicitudes
        </h1>
        <p class="text-sm text-surface-500">
          Historial y evaluación de créditos vehiculares enviados a entidades financieras aliadas.
        </p>
      </div>

      <!-- Quick Action: Nueva Pre-evaluación -->
      <div>
        <router-link
          to="/vehicles"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-primary-contrast font-semibold text-xs shadow-md transition-all hover:opacity-90"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>Nueva Pre-evaluación</span>
        </router-link>
      </div>
    </div>

    <!-- Search / Filter Bar -->
    <div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
          <i class="pi pi-search text-xs"></i>
        </span>
        <input
          v-model="searchFilter"
          type="text"
          placeholder="Buscar por vehículo, entidad o ID..."
          class="w-full pl-9 pr-4 py-2.5 bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl text-xs text-surface-900 dark:text-surface-0 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select
          v-model="statusFilter"
          class="px-3 py-2.5 bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl text-xs font-medium text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En Evaluación">En Evaluación</option>
          <option value="Pre-Aprobado">Pre-Aprobado</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Rechazado">Rechazado</option>
          <option value="Desembolsado">Desembolsado</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="financingStore.isLoading && !selectedApp" class="flex flex-col items-center justify-center py-16 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-surface-500 font-medium">Cargando solicitudes de financiamiento...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredApplications.length === 0"
      class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 p-12 text-center"
    >
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
        <i class="pi pi-file text-2xl"></i>
      </div>
      <h3 class="text-base font-bold text-surface-900 dark:text-surface-0">
        No tienes solicitudes registradas
      </h3>
      <p class="mt-1 text-xs text-surface-500 max-w-md">
        Aún no has enviado ninguna solicitud o simulación de crédito vehicular. Puedes comenzar seleccionando un vehículo en el catálogo.
      </p>
      <div class="mt-5">
        <router-link
          to="/vehicles"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary text-primary-contrast font-semibold text-xs shadow-md transition-all hover:opacity-90"
        >
          <i class="pi pi-car text-xs"></i>
          <span>Explorar Vehículos</span>
        </router-link>
      </div>
    </div>

    <!-- Applications Table from Backend API -->
    <div v-else class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 text-xs font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider">
              <th scope="col" class="py-4 px-6">Vehículo</th>
              <th scope="col" class="py-4 px-6">Entidad Financiera</th>
              <th scope="col" class="py-4 px-6">Monto Solicitado</th>
              <th scope="col" class="py-4 px-6">Fecha</th>
              <th scope="col" class="py-4 px-6 text-center">Estado de Crédito</th>
              <th scope="col" class="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-800 text-sm">
            <tr
              v-for="item in filteredApplications"
              :key="item.id"
              class="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <!-- Vehículo -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <i class="pi pi-car text-sm"></i>
                  </div>
                  <div>
                    <span class="font-bold text-surface-900 dark:text-surface-0 block leading-tight">{{ item.vehicle }}</span>
                    <span class="text-xs text-surface-400 font-mono">Ref: #{{ item.id.substring(0, 8) }}</span>
                  </div>
                </div>
              </td>

              <!-- Concesionaria / Entidad -->
              <td class="py-4 px-6 font-medium text-surface-700 dark:text-surface-300">
                <div class="flex items-center gap-1.5">
                  <i class="pi pi-building-columns text-xs text-surface-400"></i>
                  <span>{{ item.concessionaire }}</span>
                </div>
              </td>

              <!-- Monto -->
              <td class="py-4 px-6 text-xs font-semibold text-surface-900 dark:text-surface-0">
                {{ item.formattedAmount }}
              </td>

              <!-- Fecha -->
              <td class="py-4 px-6 text-xs text-surface-500 font-medium">
                {{ item.date }}
              </td>

              <!-- Estado de Crédito -->
              <td class="py-4 px-6 text-center">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide border',
                    getStatusBadgeClass(item.rawStatus)
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                  {{ item.status }}
                </span>
              </td>

              <!-- Acciones -->
              <td class="py-4 px-6 text-right">
                <Button
                  icon="pi pi-eye"
                  label="Detalle"
                  size="small"
                  outlined
                  severity="secondary"
                  class="!rounded-xl !text-xs"
                  @click="handleViewDetail(item.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer / Info bar -->
      <div class="px-6 py-3 bg-surface-50 dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between text-xs text-surface-500">
        <span>Mostrando {{ filteredApplications.length }} solicitudes registradas</span>
        <span>Sincronizado con backend en tiempo real</span>
      </div>
    </div>

    <!-- Application Detail & Status Update Dialog -->
    <Dialog
      v-model:visible="showDetailDialog"
      modal
      :header="`Solicitud de Crédito #${selectedApp?.id.substring(0, 8)}`"
      :style="{ width: '90vw', maxWidth: '650px' }"
      class="!rounded-3xl"
    >
      <div v-if="selectedApp" class="space-y-6 pt-2">
        <Message v-if="dialogSuccess" severity="success" class="!rounded-2xl" @close="dialogSuccess = null">
          {{ dialogSuccess }}
        </Message>
        <Message v-if="dialogError" severity="error" class="!rounded-2xl" @close="dialogError = null">
          {{ dialogError }}
        </Message>

        <!-- Summary Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-4 text-xs">
          <div>
            <span class="text-surface-500 font-medium block">Vehículo Solicitado</span>
            <span class="font-bold text-surface-900 dark:text-surface-0 text-sm">{{ selectedAppVehicle }}</span>
          </div>

          <div>
            <span class="text-surface-500 font-medium block">Entidad Financiera Aliada</span>
            <span class="font-bold text-surface-900 dark:text-surface-0 text-sm">{{ selectedAppEntity }}</span>
          </div>

          <div>
            <span class="text-surface-500 font-medium block">Monto Solicitado</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{{ selectedApp.formattedRequestedAmount }}</span>
          </div>

          <div>
            <span class="text-surface-500 font-medium block">Ingreso Mensual Declarado</span>
            <span class="font-semibold text-surface-800 dark:text-surface-200">{{ selectedApp.formattedMonthlyIncome }}</span>
          </div>

          <div>
            <span class="text-surface-500 font-medium block">Situación Laboral</span>
            <span class="font-semibold text-surface-800 dark:text-surface-200">{{ selectedApp.employmentStatus || 'No especificada' }}</span>
          </div>

          <div>
            <span class="text-surface-500 font-medium block">Estado Actual</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border mt-0.5" :class="getStatusBadgeClass(selectedApp.status)">
              {{ selectedApp.statusLabel }}
            </span>
          </div>
        </div>

        <!-- Notes if any -->
        <div v-if="selectedApp.notes" class="rounded-2xl bg-surface-100 dark:bg-surface-800/40 p-4 text-xs">
          <span class="font-bold text-surface-700 dark:text-surface-300 block mb-1">Notas del Solicitante:</span>
          <p class="text-surface-600 dark:text-surface-400">{{ selectedApp.notes }}</p>
        </div>

        <!-- Evaluation Panel for Financial Institution or Admin -->
        <div v-if="canEvaluate" class="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <i class="pi pi-check-circle"></i> Evaluación Bancaria de Crédito
            </span>
            <span class="text-[11px] text-surface-500 font-mono">PATCH /api/v1/credit-applications/{id}/status</span>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Nuevo Estado de Evaluación</label>
              <select
                v-model="evalStatus"
                class="w-full px-3 py-2 bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-xs font-semibold text-surface-900 dark:text-surface-0 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="PRE_APPROVED">PRE_APPROVED (Pre-Aprobado)</option>
                <option value="IN_REVIEW">IN_REVIEW (En Evaluación)</option>
                <option value="DISBURSED">DISBURSED (Desembolsado)</option>
                <option value="REJECTED">REJECTED (Rechazado)</option>
                <option value="PENDING">PENDING (Pendiente)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Dictamen / Observaciones Bancarias</label>
              <textarea
                v-model="evalNotes"
                rows="2"
                placeholder="Indique las condiciones de pre-aprobación o motivos de dictamen..."
                class="w-full p-2.5 bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-xs text-surface-900 dark:text-surface-0 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <div class="flex justify-end">
              <Button
                label="Confirmar Dictamen de Crédito"
                icon="pi pi-check"
                size="small"
                class="!rounded-xl !text-xs font-semibold"
                :loading="isUpdatingStatus"
                @click="handleUpdateStatus"
              />
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end pt-3 border-t border-surface-200 dark:border-surface-800">
          <Button
            label="Cerrar"
            severity="secondary"
            text
            class="!rounded-xl !text-xs"
            @click="showDetailDialog = false"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useFinancingStore } from '@/financing/application/financing.store'
import { usePartnersStore } from '@/partners/application/partners.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { useIamStore } from '@/iam/application/iam.store'
import type { CreditApplication } from '@/financing/domain/credit-application.entity'

const financingStore = useFinancingStore()
const partnersStore = usePartnersStore()
const catalogStore = useCatalogStore()
const iamStore = useIamStore()

const searchFilter = ref<string>('')
const statusFilter = ref<string>('')

const showDetailDialog = ref(false)
const selectedApp = ref<CreditApplication | null>(null)
const evalStatus = ref<'PENDING' | 'IN_REVIEW' | 'PRE_APPROVED' | 'REJECTED' | 'DISBURSED'>('PRE_APPROVED')
const evalNotes = ref('')
const isUpdatingStatus = ref(false)
const dialogSuccess = ref<string | null>(null)
const dialogError = ref<string | null>(null)

const canEvaluate = computed(() => {
  return iamStore.roles.includes('ROLE_FINANCIAL_INSTITUTION') ||
    iamStore.roles.includes('ROLE_ADMIN') ||
    iamStore.roles.includes('ROLE_FINANCIAL_ANALYST')
})

interface ApplicationRow {
  id: string
  vehicle: string
  concessionaire: string
  formattedAmount: string
  date: string
  status: string
  rawStatus: string
}

onMounted(async () => {
  await Promise.all([
    financingStore.fetchMyCreditApplications(),
    partnersStore.fetchFinancialEntities(),
    catalogStore.fetchVehicles()
  ])
})

const applications = computed<ApplicationRow[]>(() => {
  if (financingStore.creditApplications.length > 0) {
    return financingStore.creditApplications.map((app) => {
      const entity = partnersStore.financialEntities.find(e => e.id === app.financialEntityId)
      const vehicle = catalogStore.vehicles.find(v => v.id === app.vehicleId)
      const entityName = entity ? entity.name : (app.financialEntityName || 'Entidad Financiera Aliada')
      const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.manufactureYear})` : (app.vehicleTitle || 'Crédito Vehicular Solicitado')

      return {
        id: app.id,
        vehicle: vehicleName,
        concessionaire: entityName,
        formattedAmount: app.formattedRequestedAmount,
        date: app.formattedDate,
        status: app.statusLabel,
        rawStatus: app.status
      }
    })
  }

  return []
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

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'PRE_APPROVED':
    case 'Pre-Aprobado':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/50'
    case 'APPROVED':
    case 'DISBURSED':
    case 'Aprobado':
    case 'Desembolsado':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/50'
    case 'IN_REVIEW':
    case 'En Evaluación':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/50'
    case 'REJECTED':
    case 'Rechazado':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/50'
    default:
      return 'bg-surface-100 text-surface-700 border-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:border-surface-700'
  }
}

const selectedAppVehicle = computed(() => {
  if (!selectedApp.value) return 'Vehículo'
  const vehicle = catalogStore.vehicles.find(v => v.id === selectedApp.value?.vehicleId)
  return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.manufactureYear})` : (selectedApp.value.vehicleTitle || 'Crédito Vehicular')
})

const selectedAppEntity = computed(() => {
  if (!selectedApp.value) return 'Entidad'
  const entity = partnersStore.financialEntities.find(e => e.id === selectedApp.value?.financialEntityId)
  return entity ? entity.name : (selectedApp.value.financialEntityName || 'Entidad Financiera Aliada')
})

const handleViewDetail = async (id: string) => {
  dialogSuccess.value = null
  dialogError.value = null
  const app = financingStore.creditApplications.find(a => a.id === id)
  if (app) {
    selectedApp.value = app
  }
  showDetailDialog.value = true

  // Also fetch fresh detail by ID (5.8)
  await financingStore.fetchCreditApplicationById(id)
  if (financingStore.currentApplication) {
    selectedApp.value = financingStore.currentApplication
    if (['PENDING', 'IN_REVIEW', 'PRE_APPROVED', 'REJECTED', 'DISBURSED'].includes(selectedApp.value.status)) {
      evalStatus.value = selectedApp.value.status as any
    }
  }
}

const handleUpdateStatus = async () => {
  if (!selectedApp.value) return
  isUpdatingStatus.value = true
  dialogSuccess.value = null
  dialogError.value = null

  try {
    const success = await financingStore.updateCreditApplicationStatus(selectedApp.value.id, {
      status: evalStatus.value,
      notes: evalNotes.value
    })

    if (success) {
      dialogSuccess.value = `Estado actualizado a ${evalStatus.value} correctamente.`
      if (financingStore.currentApplication) {
        selectedApp.value = financingStore.currentApplication
      }
    } else {
      dialogError.value = financingStore.error || 'No se pudo actualizar el estado de la solicitud.'
    }
  } catch (err: any) {
    dialogError.value = err.message || 'Error al actualizar estado.'
  } finally {
    isUpdatingStatus.value = false
  }
}
</script>
