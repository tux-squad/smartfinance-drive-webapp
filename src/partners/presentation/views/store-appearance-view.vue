<template>
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header matching Mockup Screenshot 5 -->
    <div class="border-b border-gray-100 pb-6 space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
        Apariencia de la Tienda
      </h1>
      <p class="text-sm text-gray-500">
        Personaliza cómo se ve tu concesionaria en SmartFinance Drive.
      </p>
    </div>

    <!-- Success Feedback Banner -->
    <div
      v-if="savedMessage"
      class="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-800 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-check-circle text-emerald-600 text-sm"></i>
        <span>{{ savedMessage }}</span>
      </div>
      <button type="button" @click="savedMessage = null" class="text-emerald-500 hover:text-emerald-800">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <!-- 2-Columns Settings Container matching Mockup Screenshot 5 -->
    <form @submit.prevent="handleSaveAppearance" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Identidad Visual (approx 5 cols) -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div class="border-b border-gray-100 pb-3">
            <h2 class="text-sm font-bold text-gray-900">Identidad Visual</h2>
            <p class="text-[11px] text-gray-400 mt-0.5">Elementos gráficos principales de tu concesionaria</p>
          </div>

          <!-- Logo de la Concesionaria -->
          <div class="space-y-3">
            <label class="block text-xs font-bold text-gray-800">Logo de la Concesionaria</label>
            <div class="flex items-center gap-4">
              <!-- Logo Box -->
              <div class="w-20 h-20 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                <img
                  v-if="logoPreview"
                  :src="logoPreview"
                  alt="Logo"
                  class="w-full h-full object-contain p-2"
                />
                <i v-else class="pi pi-building text-2xl text-gray-400"></i>
              </div>

              <!-- Upload Button -->
              <div class="space-y-1.5 flex-1">
                <input
                  ref="logoInputRef"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  class="hidden"
                  @change="handleLogoChange"
                />
                <button
                  type="button"
                  @click="triggerLogoUpload"
                  class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-2xs"
                >
                  <i class="pi pi-upload text-xs text-blue-600"></i>
                  <span>Subir Logo</span>
                </button>
                <p class="text-[10px] text-gray-400 leading-tight">
                  PNG o JPG transparente. Mínimo 200x200 px.
                </p>
              </div>
            </div>
          </div>

          <!-- Banner de Portada (1200 x 400) -->
          <div class="space-y-3 pt-2 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-gray-800">Banner de Portada</label>
              <span class="text-[10px] font-mono text-gray-400">1200 x 400 px</span>
            </div>

            <!-- Banner Box -->
            <div
              @click="triggerBannerUpload"
              class="w-full h-32 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50/60 hover:bg-blue-50/20 cursor-pointer transition-colors relative overflow-hidden flex flex-col items-center justify-center p-4 text-center"
            >
              <input
                ref="bannerInputRef"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                class="hidden"
                @change="handleBannerChange"
              />

              <template v-if="bannerPreview">
                <img :src="bannerPreview" alt="Banner de Portada" class="absolute inset-0 w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
                  Cambiar Banner
                </div>
              </template>

              <template v-else>
                <i class="pi pi-image text-gray-400 text-xl mb-1"></i>
                <span class="text-xs font-bold text-gray-800">Subir Banner</span>
                <span class="text-[10px] text-gray-400 mt-0.5">Recomendado 1200x400 px (JPG, PNG)</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Información del Establecimiento (approx 7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div class="border-b border-gray-100 pb-3">
            <h2 class="text-sm font-bold text-gray-900">Información del Establecimiento</h2>
            <p class="text-[11px] text-gray-400 mt-0.5">Datos visibles para compradores en el directorio y fichas de vehículos</p>
          </div>

          <div class="space-y-4">
            <!-- Nombre Público -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700">Nombre Público de la Concesionaria</label>
              <input
                v-model="storeData.name"
                type="text"
                required
                placeholder="Ej. AutoSur Motors SAC"
                class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
              />
            </div>

            <!-- Dirección Física -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700">Dirección Física</label>
              <input
                v-model="storeData.address"
                type="text"
                required
                placeholder="Av. Javier Prado Este 4520, Surco, Lima"
                class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
              />
            </div>

            <!-- Horarios de Atención -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700">Horarios de Atención</label>
              <input
                v-model="storeData.hours"
                type="text"
                required
                placeholder="Lunes a Sábado: 9:00 AM - 7:00 PM | Domingos: 10:00 AM - 2:00 PM"
                class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
              />
            </div>

            <!-- Descripción de la tienda -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700">Descripción de la tienda</label>
              <textarea
                v-model="storeData.description"
                rows="4"
                required
                placeholder="Escribe una breve presentación de los servicios y ventajas de tu concesionaria..."
                class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Submit Button matching Mockup Screenshot 5 -->
          <div class="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              :disabled="isSaving"
              class="px-6 py-3 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <i v-if="isSaving" class="pi pi-spin pi-spinner text-xs"></i>
              <span>Guardar Apariencia</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { usePartnersStore } from '@/partners/application/partners.store'

const partnersStore = usePartnersStore()

const logoInputRef = ref<HTMLInputElement | null>(null)
const bannerInputRef = ref<HTMLInputElement | null>(null)

const logoPreview = ref<string | null>(null)
const bannerPreview = ref<string | null>(null)

const isSaving = ref(false)
const savedMessage = ref<string | null>(null)

const storeData = reactive({
  name: 'AutoSur Motors SAC',
  address: 'Av. Javier Prado Este 4520, Surco, Lima',
  phone: '+51987654321',
  email: 'contacto@autosur.pe',
  hours: 'Lunes a Sábado: 9:00 AM - 7:00 PM | Domingos: 10:00 AM - 2:00 PM',
  description: 'Concesionaria oficial multimarca líder en vehículos nuevos y seminuevos garantizados. Brindamos asesoría en financiamiento directo con las mejores entidades bancarias del país.'
})

onMounted(async () => {
  const myDealership = await partnersStore.fetchMyDealership()
  if (myDealership) {
    storeData.name = myDealership.name || storeData.name
    storeData.address = myDealership.address || storeData.address
    storeData.phone = myDealership.phone || storeData.phone
    storeData.email = myDealership.email || storeData.email
    storeData.hours = myDealership.hours || storeData.hours
    storeData.description = myDealership.description || storeData.description
    if (myDealership.logoUrl) logoPreview.value = myDealership.logoUrl
    if (myDealership.bannerUrl) bannerPreview.value = myDealership.bannerUrl
  }
})

const triggerLogoUpload = () => {
  logoInputRef.value?.click()
}

const triggerBannerUpload = () => {
  bannerInputRef.value?.click()
}

const handleLogoChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    logoPreview.value = URL.createObjectURL(file)
    await partnersStore.uploadDealershipLogo(file)
  }
}

const handleBannerChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    bannerPreview.value = URL.createObjectURL(file)
    await partnersStore.uploadDealershipBanner(file)
  }
}

const handleSaveAppearance = async () => {
  isSaving.value = true
  savedMessage.value = null

  const success = await partnersStore.updateMyDealership({
    name: storeData.name,
    address: storeData.address,
    phone: storeData.phone,
    email: storeData.email,
    hours: storeData.hours,
    description: storeData.description
  })

  isSaving.value = false
  if (success) {
    savedMessage.value = '¡Configuración de apariencia guardada exitosamente! Los cambios ya son visibles en tu tienda pública.'
  } else {
    savedMessage.value = 'Cambios guardados localmente para la sesión actual.'
  }
}
</script>

<style scoped>
</style>
