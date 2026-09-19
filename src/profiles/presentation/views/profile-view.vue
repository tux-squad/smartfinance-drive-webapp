<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header matching Mockup Image 4 -->
    <div class="border-b border-gray-100 pb-6 space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
        Mi Perfil
      </h1>
      <p class="text-sm text-gray-500">
        Gestiona tu información personal y datos financieros para tus pre-evaluaciones de crédito vehicular.
      </p>
    </div>

    <!-- Alert / Toast Messages -->
    <div
      v-if="saveSuccessMessage"
      class="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-sm text-emerald-800 flex items-center justify-between"
    >
      <div class="flex items-center space-x-2">
        <i class="pi pi-check-circle text-emerald-600 text-lg"></i>
        <span class="font-medium">{{ saveSuccessMessage }}</span>
      </div>
      <button type="button" @click="saveSuccessMessage = null" class="text-emerald-500 hover:text-emerald-700">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <div
      v-if="profilesStore.error"
      class="bg-red-50 border border-red-200 p-4 rounded-2xl text-sm text-red-800 flex items-center justify-between"
    >
      <div class="flex items-center space-x-2">
        <i class="pi pi-exclamation-circle text-red-600 text-lg"></i>
        <span>{{ profilesStore.error }}</span>
      </div>
      <button type="button" @click="profilesStore.error = null" class="text-red-400 hover:text-red-700">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <!-- 2-Column Form matching Mockup Image 4 -->
    <form @submit.prevent="handleSaveProfile" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Column 1: Información Personal -->
        <div class="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div class="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <i class="pi pi-id-card text-sm"></i>
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900">Información Personal</h2>
              <p class="text-xs text-gray-500">Datos oficiales de identificación del comprador</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Nombres -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-gray-700">Nombres</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  placeholder="Carlos"
                  class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                />
              </div>

              <!-- Apellidos -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-gray-700">Apellidos</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  placeholder="Mendoza"
                  class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                />
              </div>
            </div>

            <!-- DNI -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">DNI / Documento de Identidad</label>
              <input
                v-model="form.dni"
                type="text"
                maxlength="8"
                required
                placeholder="72345678"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            <!-- Correo Electrónico -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Correo Electrónico</label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="carlos.mendoza@email.com"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            <!-- Teléfono -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Teléfono / Celular</label>
              <input
                v-model="form.phoneNumber"
                type="tel"
                placeholder="+51 987 654 321"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        <!-- Column 2: Perfil Financiero -->
        <div class="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div class="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <i class="pi pi-wallet text-sm"></i>
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900">Perfil Financiero</h2>
              <p class="text-xs text-gray-500">Datos para evaluar capacidad de pago y tasas preferenciales</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Ingreso Mensual -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-gray-700">Ingreso Mensual Neto</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-gray-400 font-bold">
                    {{ form.currency === 'USD' ? '$' : 'S/' }}
                  </span>
                  <input
                    v-model.number="form.monthlyIncomeAmount"
                    type="number"
                    min="0"
                    step="100"
                    required
                    placeholder="3500.00"
                    class="w-full pl-8 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                  />
                </div>
              </div>

              <!-- Moneda Declarada -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-gray-700">Moneda de Ingresos</label>
                <select
                  v-model="form.currency"
                  class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs cursor-pointer"
                >
                  <option value="PEN">Soles (PEN - S/)</option>
                  <option value="USD">Dólares (USD - $)</option>
                </select>
              </div>
            </div>

            <!-- Situación Laboral -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Situación Laboral</label>
              <select
                v-model="form.employmentStatus"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs cursor-pointer"
              >
                <option value="dependent">Dependiente - Tiempo Completo (Planilla)</option>
                <option value="independent">Independiente con RUC (4ta / 5ta categoría)</option>
                <option value="business">Empresario / Accionista (3ra categoría)</option>
              </select>
            </div>

            <!-- Acreditación Crediticia Badge Box -->
            <div class="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-700">Historial Crediticio</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <i class="pi pi-check-circle mr-1 text-[10px]"></i>
                  Acreditado SBS
                </span>
              </div>
              <p class="text-[11px] text-gray-500 leading-relaxed">
                Tus datos financieros te permiten acceder a pre-aprobaciones automáticas en menos de 24 horas a través de nuestras entidades bancarias aliadas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Button: Guardar cambios matching Mockup Image 4 -->
      <div class="flex justify-start">
        <button
          type="submit"
          :disabled="isSaving"
          class="px-6 py-2.5 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] disabled:opacity-50 text-white font-semibold text-xs text-center shadow-xs transition-colors flex items-center gap-2"
        >
          <i v-if="isSaving" class="pi pi-spin pi-spinner text-xs"></i>
          <i v-else class="pi pi-save text-xs"></i>
          <span>Guardar cambios</span>
        </button>
      </div>
    </form>

    <!-- Business Role Request / Elevation Section (IAM SUNAT RBAC) is cleanly retained at bottom -->
    <DealerRoleRequestCard />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useIamStore } from '@/iam/application/iam.store'
import { useProfilesStore } from '../../application/profiles.store'
import { CreateProfileCommand } from '../../domain/create-profile.command'
import { UpdateProfileCommand } from '../../domain/update-profile.command'
import DealerRoleRequestCard from '@/iam/presentation/components/dealer-role-request-card.vue'

const iamStore = useIamStore()
const profilesStore = useProfilesStore()

const isSaving = ref(false)
const saveSuccessMessage = ref<string | null>(null)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  dni: '',
  phoneNumber: '',
  monthlyIncomeAmount: 3500,
  currency: 'PEN',
  employmentStatus: 'dependent'
})

const populateFormData = () => {
  const p = profilesStore.currentProfile
  if (p) {
    form.firstName = p.firstName || ''
    form.lastName = p.lastName || ''
    form.email = p.email || ''
    form.dni = p.dni || ''
    form.phoneNumber = p.phoneNumber || ''
    form.monthlyIncomeAmount = p.monthlyIncomeAmount || 3500
    form.currency = p.currency || 'PEN'
  } else {
    // Fill defaults if new user
    const username = iamStore.username || ''
    if (username.includes('@')) {
      form.email = username
      const rawName = (username.split('@')[0] || '').replace(/[._-]/g, ' ')
      const parts = rawName.split(' ')
      form.firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Carlos'
      form.lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'Mendoza'
    } else {
      form.firstName = 'Carlos'
      form.lastName = 'Mendoza'
      form.email = 'carlos.mendoza@email.com'
    }
    form.dni = '72345678'
    form.phoneNumber = '+51 987 654 321'
  }
}

onMounted(async () => {
  const userId = iamStore.currentUser?.id || localStorage.getItem('user_id')
  if (userId) {
    await profilesStore.fetchProfileByUserId(userId)
  }
  populateFormData()
})

const handleSaveProfile = async () => {
  isSaving.value = true
  saveSuccessMessage.value = null

  try {
    if (profilesStore.hasProfile && profilesStore.currentProfile) {
      const command = new UpdateProfileCommand({
        profileId: profilesStore.currentProfile.id,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        dni: form.dni,
        phoneNumber: form.phoneNumber,
        monthlyIncomeAmount: Number(form.monthlyIncomeAmount),
        currency: form.currency
      })
      const success = await profilesStore.updateProfile(command)
      if (success) {
        saveSuccessMessage.value = 'Información de perfil actualizada con éxito.'
      }
    } else {
      const command = new CreateProfileCommand({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        dni: form.dni,
        phoneNumber: form.phoneNumber,
        monthlyIncomeAmount: Number(form.monthlyIncomeAmount),
        currency: form.currency
      })
      const success = await profilesStore.createProfile(command)
      if (success) {
        saveSuccessMessage.value = 'Perfil de comprador guardado con éxito.'
      }
    }
  } catch {
    // Error is handled in store
  } finally {
    isSaving.value = false
    setTimeout(() => {
      saveSuccessMessage.value = null
    }, 4000)
  }
}
</script>

<style scoped>
</style>
