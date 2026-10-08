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

    <!-- Feedback Notification -->
    <div
      v-if="feedbackMessage"
      class="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-800 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-check-circle text-emerald-600"></i>
        <span>{{ feedbackMessage }}</span>
      </div>
      <button type="button" @click="feedbackMessage = null" class="text-emerald-500 hover:text-emerald-800">
        <i class="pi pi-times text-xs"></i>
      </button>
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
              <th scope="col" class="py-4 px-6 text-right">Acciones</th>
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

              <!-- Acciones (Editar 3.2 / Eliminar 3.4) -->
              <td class="py-4 px-6 text-right whitespace-nowrap space-x-2">
                <button
                  type="button"
                  @click="openEditDialog(car)"
                  class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                  title="Editar vehículo"
                >
                  <i class="pi pi-pencil text-xs"></i>
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  @click="openDeleteDialog(car)"
                  class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition-colors"
                  title="Eliminar vehículo"
                >
                  <i class="pi pi-trash text-xs"></i>
                  <span>Eliminar</span>
                </button>
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

    <!-- Modal Editar Vehículo (3.2 updateVehicle) -->
    <Dialog
      v-model:visible="isEditOpen"
      modal
      header="Editar Especificaciones de Vehículo"
      :style="{ width: '520px', maxWidth: '95vw' }"
      :dismissableMask="true"
    >
      <form @submit.prevent="handleSaveEdit" class="space-y-4 pt-2">
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Marca</label>
          <InputText v-model="editForm.brand" class="w-full text-xs" required />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Modelo</label>
          <InputText v-model="editForm.model" class="w-full text-xs" required />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Año</label>
            <InputNumber v-model="editForm.manufactureYear" class="w-full text-xs" :useGrouping="false" :min="1990" :max="2030" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Condición</label>
            <Select
              v-model="editForm.condition"
              :options="[{ label: 'Nuevo (0 km)', value: 'NEW' }, { label: 'Seminuevo', value: 'USED' }]"
              optionLabel="label"
              optionValue="value"
              class="w-full text-xs"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Precio</label>
            <InputNumber v-model="editForm.priceAmount" class="w-full text-xs" :min="0" mode="currency" currency="USD" locale="en-US" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Moneda</label>
            <Select
              v-model="editForm.currency"
              :options="[{ label: 'USD ($)', value: 'USD' }, { label: 'PEN (S/)', value: 'PEN' }]"
              optionLabel="label"
              optionValue="value"
              class="w-full text-xs"
            />
          </div>
        </div>
        <div v-if="partnersStore.financialEntities.length > 0">
          <label class="block text-xs font-bold text-gray-700 mb-1">Entidad Financiera Aliada (Obligatorio)</label>
          <Select
            v-model="editForm.financialEntityId"
            :options="partnersStore.financialEntities"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccionar banco o financiera"
            class="w-full text-xs"
            required
          />
        </div>
        <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <Button label="Cancelar" text severity="secondary" @click="isEditOpen = false" class="!text-xs" />
          <Button type="submit" label="Guardar Cambios" icon="pi pi-check" :loading="isSaving" class="!text-xs !bg-[#eb8f47] !border-[#eb8f47]" />
        </div>
      </form>
    </Dialog>

    <!-- Modal Confirmar Eliminación (3.4 deleteVehicle) -->
    <Dialog
      v-model:visible="isDeleteOpen"
      modal
      header="Confirmar Eliminación"
      :style="{ width: '440px', maxWidth: '95vw' }"
      :dismissableMask="true"
    >
      <div class="space-y-4 pt-2">
        <p class="text-xs text-gray-600 leading-relaxed">
          ¿Estás seguro de que deseas eliminar permanentemente el vehículo
          <strong class="text-gray-900">{{ vehicleToDelete?.brand }} {{ vehicleToDelete?.model }} ({{ vehicleToDelete?.manufactureYear }})</strong>
          del catálogo de tu concesionaria? Esta acción eliminará el anuncio de forma definitiva.
        </p>
        <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <Button label="Cancelar" text severity="secondary" @click="isDeleteOpen = false" class="!text-xs" />
          <Button label="Eliminar Definitivamente" icon="pi pi-trash" severity="danger" :loading="isDeleting" @click="handleConfirmDelete" class="!text-xs" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import type { Vehicle } from '@/catalog/domain/vehicle.entity'
import { useIamStore } from '@/iam/application/iam.store'
import { usePartnersStore } from '@/partners/application/partners.store'

const { t } = useI18n()

const catalogStore = useCatalogStore()
const iamStore = useIamStore()
const partnersStore = usePartnersStore()
const userSpecificVehicles = ref<Vehicle[]>([])
const isLoadingInventory = ref(true)
const feedbackMessage = ref<string | null>(null)

// Edit Dialog state
const isEditOpen = ref(false)
const isSaving = ref(false)
const vehicleToEdit = ref<Vehicle | null>(null)
const editForm = reactive({
  financialEntityId: '',
  brand: '',
  model: '',
  manufactureYear: 2024,
  condition: 'NEW',
  priceAmount: 0,
  currency: 'USD'
})

// Delete Dialog state
const isDeleteOpen = ref(false)
const isDeleting = ref(false)
const vehicleToDelete = ref<Vehicle | null>(null)

const loadInventory = async () => {
  isLoadingInventory.value = true
  try {
    const currentUserId = String(iamStore.currentUser?.id || localStorage.getItem('user_id') || '')
    const [list] = await Promise.all([
      catalogStore.fetchVehiclesByUserId(currentUserId),
      partnersStore.fetchFinancialEntities()
    ])
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
  if (userSpecificVehicles.value.length > 0) {
    return userSpecificVehicles.value
  }
  return catalogStore.vehicles || []
})

const getDaysPublished = (_index: number): string => {
  return '-'
}

const handleStatusChange = async (car: Vehicle, newStatus: string) => {
  const ok = await catalogStore.updateVehicleStatus(car.id, newStatus)
  if (ok) {
    feedbackMessage.value = `Estado de ${car.brand} ${car.model} actualizado a ${newStatus}.`
    await loadInventory()
  }
}

const openEditDialog = (car: Vehicle) => {
  vehicleToEdit.value = car
  editForm.financialEntityId = car.financialEntityId || partnersStore.financialEntities[0]?.id || 'b1c2d3e4-f5a6-7b8c-9d0e-112233445566'
  editForm.brand = car.brand
  editForm.model = car.model
  editForm.manufactureYear = car.manufactureYear
  editForm.condition = car.condition || 'NEW'
  editForm.priceAmount = car.priceAmount
  editForm.currency = car.currency || 'USD'
  isEditOpen.value = true
}

const handleSaveEdit = async () => {
  if (!vehicleToEdit.value) return
  isSaving.value = true
  try {
    const fallbackEntityId = vehicleToEdit.value.financialEntityId || partnersStore.financialEntities[0]?.id || 'b1c2d3e4-f5a6-7b8c-9d0e-112233445566'
    const updated = await catalogStore.updateVehicle(vehicleToEdit.value.id, {
      financialEntityId: editForm.financialEntityId || fallbackEntityId,
      brand: editForm.brand,
      model: editForm.model,
      manufactureYear: editForm.manufactureYear,
      condition: editForm.condition,
      priceAmount: editForm.priceAmount,
      currency: editForm.currency
    })
    if (updated) {
      feedbackMessage.value = `Vehículo ${updated.brand} ${updated.model} actualizado exitosamente.`
      isEditOpen.value = false
      await loadInventory()
    } else {
      feedbackMessage.value = catalogStore.error || 'No se pudo actualizar el vehículo.'
    }
  } finally {
    isSaving.value = false
  }
}

const openDeleteDialog = (car: Vehicle) => {
  vehicleToDelete.value = car
  isDeleteOpen.value = true
}

const handleConfirmDelete = async () => {
  if (!vehicleToDelete.value) return
  isDeleting.value = true
  try {
    const success = await catalogStore.deleteVehicle(vehicleToDelete.value.id)
    if (success) {
      feedbackMessage.value = `Vehículo ${vehicleToDelete.value.brand} ${vehicleToDelete.value.model} eliminado del catálogo.`
      isDeleteOpen.value = false
      await loadInventory()
    } else {
      feedbackMessage.value = catalogStore.error || 'No se pudo eliminar el vehículo.'
    }
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
</style>
