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
          <p class="text-xs text-gray-500">Gestión de credenciales y restablecimiento seguro de contraseña</p>
        </div>
      </div>

      <div class="space-y-4 max-w-xl">
        <div class="p-4 rounded-xl bg-gray-50/70 border border-gray-200 space-y-3">
          <div class="flex items-start gap-3">
            <i class="pi pi-info-circle text-blue-600 mt-0.5" />
            <div class="space-y-1 text-xs text-gray-600">
              <p class="font-semibold text-gray-800">Flujo de cambio de contraseña seguro</p>
              <p>
                Por políticas de seguridad bancaria, el cambio de contraseña se realiza mediante un token de verificación seguro enviado a tu correo registrado:
                <strong class="font-mono text-gray-900">{{ currentAccountEmail || 'tu correo registrado' }}</strong>.
              </p>
            </div>
          </div>

          <div
            v-if="securitySuccessMsg"
            class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2"
          >
            <i class="pi pi-check-circle text-emerald-600 shrink-0" />
            <span>{{ securitySuccessMsg }}</span>
          </div>

          <div
            v-if="securityErrorMsg"
            class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2"
          >
            <i class="pi pi-exclamation-circle text-rose-600 shrink-0" />
            <span>{{ securityErrorMsg }}</span>
          </div>

          <div class="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              :disabled="isSendingRecovery"
              @click="handleRequestPasswordRecovery"
              class="px-4 py-2.5 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] disabled:opacity-50 text-white font-semibold text-xs text-center shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <i v-if="isSendingRecovery" class="pi pi-spin pi-spinner text-xs" />
              <i v-else class="pi pi-envelope text-xs" />
              <span>{{ isSendingRecovery ? 'Enviando solicitud...' : 'Enviar enlace de restablecimiento' }}</span>
            </button>

            <router-link
              :to="`/iam/reset-password${currentAccountEmail ? '?email=' + encodeURIComponent(currentAccountEmail) : ''}`"
              class="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium text-xs text-center transition-colors flex items-center gap-1.5"
            >
              <i class="pi pi-key text-xs" />
              <span>Ingresar token y nueva contraseña</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3: Zona de peligro -->
    <div class="bg-white rounded-2xl border border-red-200 p-6 sm:p-7 shadow-xs space-y-4">
      <div class="flex items-center gap-2.5 pb-4 border-b border-red-100">
        <div class="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
          <i class="pi pi-exclamation-triangle text-sm"></i>
        </div>
        <div>
          <h2 class="text-base font-bold text-red-950">Zona de peligro</h2>
          <p class="text-xs text-red-500">Acciones sobre tu perfil y sesión</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
        <div class="space-y-1">
          <h3 class="text-xs font-bold text-gray-900">Eliminar perfil y cerrar sesión</h3>
          <p class="text-xs text-gray-500">
            Se eliminarán tus datos de perfil registrados y se cerrará tu sesión activa de forma irrevocable.
          </p>
        </div>

        <button
          type="button"
          @click="showDeleteConfirm = true"
          class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs text-center shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          Eliminar perfil
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
          <h3 class="text-lg font-bold text-gray-900">¿Estás seguro de eliminar tu perfil?</h3>
          <p class="text-xs text-gray-500">
            Esta acción no se puede deshacer. Se eliminarán los datos personales del perfil y se revocará tu sesión activa de forma definitiva.
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
            Confirmar y salir
          </button>
        </div>
      </div>
    </div>

    <!-- Section: Panel de Administración de Usuarios y Roles (Solo Admin - Error 17) -->
    <div v-if="iamStore.roles.includes('ROLE_ADMIN')" class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-5">
      <div class="flex items-center justify-between pb-4 border-b border-gray-100 flex-wrap gap-2">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <i class="pi pi-users text-sm"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-gray-900">Gestión de Usuarios y Roles (Admin)</h2>
            <p class="text-xs text-gray-500">Administra los accesos globales y asignación de roles de la plataforma.</p>
          </div>
        </div>
        <button
          type="button"
          @click="loadAdminUsers"
          :disabled="isLoadingUsers"
          class="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <i :class="isLoadingUsers ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'" class="text-xs"></i>
          <span>{{ iamStore.userList.length > 0 ? 'Actualizar Lista' : 'Cargar Usuarios' }}</span>
        </button>
      </div>

      <div v-if="adminFeedbackMsg" class="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
        <span>{{ adminFeedbackMsg }}</span>
        <button @click="adminFeedbackMsg = null" class="text-emerald-600 hover:text-emerald-800"><i class="pi pi-times text-[10px]"></i></button>
      </div>

      <div v-if="iamStore.userList.length > 0" class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="text-[11px] uppercase tracking-wider text-gray-500 bg-gray-50 rounded-xl">
            <tr>
              <th class="py-2.5 px-3 font-semibold">ID</th>
              <th class="py-2.5 px-3 font-semibold">Usuario</th>
              <th class="py-2.5 px-3 font-semibold">Roles Actuales</th>
              <th class="py-2.5 px-3 font-semibold">Asignar Nuevo Rol</th>
              <th class="py-2.5 px-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in iamStore.userList" :key="user.id" class="hover:bg-gray-50/50">
              <td class="py-3 px-3 font-mono font-medium text-gray-600">{{ user.id }}</td>
              <td class="py-3 px-3 font-bold text-gray-900">{{ user.username }}</td>
              <td class="py-3 px-3">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="r in user.roles"
                    :key="r"
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700"
                  >
                    {{ r }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-3">
                <select
                  v-model="selectedUserRoles[user.id]"
                  class="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ROLE_USER">ROLE_USER</option>
                  <option value="ROLE_DEALER">ROLE_DEALER</option>
                  <option value="ROLE_FINANCIAL_INSTITUTION">ROLE_FINANCIAL_INSTITUTION</option>
                  <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                </select>
              </td>
              <td class="py-3 px-3 text-right">
                <div class="inline-flex items-center gap-2">
                  <button
                    type="button"
                    @click="handleUpdateRole(user.id)"
                    :disabled="isUpdatingRole === user.id"
                    class="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <i v-if="isUpdatingRole === user.id" class="pi pi-spin pi-spinner text-[10px]"></i>
                    <span>Guardar Rol</span>
                  </button>
                  <button
                    type="button"
                    @click="router.push(`/user/profile?profileId=${user.id}`)"
                    class="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-medium"
                    title="Ver perfil por ID"
                  >
                    <i class="pi pi-user text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-xs text-gray-400 py-3 text-center">
        Haz clic en "Cargar Usuarios" para consultar el listado institucional de cuentas registradas.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useIamStore } from '@/iam/application/iam.store'
import { PasswordRecoveryCommand } from '@/iam/domain/password-recovery.command'

const router = useRouter()
const iamStore = useIamStore()

const notifications = reactive({
  email: true,
  promotions: true,
  monthlySummary: false
})

const isSendingRecovery = ref(false)
const securitySuccessMsg = ref<string | null>(null)
const securityErrorMsg = ref<string | null>(null)
const showDeleteConfirm = ref(false)

const currentAccountEmail = computed(() => {
  return iamStore.currentUser?.username || localStorage.getItem('user_email') || ''
})

const handleRequestPasswordRecovery = async () => {
  const email = currentAccountEmail.value
  if (!email || !email.includes('@')) {
    securityErrorMsg.value = 'No se encontró un correo electrónico asociado a la sesión.'
    return
  }
  isSendingRecovery.value = true
  securitySuccessMsg.value = null
  securityErrorMsg.value = null
  try {
    const success = await iamStore.requestPasswordRecovery(new PasswordRecoveryCommand({ username: email }))
    if (success) {
      securitySuccessMsg.value = `Se enviaron instrucciones y el token seguro para restablecer tu contraseña al correo ${email}.`
    } else {
      securityErrorMsg.value = iamStore.error || 'No se pudo enviar la solicitud de recuperación.'
    }
  } catch {
    securityErrorMsg.value = 'Ocurrió un error al procesar la solicitud.'
  } finally {
    isSendingRecovery.value = false
  }
}

const handleConfirmDelete = async () => {
  showDeleteConfirm.value = false
  try {
    const { useProfilesStore } = await import('@/profiles/application/profiles.store')
    const profilesStore = useProfilesStore()
    const userId = iamStore.currentUser?.id || localStorage.getItem('user_id')
    if (userId) {
      await profilesStore.fetchProfileByUserId(userId)
      if (profilesStore.currentProfile?.id) {
        await profilesStore.deleteProfile(profilesStore.currentProfile.id)
      }
    }
  } catch (err) {
    console.error('Error al remover perfil de usuario:', err)
  } finally {
    await iamStore.signOut()
    router.push('/iam/sign-in')
  }
}

// Admin User Management State & Actions (1.8 / 1.10)
const isLoadingUsers = ref(false)
const isUpdatingRole = ref<number | string | null>(null)
const selectedUserRoles = reactive<Record<string | number, string>>({})
const adminFeedbackMsg = ref<string | null>(null)

const loadAdminUsers = async () => {
  isLoadingUsers.value = true
  try {
    await iamStore.fetchUsers(0, 20)
    iamStore.userList.forEach(u => {
      selectedUserRoles[u.id] = u.roles[0] || 'ROLE_USER'
    })
  } finally {
    isLoadingUsers.value = false
  }
}

const handleUpdateRole = async (userId: number | string) => {
  const role = selectedUserRoles[userId]
  if (!role) return
  isUpdatingRole.value = userId
  try {
    const ok = await iamStore.updateUserRole(userId, role)
    if (ok) {
      adminFeedbackMsg.value = `Rol del usuario #${userId} actualizado a ${role} con éxito.`
    }
  } finally {
    isUpdatingRole.value = null
  }
}
</script>

<style scoped>
</style>
