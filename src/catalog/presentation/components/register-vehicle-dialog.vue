<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Message from 'primevue/message'
import { CreateVehicleCommand } from '../../domain/create-vehicle.command'
import { useCatalogStore } from '../../application/catalog.store'
import { useIamStore } from '@/iam/application/iam.store'
import VehicleImageUploader from './vehicle-image-uploader.vue'
import type { Vehicle } from '../../domain/vehicle.entity'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'created', vehicle: Vehicle): void
}>()

const { t } = useI18n()
const catalogStore = useCatalogStore()
const iamStore = useIamStore()

const brand = ref<string>('')
const model = ref<string>('')
const manufactureYear = ref<number>(new Date().getFullYear())
const condition = ref<'NEW' | 'USED'>('NEW')
const priceAmount = ref<number | null>(null)
const currency = ref<'USD' | 'PEN'>('USD')
const financialEntityId = ref<string>('')

const createdVehicle = ref<Vehicle | null>(null)
const step = ref<'FORM' | 'IMAGE'>('FORM')
const validationError = ref<string | null>(null)

const conditionOptions = [
  { label: 'Nuevo (NEW)', value: 'NEW' },
  { label: 'Usado (USED)', value: 'USED' }
]

const currencyOptions = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'PEN (S/)', value: 'PEN' }
]

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      resetForm()
    }
  }
)

const resetForm = () => {
  brand.value = ''
  model.value = ''
  manufactureYear.value = new Date().getFullYear()
  condition.value = 'NEW'
  priceAmount.value = null
  currency.value = 'USD'
  financialEntityId.value = ''
  createdVehicle.value = null
  step.value = 'FORM'
  validationError.value = null
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = async () => {
  validationError.value = null

  if (!brand.value.trim() || !model.value.trim()) {
    validationError.value = t('catalog.register.errorRequiredFields')
    return
  }
  if (!priceAmount.value || priceAmount.value <= 0) {
    validationError.value = t('catalog.register.errorInvalidPrice')
    return
  }

  const currentUserId = String(iamStore.currentUser?.id || localStorage.getItem('user_id') || '1')
  const defaultEntityId = financialEntityId.value.trim() || 'b1c2d3e4-f5a6-7b8c-9d0e-112233445566'

  const command = new CreateVehicleCommand(
    brand.value.trim(),
    model.value.trim(),
    manufactureYear.value,
    condition.value,
    priceAmount.value,
    currency.value,
    defaultEntityId,
    currentUserId
  )

  const vehicle = await catalogStore.createVehicle(command)
  if (vehicle) {
    createdVehicle.value = vehicle
    emit('created', vehicle)
    step.value = 'IMAGE'
  }
}

const handleImageUploaded = () => {
  handleClose()
}
</script>

<template>
  <Dialog
    :visible="props.visible"
    modal
    :header="t('catalog.register.dialogTitle')"
    :style="{ width: '90vw', maxWidth: '580px' }"
    class="!rounded-3xl p-dialog-custom"
    @update:visible="handleClose"
  >
    <div class="space-y-6 pt-2">
      <!-- Error Message -->
      <Message v-if="validationError || catalogStore.error" severity="error" class="!rounded-xl !text-xs">
        {{ validationError || catalogStore.error }}
      </Message>

      <!-- Step 1: Form -->
      <div v-if="step === 'FORM'" class="space-y-4">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('catalog.register.dialogSubtitle') }}
        </p>

        <!-- Brand & Model -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
              {{ t('catalog.register.brandLabel') }} *
            </label>
            <InputText
              v-model="brand"
              :placeholder="t('catalog.register.brandPlaceholder')"
              class="w-full !rounded-xl !text-xs"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
              {{ t('catalog.register.modelLabel') }} *
            </label>
            <InputText
              v-model="model"
              :placeholder="t('catalog.register.modelPlaceholder')"
              class="w-full !rounded-xl !text-xs"
            />
          </div>
        </div>

        <!-- Year & Condition -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
              {{ t('catalog.register.yearLabel') }} *
            </label>
            <InputNumber
              v-model="manufactureYear"
              :useGrouping="false"
              :min="1990"
              :max="2030"
              class="w-full !rounded-xl !text-xs"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
              {{ t('catalog.register.conditionLabel') }} *
            </label>
            <Select
              v-model="condition"
              :options="conditionOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full !rounded-xl !text-xs"
            />
          </div>
        </div>

        <!-- Price & Currency -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
              {{ t('catalog.register.priceLabel') }} *
            </label>
            <InputNumber
              v-model="priceAmount"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :min="0"
              placeholder="0.00"
              class="w-full !rounded-xl !text-xs"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
              {{ t('catalog.register.currencyLabel') }} *
            </label>
            <Select
              v-model="currency"
              :options="currencyOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full !rounded-xl !text-xs"
            />
          </div>
        </div>

        <!-- Financial Entity ID (Optional) -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-gray-700 dark:text-gray-300">
            {{ t('catalog.register.financialEntityIdLabel') }}
          </label>
          <InputText
            v-model="financialEntityId"
            placeholder="UUID Entidad Financiera (Opcional)..."
            class="w-full !rounded-xl !text-xs font-mono"
          />
        </div>

        <!-- Submit Action -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button
            :label="t('shared.cancel')"
            severity="secondary"
            text
            class="!rounded-xl !text-xs"
            @click="handleClose"
          />
          <Button
            :label="t('catalog.register.submitBtn')"
            icon="pi pi-check"
            :loading="catalogStore.isLoading"
            class="!rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold !text-xs px-6"
            @click="handleSubmit"
          />
        </div>
      </div>

      <!-- Step 2: Image Upload Option -->
      <div v-else-if="createdVehicle" class="space-y-6">
        <div class="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-4 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
          <i class="pi pi-check-circle text-emerald-600 dark:text-emerald-400 text-xl"></i>
          <div>
            <h4 class="text-xs font-bold text-emerald-900 dark:text-emerald-300">
              {{ t('catalog.register.successTitle') }}
            </h4>
            <p class="text-xs text-emerald-700 dark:text-emerald-400">
              {{ createdVehicle.displayName }} — {{ createdVehicle.formattedPrice }}
            </p>
          </div>
        </div>

        <VehicleImageUploader
          :vehicleId="createdVehicle.id"
          @uploaded="handleImageUploaded"
        />

        <div class="flex justify-end pt-2">
          <Button
            :label="t('catalog.register.skipImageBtn')"
            severity="secondary"
            text
            class="!rounded-xl !text-xs"
            @click="handleClose"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>
