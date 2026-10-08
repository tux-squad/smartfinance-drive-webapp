<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Message from 'primevue/message'
import type { FinancialEntity } from '../../domain/financial-entity.entity'
import { usePartnersStore } from '../../application/partners.store'
import { useIamStore } from '../../../iam/application/iam.store'

const props = defineProps<{
  visible: boolean
  entity: FinancialEntity | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const router = useRouter()
const { t } = useI18n()
const partnersStore = usePartnersStore()
const iamStore = useIamStore()

const showDialog = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const benchmarks = computed(() => props.entity?.rateBenchmarks || [])

const canManage = computed(() => {
  return iamStore.roles.includes('ROLE_ADMIN') || iamStore.roles.includes('ROLE_FINANCIAL_INSTITUTION')
})

const showBenchmarkForm = ref(false)
const isSubmittingBenchmark = ref(false)
const actionError = ref<string | null>(null)
const actionSuccess = ref<string | null>(null)

// Form fields for benchmark
const benchmarkForm = ref({
  rateType: 'EFFECTIVE_ANNUAL',
  annualRate: 11.5,
  currency: 'PEN',
  sourceLabel: '',
  sourceUrl: '',
  effectiveFrom: new Date().toISOString().split('T')[0]
})

const rateTypeOptions = [
  { label: 'Tasa Efectiva Anual (TEA)', value: 'EFFECTIVE_ANNUAL' },
  { label: 'Costo Efectivo Anual (TCEA)', value: 'COST_EFFECTIVE_ANNUAL' },
  { label: 'Tasa Nominal Anual (TNA)', value: 'NOMINAL_ANNUAL' }
]

const currencyOptions = [
  { label: 'PEN (Soles)', value: 'PEN' },
  { label: 'USD (Dólares)', value: 'USD' }
]

const logoFileInput = ref<HTMLInputElement | null>(null)
const bannerFileInput = ref<HTMLInputElement | null>(null)
const isUploadingMedia = ref(false)

const triggerLogoUpload = () => {
  logoFileInput.value?.click()
}

const triggerBannerUpload = () => {
  bannerFileInput.value?.click()
}

const handleLogoSelected = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !props.entity) return

  isUploadingMedia.value = true
  actionError.value = null
  actionSuccess.value = null

  try {
    const updated = await partnersStore.uploadFinancialEntityLogo(props.entity.id, file)
    if (updated) {
      actionSuccess.value = 'Logotipo actualizado correctamente.'
    } else {
      actionError.value = partnersStore.error || 'No se pudo subir el logotipo.'
    }
  } catch (err: any) {
    actionError.value = err.message || 'Error al procesar el archivo.'
  } finally {
    isUploadingMedia.value = false
    if (target) target.value = ''
  }
}

const handleBannerSelected = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !props.entity) return

  isUploadingMedia.value = true
  actionError.value = null
  actionSuccess.value = null

  try {
    const updated = await partnersStore.uploadFinancialEntityBanner(props.entity.id, file)
    if (updated) {
      actionSuccess.value = 'Banner actualizado correctamente.'
    } else {
      actionError.value = partnersStore.error || 'No se pudo subir el banner.'
    }
  } catch (err: any) {
    actionError.value = err.message || 'Error al procesar el archivo.'
  } finally {
    isUploadingMedia.value = false
    if (target) target.value = ''
  }
}

const handleSaveBenchmark = async () => {
  if (!props.entity) return
  if (benchmarkForm.value.annualRate < 0 || benchmarkForm.value.annualRate > 100) {
    actionError.value = 'La tasa debe estar entre 0% y 100%.'
    return
  }

  isSubmittingBenchmark.value = true
  actionError.value = null
  actionSuccess.value = null

  try {
    const updated = await partnersStore.addBenchmarkToEntity(props.entity.id, {
      rateType: benchmarkForm.value.rateType,
      annualRate: benchmarkForm.value.annualRate,
      currency: benchmarkForm.value.currency,
      sourceLabel: benchmarkForm.value.sourceLabel || undefined,
      sourceUrl: benchmarkForm.value.sourceUrl || undefined,
      effectiveFrom: benchmarkForm.value.effectiveFrom || undefined
    })

    if (updated) {
      actionSuccess.value = 'Nueva tasa benchmark registrada exitosamente.'
      showBenchmarkForm.value = false
      benchmarkForm.value.sourceLabel = ''
      benchmarkForm.value.sourceUrl = ''
    } else {
      actionError.value = partnersStore.error || 'Error al registrar el benchmark.'
    }
  } catch (err: any) {
    actionError.value = err.message || 'Error al publicar benchmark.'
  } finally {
    isSubmittingBenchmark.value = false
  }
}

const goToSimulation = () => {
  if (props.entity) {
    showDialog.value = false
    router.push({ name: 'simulations', query: { financialEntityId: props.entity.id } })
  }
}
</script>

<template>
  <Dialog
    v-model:visible="showDialog"
    modal
    :header="entity?.name || t('partners.dialogHeaderFallback')"
    :style="{ width: '90vw', maxWidth: '750px' }"
    class="!rounded-3xl"
  >
    <div class="space-y-6 pt-2">
      <!-- Hidden file inputs -->
      <input
        ref="logoFileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="hidden"
        @change="handleLogoSelected"
      />
      <input
        ref="bannerFileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="hidden"
        @change="handleBannerSelected"
      />

      <!-- Notification Alerts -->
      <Message v-if="actionSuccess" severity="success" :closable="true" class="!rounded-2xl" @close="actionSuccess = null">
        {{ actionSuccess }}
      </Message>
      <Message v-if="actionError" severity="error" :closable="true" class="!rounded-2xl" @close="actionError = null">
        {{ actionError }}
      </Message>

      <!-- Entity Banner / Info Header -->
      <div class="relative overflow-hidden rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-5">
        <div v-if="entity?.bannerUrl" class="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center" :style="{ backgroundImage: `url(${entity.bannerUrl})` }"></div>
        <div class="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden">
              <img v-if="entity?.logoUrl" :src="entity.logoUrl" :alt="entity.name" class="h-full w-full object-contain p-1" />
              <i v-else class="pi pi-building-columns text-2xl text-primary"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-surface-900 dark:text-surface-0">{{ entity?.name }}</h3>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs font-semibold text-surface-500">{{ t('partners.entityRucLabel') }}:</span>
                <span class="text-xs font-mono font-bold text-surface-700 dark:text-surface-300">{{ entity?.ruc || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <!-- Institutional upload actions -->
          <div v-if="canManage" class="flex items-center gap-2">
            <Button
              icon="pi pi-image"
              label="Logo"
              size="small"
              outlined
              severity="secondary"
              class="!rounded-xl !text-xs"
              :loading="isUploadingMedia"
              @click="triggerLogoUpload"
            />
            <Button
              icon="pi pi-camera"
              label="Banner"
              size="small"
              outlined
              severity="secondary"
              class="!rounded-xl !text-xs"
              :loading="isUploadingMedia"
              @click="triggerBannerUpload"
            />
            <Button
              icon="pi pi-plus"
              :label="showBenchmarkForm ? 'Cancelar' : 'Nueva Tasa'"
              size="small"
              :severity="showBenchmarkForm ? 'secondary' : 'primary'"
              class="!rounded-xl !text-xs"
              @click="showBenchmarkForm = !showBenchmarkForm"
            />
          </div>
        </div>
      </div>

      <!-- Add Benchmark Form Panel -->
      <div v-if="showBenchmarkForm && canManage" class="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <i class="pi pi-percentage"></i> Publicar Nueva Tasa Benchmark
          </span>
          <span class="text-xs text-surface-500">POST /api/v1/financial-entities/{id}/rate-benchmarks</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Tipo de Tasa</label>
            <Select
              v-model="benchmarkForm.rateType"
              :options="rateTypeOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full !rounded-xl !text-xs"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Tasa Anual (%)</label>
            <InputNumber
              v-model="benchmarkForm.annualRate"
              :min="0"
              :max="100"
              :minFractionDigits="2"
              :maxFractionDigits="4"
              suffix="%"
              class="w-full !rounded-xl !text-xs"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Moneda</label>
            <Select
              v-model="benchmarkForm.currency"
              :options="currencyOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full !rounded-xl !text-xs"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Etiqueta / Campaña</label>
            <InputText
              v-model="benchmarkForm.sourceLabel"
              placeholder="Ej: Campaña Crédito Vehicular 2026"
              class="w-full !rounded-xl !text-xs"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">URL Oficial de Fuente</label>
            <InputText
              v-model="benchmarkForm.sourceUrl"
              placeholder="https://..."
              class="w-full !rounded-xl !text-xs"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Vigencia Desde</label>
            <InputText
              v-model="benchmarkForm.effectiveFrom"
              type="date"
              class="w-full !rounded-xl !text-xs"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <Button
            label="Descartar"
            severity="secondary"
            text
            size="small"
            class="!rounded-xl !text-xs"
            @click="showBenchmarkForm = false"
          />
          <Button
            label="Guardar Benchmark"
            icon="pi pi-check"
            size="small"
            class="!rounded-xl !text-xs"
            :loading="isSubmittingBenchmark"
            @click="handleSaveBenchmark"
          />
        </div>
      </div>

      <!-- Empty Benchmarks Notice -->
      <div v-if="benchmarks.length === 0" class="py-8 text-center text-sm text-surface-500">
        {{ t('partners.noBenchmarksText') }}
      </div>

      <!-- Benchmarks Data Table -->
      <DataTable
        v-else
        :value="benchmarks"
        stripedRows
        responsiveLayout="scroll"
        class="!text-sm"
      >
        <Column field="loanTermMonths" :header="t('partners.tableColTerm')">
          <template #body="{ data }">
            <span class="font-bold text-surface-900 dark:text-surface-0">
              {{ data.loanTermMonths ? `${data.loanTermMonths} ${t('partners.monthsLabel')}` : 'General / Anual' }}
            </span>
          </template>
        </Column>

        <Column field="annualEffectiveRate" :header="t('partners.tableColTea')">
          <template #body="{ data }">
            <span class="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {{ data.formattedTea }}
            </span>
          </template>
        </Column>

        <Column field="currency" header="Moneda">
          <template #body="{ data }">
            <span class="text-xs font-mono text-surface-600 dark:text-surface-400">
              {{ data.currency || 'PEN' }}
            </span>
          </template>
        </Column>

        <Column field="sourceLabel" header="Fuente / Referencia">
          <template #body="{ data }">
            <div class="text-xs text-surface-700 dark:text-surface-300">
              <a v-if="data.sourceUrl" :href="data.sourceUrl" target="_blank" class="text-primary hover:underline flex items-center gap-1">
                {{ data.sourceLabel || 'Enlace oficial' }}
                <i class="pi pi-external-link text-[10px]"></i>
              </a>
              <span v-else>{{ data.sourceLabel || 'Tarifario Oficial SBS' }}</span>
            </div>
          </template>
        </Column>

        <Column field="monthlyCreditLifeInsuranceRate" :header="t('partners.tableColInsurance')">
          <template #body="{ data }">
            <span class="text-xs font-mono text-surface-600 dark:text-surface-400">
              {{ data.formattedInsuranceRate }}
            </span>
          </template>
        </Column>
      </DataTable>

      <!-- Modal Footer CTA -->
      <div class="flex justify-end gap-2 pt-4 border-t border-surface-200 dark:border-surface-800">
        <Button
          :label="t('partners.closeDialogBtn')"
          severity="secondary"
          text
          class="!rounded-xl !text-xs"
          @click="showDialog = false"
        />
        <Button
          :label="t('partners.simulateWithEntityBtn')"
          icon="pi pi-calculator"
          class="!rounded-xl !text-xs font-semibold shadow-md"
          @click="goToSimulation"
        />
      </div>
    </div>
  </Dialog>
</template>
