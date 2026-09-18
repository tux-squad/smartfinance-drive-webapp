<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
      <!-- Form Header -->
      <div class="text-center space-y-2">
        <router-link to="/home" class="inline-flex items-center space-x-2 text-sky-700 font-bold mb-2">
          <i class="pi pi-car text-xl bg-sky-700 text-white p-2 rounded-lg"></i>
          <span class="text-xl">SmartFinance Drive</span>
        </router-link>
        <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">
          {{ t('iam.signUpTitle') }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ t('iam.signUpSubtitle') }}
        </p>
      </div>

      <!-- Success Alert -->
      <div v-if="successMessage" class="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg text-sm text-emerald-800 flex items-start space-x-2">
        <i class="pi pi-check-circle text-emerald-600 text-base mt-0.5"></i>
        <span>{{ successMessage }}</span>
      </div>

      <!-- Error Alert -->
      <div v-if="iamStore.error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700 flex items-start space-x-2">
        <i class="pi pi-exclamation-circle text-red-500 text-base mt-0.5"></i>
        <span>{{ iamStore.error }}</span>
      </div>

      <!-- Form Inputs -->
      <form class="space-y-5" @submit.prevent="handleSignUp">
        <div>
          <label for="reg-username" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            {{ t('iam.email') }}
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <i class="pi pi-envelope text-sm"></i>
            </span>
            <input
              id="reg-username"
              v-model="username"
              type="email"
              required
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white transition-all"
              :placeholder="t('iam.emailPlaceholder')"
            />
          </div>
        </div>

        <div>
          <label for="reg-password" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            {{ t('iam.password') }}
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <i class="pi pi-key text-sm"></i>
            </span>
            <input
              id="reg-password"
              v-model="password"
              type="password"
              required
              minlength="6"
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white transition-all"
              :placeholder="t('iam.passwordPlaceholder')"
            />
          </div>
        </div>

        <!-- Role Selection -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            {{ t('iam.selectRole') }}
          </label>
          <div class="grid grid-cols-3 gap-2">
            <label
              v-for="role in roleOptions"
              :key="role.value"
              class="flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer text-center transition-all"
              :class="[
                selectedRole === role.value
                  ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-xs'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
              ]"
            >
              <input
                type="radio"
                name="role"
                :value="role.value"
                v-model="selectedRole"
                class="sr-only"
              />
              <i :class="['pi', role.icon, 'text-lg mb-1']"></i>
              <span class="text-xs font-semibold">{{ role.label }}</span>
            </label>
          </div>
        </div>

        <!-- RUC Input (Visible for Dealer and Financial Institution) -->
        <div v-if="selectedRole === 'ROLE_DEALER' || selectedRole === 'ROLE_FINANCIAL_INSTITUTION'">
          <label for="reg-ruc" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            {{ t('iam.rucNumber') }} (SUNAT)
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <i class="pi pi-building text-sm"></i>
            </span>
            <input
              id="reg-ruc"
              v-model="ruc"
              type="text"
              required
              maxlength="11"
              minlength="11"
              pattern="[0-9]{11}"
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white transition-all font-mono"
              placeholder="20601234567"
            />
          </div>
          <span class="text-[10px] text-gray-500 mt-1 block">RUC oficial de 11 dígitos a validar con SUNAT</span>
        </div>

        <button
          type="submit"
          :disabled="iamStore.isLoading"
          class="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <i v-if="iamStore.isLoading" class="pi pi-spin pi-spinner text-sm"></i>
          <span>{{ iamStore.isLoading ? t('iam.registering') : t('iam.signUpBtn') }}</span>
        </button>
      </form>

      <!-- Footer navigation link -->
      <div class="text-center text-sm text-gray-600 pt-2 border-t border-gray-100">
        {{ t('iam.hasAccount') }}
        <router-link to="/iam/sign-in" class="font-bold text-sky-700 hover:underline">
          {{ t('iam.signInLink') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../application/iam.store'
import { SignUpCommand } from '../../domain/sign-up.command'
import { RoleRequestCommand } from '../../domain/role-request.command'

const { t } = useI18n()
const router = useRouter()
const iamStore = useIamStore()

const username = ref('')
const password = ref('')
const ruc = ref('')
const selectedRole = ref('ROLE_USER')
const successMessage = ref('')

const roleOptions = [
  { label: 'Comprador', value: 'ROLE_USER', icon: 'pi-user' },
  { label: 'Concesionario', value: 'ROLE_DEALER', icon: 'pi-car' },
  { label: 'Entidad Fin.', value: 'ROLE_FINANCIAL_INSTITUTION', icon: 'pi-building' }
]

const handleSignUp = async () => {
  const command = new SignUpCommand({
    username: username.value,
    password: password.value,
    roles: [selectedRole.value]
  })

  const createdUser = await iamStore.signUp(command)
  if (createdUser && createdUser.id) {
    // If dealer or financial institution, submit RUC role request with the EXACT created user ID
    if (ruc.value && (selectedRole.value === 'ROLE_DEALER' || selectedRole.value === 'ROLE_FINANCIAL_INSTITUTION')) {
      const roleCommand = new RoleRequestCommand({ userId: createdUser.id, ruc: ruc.value })
      if (selectedRole.value === 'ROLE_DEALER') {
        await iamStore.requestDealerRole(roleCommand)
      } else {
        await iamStore.requestFinancialInstitutionRole(roleCommand)
      }
    }

    successMessage.value = t('iam.signUpSuccess')
    setTimeout(() => {
      router.push('/iam/sign-in')
    }, 1500)
  }
}
</script>

<style scoped>
</style>
