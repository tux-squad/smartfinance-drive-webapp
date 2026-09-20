<template>
  <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header matching Mockup Screenshot 2 -->
    <div class="border-b border-gray-100 pb-6 space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
        {{ t('publishVehicle.title') }}
      </h1>
      <p class="text-sm text-gray-500">
        {{ t('publishVehicle.subtitle') }}
      </p>
    </div>

    <!-- Feedback Message -->
    <div
      v-if="errorMessage"
      class="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs text-red-700 flex items-center justify-between"
    >
      <span>{{ errorMessage }}</span>
      <button type="button" @click="errorMessage = null" class="text-red-400 hover:text-red-700">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <!-- 2-Column Form Card matching Mockup Screenshot 2 -->
    <div class="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-xs">
      <form @submit.prevent="handlePublish" class="space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column: Fotografías del Vehículo (approx 6 cols) -->
          <div class="lg:col-span-6 space-y-4">
            <h2 class="text-xs font-bold text-gray-800">{{ t('publishVehicle.photosSection') }}</h2>

            <!-- Image Upload Drop Zone -->
            <div
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
              class="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-3xl p-8 text-center cursor-pointer transition-colors bg-gray-50/40 hover:bg-blue-50/30 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden"
            >
              <input
                ref="fileInputRef"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                class="hidden"
                @change="handleFileChange"
              />

              <!-- Preview if file selected -->
              <template v-if="previewUrl">
                <img :src="previewUrl" alt="Preview" class="absolute inset-0 w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
                  {{ t('publishVehicle.changeImage') }}
                </div>
              </template>

              <!-- Upload Placeholder matching Mockup -->
              <template v-else>
                <div class="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-gray-200 flex items-center justify-center text-gray-500 mb-3">
                  <i class="pi pi-upload text-xl"></i>
                </div>
                <div class="text-xs font-bold text-gray-900">{{ t('publishVehicle.uploadImages') }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">{{ t('publishVehicle.uploadAction') }}</div>
                <div class="text-[10px] text-gray-400 mt-2 font-mono">{{ t('publishVehicle.uploadHint') }}</div>
              </template>
            </div>
          </div>

          <!-- Right Column: Especificaciones (approx 6 cols) -->
          <div class="lg:col-span-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Condición -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-700">{{ t('publishVehicle.conditionLabel') }}</label>
                <select
                  v-model="form.condition"
                  required
                  class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
                >
                  <option value="NEW">{{ t('dealerInventory.conditionNew') }}</option>
                  <option value="USED">{{ t('dealerInventory.conditionUsed') }}</option>
                </select>
              </div>

              <!-- Marca -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-700">{{ t('publishVehicle.brandLabel') }}</label>
                <select
                  v-model="form.brand"
                  required
                  class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
                >
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Kia">Kia</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Nissan">Nissan</option>
                </select>
              </div>

              <!-- Modelo -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-700">{{ t('publishVehicle.modelLabel') }}</label>
                <input
                  v-model="form.model"
                  type="text"
                  required
                  :placeholder="t('publishVehicle.modelPlaceholder')"
                  class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
                />
              </div>

              <!-- Año -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-700">{{ t('publishVehicle.yearLabel') }}</label>
                <input
                  v-model.number="form.manufactureYear"
                  type="number"
                  min="2010"
                  max="2027"
                  required
                  placeholder="2023"
                  class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
                />
              </div>

              <!-- Kilometraje -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-700">{{ t('publishVehicle.mileageLabel') }}</label>
                <input
                  v-model="form.mileage"
                  type="text"
                  placeholder="0 km"
                  class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
                />
              </div>

              <!-- Precio -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-700">{{ t('publishVehicle.priceLabel') }}</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-gray-400 font-bold">$</span>
                  <input
                    v-model.number="form.priceAmount"
                    type="number"
                    min="1000"
                    step="100"
                    required
                    placeholder="26900"
                    class="w-full pl-7 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            <!-- Form Action Buttons matching Mockup -->
            <div class="flex items-center justify-end gap-3 pt-6">
              <button
                type="button"
                @click="handleCancel"
                class="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {{ t('publishVehicle.cancelBtn') }}
              </button>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-6 py-2.5 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
              >
                <i v-if="isSubmitting" class="pi pi-spin pi-spinner text-xs"></i>
                <span>{{ isSubmitting ? t('publishVehicle.publishing') : t('publishVehicle.publishBtn') }}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { usePartnersStore } from '@/partners/application/partners.store'
import { useIamStore } from '@/iam/application/iam.store'
import { CreateVehicleCommand } from '@/catalog/domain/create-vehicle.command'
import { UploadVehicleImageCommand } from '@/catalog/domain/upload-vehicle-image.command'

const { t } = useI18n()

const router = useRouter()
const catalogStore = useCatalogStore()
const partnersStore = usePartnersStore()
const iamStore = useIamStore()

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

const form = reactive({
  condition: 'NEW',
  brand: 'Toyota',
  model: '',
  manufactureYear: 2023,
  mileage: '0 km',
  priceAmount: 26900
})

onMounted(async () => {
  await partnersStore.fetchFinancialEntities()
})

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleFileDrop = (e: DragEvent) => {
  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0]
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleCancel = () => {
  router.push('/dealer/inventory')
}

const handlePublish = async () => {
  if (!form.model.trim()) {
    errorMessage.value = 'Por favor ingresa el modelo del vehículo.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  try {
    const currentUserId = String(iamStore.currentUser?.id || localStorage.getItem('user_id') || '1')
    const entityId = partnersStore.financialEntities[0]?.id || 'b1c2d3e4-f5a6-7b8c-9d0e-112233445566'

    const command = new CreateVehicleCommand(
      form.brand,
      form.model,
      Number(form.manufactureYear),
      form.condition,
      Number(form.priceAmount),
      'USD',
      entityId,
      currentUserId
    )

    const created = await catalogStore.createVehicle(command)

    if (!created) {
      const serverErr = catalogStore.error || ''
      if (serverErr.includes('created_at') || serverErr.includes('DataIntegrityViolationException')) {
        errorMessage.value = 'Aviso de Integridad Backend (Render PostgreSQL): La petición POST /api/v1/vehicles fue transmitida con todos los campos requeridos (brand, condition, currency, financialEntityId, model, priceAmount, userId), pero el backend en Render rechazó la inserción debido a que su entidad JPA no tiene habilitado @EnableJpaAuditing para la columna "created_at" (NOT NULL).'
      } else {
        errorMessage.value = serverErr || 'Error al registrar el vehículo en el catálogo.'
      }
      return
    }

    if (selectedFile.value && created.id) {
      // Upload image to Cloudinary via real endpoint (3.7)
      const uploadCmd = new UploadVehicleImageCommand(created.id, selectedFile.value)
      await catalogStore.uploadVehicleImage(uploadCmd)
    }

    router.push('/dealer/inventory')
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Error al registrar el vehículo en el catálogo.'
    if (message.includes('created_at')) {
      errorMessage.value = 'Aviso de Integridad Backend (Render PostgreSQL): La inserción falló en el servidor por la restricción not-null en "created_at".'
    } else {
      errorMessage.value = message
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
</style>
