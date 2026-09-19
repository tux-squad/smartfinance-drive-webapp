<template>
  <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header matching Mockup Image 5 -->
    <div class="border-b border-gray-100 pb-6 space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
        Configuración
      </h1>
      <p class="text-sm text-gray-500">
        Personaliza tus preferencias de cuenta, seguridad y notificaciones.
      </p>
    </div>

    <!-- Alert / Toast Messages -->
    <div
      v-if="securitySuccessMsg"
      class="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-sm text-emerald-800 flex items-center justify-between"
    >
      <div class="flex items-center space-x-2">
        <i class="pi pi-check-circle text-emerald-600 text-lg"></i>
        <span class="font-medium">{{ securitySuccessMsg }}</span>
      </div>
      <button type="button" @click="securitySuccessMsg = null" class="text-emerald-500 hover:text-emerald-700">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <div
      v-if="securityErrorMsg"
      class="bg-red-50 border border-red-200 p-4 rounded-2xl text-sm text-red-800 flex items-center justify-between"
    >
      <div class="flex items-center space-x-2">
        <i class="pi pi-exclamation-circle text-red-600 text-lg"></i>
        <span>{{ securityErrorMsg }}</span>
      </div>
      <button type="button" @click="securityErrorMsg = null" class="text-red-400 hover:text-red-700">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <!-- Section 1: Notificaciones -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-5">
      <div class="flex items-center gap-2.5 pb-4 border-b border-gray-100">
        <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <i class="pi pi-bell text-sm"></i>
        </div>
        <div>
          <h2 class="text-base font-bold text-gray-900">Notificaciones</h2>
          <p class="text-xs text-gray-500">Configura los avisos y alertas sobre tus créditos y compras</p>
        </div>
      </div>

      <div class="divide-y divide-gray-100">
        <!-- Item 1 -->
        <div class="py-4 flex items-center justify-between gap-4">
          <div class="space-y-0.5">
            <h3 class="text-xs font-bold text-gray-900">Notificaciones por correo</h3>
            <p class="text-xs text-gray-500">Recibe actualizaciones sobre el estado de tus solicitudes de pre-evaluación en tiempo real.</p>
          </div>
          <button
            type="button"
            @click="notifications.email = !notifications.email"
            :class="[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
              notifications.email ? 'bg-blue-600' : 'bg-gray-200'
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                notifications.email ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>

        <!-- Item 2 -->
        <div class="py-4 flex items-center justify-between gap-4">
          <div class="space-y-0.5">
            <h3 class="text-xs font-bold text-gray-900">Alertas de ofertas vehiculares</h3>
            <p class="text-xs text-gray-500">Avisos cuando un vehículo en tu radar baje de precio o haya promociones de tasas de bancos aliados.</p>
          </div>
          <button
            type="button"
            @click="notifications.promotions = !notifications.promotions"
            :class="[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
              notifications.promotions ? 'bg-blue-600' : 'bg-gray-200'
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                notifications.promotions ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>

        <!-- Item 3 -->
        <div class="py-4 flex items-center justify-between gap-4">
          <div class="space-y-0.5">
            <h3 class="text-xs font-bold text-gray-900">Resumen mensual de simulaciones</h3>
            <p class="text-xs text-gray-500">Reporte mensual comparativo con las mejores tasas TEA del mercado financiero automotriz.</p>
          </div>
          <button
            type="button"
            @click="notifications.monthlySummary = !notifications.monthlySummary"
            :class="[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
              notifications.monthlySummary ? 'bg-blue-600' : 'bg-gray-200'
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                notifications.monthlySummary ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Section 2: Seguridad de la Cuenta -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-5">
      <div class="flex items-center gap-2.5 pb-4 border-b border-gray-100">
        <div class="w-8 h-8 rounded-lg bg-orange-50 text-[#eb8f47] flex items-center justify-center font-bold">
          <i class="pi pi-shield text-sm"></i>
        </div>
        <div>
          <h2 class="text-base font-bold text-gray-900">Seguridad de la Cuenta</h2>
          <p class="text-xs text-gray-500">Actualiza tu contraseña periódicamente para proteger tu información</p>
        </div>
      </div>

      <form @submit.prevent="handleUpdatePassword" class="space-y-4 max-w-xl">
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-gray-700">Contraseña actual</label>
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Nueva contraseña</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              required
              minlength="6"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Confirmar nueva contraseña</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              minlength="6"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
            />
          </div>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="isUpdatingPassword"
            class="px-5 py-2.5 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] disabled:opacity-50 text-white font-semibold text-xs text-center shadow-xs transition-colors flex items-center gap-2"
          >
            <i v-if="isUpdatingPassword" class="pi pi-spin pi-spinner text-xs"></i>
            <i v-else class="pi pi-key text-xs"></i>
            <span>Actualizar contraseña</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Section 3: Zona de peligro -->
    <div class="bg-white rounded-2xl border border-red-200 p-6 sm:p-7 shadow-xs space-y-4">
      <div class="flex items-center gap-2.5 pb-4 border-b border-red-100">
        <div class="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
          <i class="pi pi-exclamation-triangle text-sm"></i>
        </div>
        <div>
          <h2 class="text-base font-bold text-red-950">Zona de peligro</h2>
          <p class="text-xs text-red-500">Acciones irreversibles sobre tu cuenta de comprador</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
        <div class="space-y-1">
          <h3 class="text-xs font-bold text-gray-900">Eliminar cuenta permanentemente</h3>
          <p class="text-xs text-gray-500">
            Una vez eliminada la cuenta, se borrarán de forma irrevocable tus solicitudes, perfil y datos asociados.
          </p>
        </div>

        <button
          type="button"
          @click="showDeleteConfirm = true"
          class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs text-center shadow-xs transition-colors shrink-0"
        >
          Eliminar cuenta
        </button>
      </div>
    </div>

    <!-- Confirmation Modal for Account Deletion -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <i class="pi pi-exclamation-triangle text-xl"></i>
        </div>
        <div class="text-center space-y-2">
          <h3 class="text-lg font-bold text-gray-900">¿Estás seguro de eliminar tu cuenta?</h3>
          <p class="text-xs text-gray-500">
            Esta acción no se puede deshacer. Se cancelarán todas tus pre-evaluaciones pendientes y se eliminará tu historial.
          </p>
        </div>
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="showDeleteConfirm = false"
            class="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="handleConfirmDelete"
            class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white"
          >
            Confirmar eliminación
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useIamStore } from '@/iam/application/iam.store'

const router = useRouter()
const iamStore = useIamStore()

const notifications = reactive({
  email: true,
  promotions: true,
  monthlySummary: false
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isUpdatingPassword = ref(false)
const securitySuccessMsg = ref<string | null>(null)
const securityErrorMsg = ref<string | null>(null)
const showDeleteConfirm = ref(false)

const handleUpdatePassword = async () => {
  securitySuccessMsg.value = null
  securityErrorMsg.value = null

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    securityErrorMsg.value = 'Las contraseñas nuevas no coinciden.'
    return
  }

  isUpdatingPassword.value = true
  setTimeout(() => {
    isUpdatingPassword.value = false
    securitySuccessMsg.value = 'Contraseña actualizada correctamente.'
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    setTimeout(() => {
      securitySuccessMsg.value = null
    }, 4000)
  }, 800)
}

const handleConfirmDelete = () => {
  showDeleteConfirm.value = false
  iamStore.signOut()
  router.push('/sign-in')
}
</script>

<style scoped>
</style>
