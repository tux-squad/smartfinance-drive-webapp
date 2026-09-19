<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { UploadVehicleImageCommand } from '../../domain/upload-vehicle-image.command'
import { useCatalogStore } from '../../application/catalog.store'

const props = withDefaults(
  defineProps<{
    vehicleId: string
    isGallery?: boolean
  }>(),
  {
    isGallery: false
  }
)

const emit = defineEmits<{
  (e: 'uploaded'): void
}>()

const { t } = useI18n()
const catalogStore = useCatalogStore()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isDragging = ref<boolean>(false)
const localError = ref<string | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    setFile(target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    setFile(event.dataTransfer.files[0])
  }
}

const setFile = (file: File) => {
  localError.value = null
  if (!file.type.startsWith('image/')) {
    localError.value = t('catalog.imageUpload.invalidTypeError')
    return
  }
  // Max size 5MB
  if (file.size > 5 * 1024 * 1024) {
    localError.value = t('catalog.imageUpload.maxSizeError')
    return
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const clearSelection = () => {
  selectedFile.value = null
  previewUrl.value = null
  localError.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const handleUpload = async () => {
  if (!selectedFile.value || !props.vehicleId) return

  if (props.isGallery) {
    const success = await catalogStore.uploadGalleryImage(props.vehicleId, selectedFile.value)
    if (success) {
      clearSelection()
      emit('uploaded')
    }
  } else {
    const command = new UploadVehicleImageCommand(props.vehicleId, selectedFile.value)
    const success = await catalogStore.uploadVehicleImage(command)
    if (success) {
      clearSelection()
      emit('uploaded')
    }
  }
}
</script>

<template>
  <div class="space-y-4">
    <Message v-if="localError || catalogStore.error" severity="error" class="!rounded-xl !text-xs">
      {{ localError || catalogStore.error }}
    </Message>

    <!-- Hidden Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Dropzone when no file selected -->
    <div
      v-if="!selectedFile"
      class="border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3"
      :class="[
        isDragging
          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
          : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 bg-gray-50/50 dark:bg-gray-900/50'
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <div class="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
        <i class="pi pi-cloud-upload text-2xl"></i>
      </div>
      <div>
        <p class="text-xs font-bold text-gray-900 dark:text-white">
          {{ t('catalog.imageUpload.dropzoneTitle') }}
        </p>
        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
          {{ t('catalog.imageUpload.dropzoneSubtitle') }}
        </p>
      </div>
      <Button
        :label="t('catalog.imageUpload.selectFileBtn')"
        icon="pi pi-image"
        severity="secondary"
        size="small"
        class="!rounded-xl !text-xs"
        @click.stop="triggerFileInput"
      />
    </div>

    <!-- Preview when file is selected -->
    <div v-else class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-4">
      <div class="relative rounded-xl overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800 max-h-48 flex items-center justify-center">
        <img :src="previewUrl!" alt="Preview" class="w-full h-full object-cover" />
      </div>

      <div class="flex items-center justify-between text-xs">
        <div class="truncate max-w-[200px] text-gray-700 dark:text-gray-300 font-medium">
          {{ selectedFile.name }}
        </div>
        <div class="text-gray-400 font-mono">
          {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
        <Button
          :label="t('shared.cancel')"
          severity="secondary"
          text
          class="!rounded-xl !text-xs"
          @click="clearSelection"
        />
        <Button
          :label="t('catalog.imageUpload.uploadBtn')"
          icon="pi pi-upload"
          :loading="catalogStore.isLoading"
          class="!rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold !text-xs px-6"
          @click="handleUpload"
        />
      </div>
    </div>
  </div>
</template>
