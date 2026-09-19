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
          <span class="text-[11px] text-amber-700 font-medium mt-1 flex items-center space-x-1">
            <i class="pi pi-info-circle text-xs"></i>
            <span>{{ t('iam.passwordHelp') }}</span>
          </span>
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            @click="fillDemoData"
            class="text-xs text-sky-700 hover:text-sky-900 font-semibold underline flex items-center space-x-1"
          >
            <i class="pi pi-sparkles text-xs"></i>
            <span>{{ t('iam.fillDemoBtn') }}</span>
          </button>
        </div>

        <!-- Informative note about Dealer / Financial Partner elevation -->
        <div class="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-start space-x-2 text-xs text-sky-900">
          <i class="pi pi-info-circle text-sky-600 mt-0.5 shrink-0"></i>
          <span>{{ t('iam.dealerNotice') }}</span>
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

const { t } = useI18n()
const router = useRouter()
const iamStore = useIamStore()

const username = ref('')
const password = ref('')
const successMessage = ref('')

const fillDemoData = () => {
  username.value = 'demo_user_' + Math.floor(Math.random() * 1000) + '@smartfinance.com'
  password.value = 'Password123!'
}

const handleSignUp = async () => {
  const command = new SignUpCommand({
    username: username.value,
    password: password.value,
    roles: ['ROLE_USER']
  })

  const createdUser = await iamStore.signUp(command)
  if (createdUser && createdUser.id) {
    // Automatic sign-in in background to acquire JWT Bearer token
    await iamStore.signIn({
      username: username.value,
      password: password.value
    })

    successMessage.value = t('iam.signUpSuccess')
    setTimeout(() => {
      router.push('/home')
    }, 1200)
  }
}
</script>

<style scoped>
</style>
