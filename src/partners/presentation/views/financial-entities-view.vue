<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { usePartnersStore } from '../../application/partners.store'
import { useIamStore } from '../../../iam/application/iam.store'
import type { FinancialEntity } from '../../domain/financial-entity.entity'
import SunatRucSearch from '../components/sunat-ruc-search.vue'
import FinancialEntityCard from '../components/financial-entity-card.vue'
import RateBenchmarksDialog from '../components/rate-benchmarks-dialog.vue'

const { t } = useI18n()
const partnersStore = usePartnersStore()
const iamStore = useIamStore()

const showBenchmarksModal = ref<boolean>(false)
const selectedEntity = ref<FinancialEntity | null>(null)
const feedbackMessage = ref<string | null>(null)

// 4.1 Create Entity state
const isCreateOpen = ref(false)
const isCreating = ref(false)
const createForm = reactive({
  name: '',
  ruc: '',
  logoUrl: '',
  bannerUrl: ''
})

// 4.3 Update Entity state
const isEditOpen = ref(false)
const isUpdating = ref(false)
const entityToEdit = ref<FinancialEntity | null>(null)
const editForm = reactive({
  name: '',
  ruc: '',
  logoUrl: '',
  bannerUrl: ''
})

// 6.4 Delete Entity state
const isDeleteOpen = ref(false)
const isDeleting = ref(false)
const entityToDelete = ref<FinancialEntity | null>(null)

const isBankUser = computed(() => {
  return iamStore.roles.includes('ROLE_FINANCIAL_INSTITUTION') || iamStore.roles.includes('ROLE_ADMIN')
})

onMounted(async () => {
  partnersStore.fetchFinancialEntities()
  if (isBankUser.value) {
    await partnersStore.fetchMyFinancialEntity()
  }
})

const handleOpenBenchmarks = (entity: FinancialEntity) => {
  selectedEntity.value = entity
  showBenchmarksModal.value = true
}

const handleManageMyEntity = () => {
  if (partnersStore.myFinancialEntity) {
    selectedEntity.value = partnersStore.myFinancialEntity
    showBenchmarksModal.value = true
  }
}

// Create handlers
const openCreateModal = () => {
  createForm.name = ''
  createForm.ruc = ''
  createForm.logoUrl = ''
  createForm.bannerUrl = ''
  isCreateOpen.value = true
}

const handleCreateEntity = async () => {
  isCreating.value = true
  try {
    const created = await partnersStore.createFinancialEntity({
      name: createForm.name,
      ruc: createForm.ruc,
      logoUrl: createForm.logoUrl || undefined,
      bannerUrl: createForm.bannerUrl || undefined
    })
    if (created) {
      feedbackMessage.value = `Entidad financiera "${created.name}" creada exitosamente.`
      isCreateOpen.value = false
      await partnersStore.fetchFinancialEntities()
    } else {
      feedbackMessage.value = partnersStore.error || 'Error al registrar la entidad financiera.'
    }
  } finally {
    isCreating.value = false
  }
}

// Edit handlers
const handleEditEntity = (entity: FinancialEntity) => {
  entityToEdit.value = entity
  editForm.name = entity.name
  editForm.ruc = entity.ruc || ''
  editForm.logoUrl = entity.logoUrl || ''
  editForm.bannerUrl = entity.bannerUrl || ''
  isEditOpen.value = true
}

const handleSaveEditEntity = async () => {
  if (!entityToEdit.value) return
  isUpdating.value = true
  try {
    const updated = await partnersStore.updateFinancialEntity(entityToEdit.value.id, {
      name: editForm.name,
      ruc: editForm.ruc,
      logoUrl: editForm.logoUrl || undefined,
      bannerUrl: editForm.bannerUrl || undefined
    })
    if (updated) {
      feedbackMessage.value = `Entidad financiera "${updated.name}" actualizada con éxito.`
      isEditOpen.value = false
      await partnersStore.fetchFinancialEntities()
    } else {
      feedbackMessage.value = partnersStore.error || 'Error al actualizar la entidad financiera.'
    }
  } finally {
    isUpdating.value = false
  }
}

// Delete handlers
const handleDeleteEntity = (entity: FinancialEntity) => {
  entityToDelete.value = entity
  isDeleteOpen.value = true
}

const handleConfirmDeleteEntity = async () => {
  if (!entityToDelete.value) return
  isDeleting.value = true
  try {
    const success = await partnersStore.deleteFinancialEntity(entityToDelete.value.id)
    if (success) {
      feedbackMessage.value = `Entidad "${entityToDelete.value.name}" eliminada del sistema.`
      isDeleteOpen.value = false
      await partnersStore.fetchFinancialEntities()
    } else {
      feedbackMessage.value = partnersStore.error || 'Error al eliminar la entidad financiera.'
    }
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md mb-3 border border-blue-500/30">
          <i class="pi pi-building-columns"></i>
          {{ t('partners.headerBadge') }}
        </div>
        <h1 class="text-3xl font-black tracking-tight sm:text-4xl text-white">
          {{ t('partners.headerTitle') }}
        </h1>
        <p class="mt-2 text-sm text-blue-100/80 leading-relaxed">
          {{ t('partners.headerSubtitle') }}
        </p>
      </div>
    </div>

    <!-- Feedback Notification -->
    <div
      v-if="feedbackMessage"
      class="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-800 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-check-circle text-emerald-600 text-sm"></i>
        <span>{{ feedbackMessage }}</span>
      </div>
      <button type="button" @click="feedbackMessage = null" class="text-emerald-500 hover:text-emerald-800">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <!-- Institutional Bank Section (For ROLE_FINANCIAL_INSTITUTION) -->
    <div
      v-if="isBankUser && partnersStore.myFinancialEntity"
      class="rounded-3xl border border-primary/30 bg-surface-0 dark:bg-surface-900 p-6 shadow-md relative overflow-hidden"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 overflow-hidden">
            <img
              v-if="partnersStore.myFinancialEntity.logoUrl"
              :src="partnersStore.myFinancialEntity.logoUrl"
              :alt="partnersStore.myFinancialEntity.name"
              class="h-full w-full object-contain p-1"
            />
            <i v-else class="pi pi-building-columns text-3xl text-primary"></i>
          </div>
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/15 text-primary mb-1">
              <i class="pi pi-verified"></i> Mi Entidad Financiera Asociada
            </div>
            <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0">
              {{ partnersStore.myFinancialEntity.name }}
            </h2>
            <p class="text-xs text-surface-500">
              RUC: <span class="font-mono font-semibold">{{ partnersStore.myFinancialEntity.ruc || 'No registrado' }}</span> •
              {{ partnersStore.myFinancialEntity.rateBenchmarks.length }} tasas publicadas
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Button
            label="Gestionar Tasas y Multimedia"
            icon="pi pi-cog"
            class="!rounded-2xl !text-xs font-semibold"
            @click="handleManageMyEntity"
          />
        </div>
      </div>
    </div>

    <!-- Widget 1: SUNAT RUC Verification -->
    <SunatRucSearch />

    <!-- Widget 2: Financial Institutions Directory -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="pi pi-building text-emerald-600"></i>
            {{ t('partners.directoryTitle') }}
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('partners.directorySubtitle') }}
          </p>
        </div>

        <!-- 4.1 Create Financial Entity Action Button -->
        <div>
          <Button
            label="+ Registrar Entidad"
            icon="pi pi-plus"
            class="!rounded-xl !text-xs font-bold !bg-emerald-600 !border-emerald-600 hover:!bg-emerald-700"
            @click="openCreateModal"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="partnersStore.isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
        <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
        <p class="text-sm text-gray-500 font-medium">{{ t('partners.loadingText') }}</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!partnersStore.hasEntities"
        class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center"
      >
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4">
          <i class="pi pi-building text-2xl"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ t('partners.emptyTitle') }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
          {{ t('partners.emptySubtitle') }}
        </p>
      </div>

      <!-- Financial Entities Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FinancialEntityCard
          v-for="entity in partnersStore.financialEntities"
          :key="entity.id"
          :entity="entity"
          @open-benchmarks="handleOpenBenchmarks"
          @edit-entity="handleEditEntity"
          @delete-entity="handleDeleteEntity"
        />
      </div>
    </div>

    <!-- Rate Benchmarks Modal -->
    <RateBenchmarksDialog
      v-model:visible="showBenchmarksModal"
      :entity="selectedEntity"
    />

    <!-- Modal Registrar Entidad Financiera (4.1 createFinancialEntity) -->
    <Dialog
      v-model:visible="isCreateOpen"
      modal
      header="Registrar Entidad Financiera"
      :style="{ width: '500px', maxWidth: '95vw' }"
      :dismissableMask="true"
    >
      <form @submit.prevent="handleCreateEntity" class="space-y-4 pt-2">
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Nombre Comercial de la Entidad</label>
          <InputText v-model="createForm.name" class="w-full text-xs" placeholder="Ej. BBVA Perú / Interbank" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Número de RUC (11 dígitos)</label>
          <InputText v-model="createForm.ruc" class="w-full text-xs" placeholder="20100047218" maxlength="11" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">URL del Logotipo (Opcional)</label>
          <InputText v-model="createForm.logoUrl" class="w-full text-xs" placeholder="https://..." />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">URL del Banner Promocional (Opcional)</label>
          <InputText v-model="createForm.bannerUrl" class="w-full text-xs" placeholder="https://..." />
        </div>

        <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <Button label="Cancelar" text severity="secondary" @click="isCreateOpen = false" class="!text-xs" />
          <Button
            type="submit"
            label="Registrar Entidad"
            icon="pi pi-check"
            :loading="isCreating"
            class="!text-xs !bg-emerald-600 !border-emerald-600"
          />
        </div>
      </form>
    </Dialog>

    <!-- Modal Editar Entidad Financiera (4.3 updateFinancialEntity) -->
    <Dialog
      v-model:visible="isEditOpen"
      modal
      header="Editar Entidad Financiera"
      :style="{ width: '500px', maxWidth: '95vw' }"
      :dismissableMask="true"
    >
      <form @submit.prevent="handleSaveEditEntity" class="space-y-4 pt-2">
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Nombre Comercial de la Entidad</label>
          <InputText v-model="editForm.name" class="w-full text-xs" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Número de RUC</label>
          <InputText v-model="editForm.ruc" class="w-full text-xs" maxlength="11" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">URL del Logotipo</label>
          <InputText v-model="editForm.logoUrl" class="w-full text-xs" />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">URL del Banner Promocional</label>
          <InputText v-model="editForm.bannerUrl" class="w-full text-xs" />
        </div>

        <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <Button label="Cancelar" text severity="secondary" @click="isEditOpen = false" class="!text-xs" />
          <Button
            type="submit"
            label="Guardar Cambios"
            icon="pi pi-check"
            :loading="isUpdating"
            class="!text-xs !bg-emerald-600 !border-emerald-600"
          />
        </div>
      </form>
    </Dialog>

    <!-- Modal Confirmar Eliminación (6.4 deleteFinancialEntity) -->
    <Dialog
      v-model:visible="isDeleteOpen"
      modal
      header="Confirmar Eliminación de Entidad"
      :style="{ width: '420px', maxWidth: '95vw' }"
      :dismissableMask="true"
    >
      <div class="space-y-4 pt-2">
        <p class="text-xs text-gray-600 leading-relaxed">
          ¿Estás seguro de que deseas eliminar permanentemente a
          <strong class="text-gray-900">{{ entityToDelete?.name }}</strong> del directorio de entidades financieras asociadas?
        </p>
        <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <Button label="Cancelar" text severity="secondary" @click="isDeleteOpen = false" class="!text-xs" />
          <Button
            label="Eliminar Definitivamente"
            icon="pi pi-trash"
            severity="danger"
            :loading="isDeleting"
            @click="handleConfirmDeleteEntity"
            class="!text-xs"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>
