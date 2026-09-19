<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
      <!-- Form Header -->
      <div class="text-center space-y-2">
        <router-link to="/home" class="inline-flex items-center space-x-2 text-blue-950 font-bold mb-2">
          <i class="pi pi-car text-xl bg-blue-900 text-white p-2 rounded-lg"></i>
          <span class="text-xl">SmartFinance Drive</span>
        </router-link>
        <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">
          {{ t('iam.signInTitle') }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ t('iam.signInSubtitle') }}
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="iamStore.error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700 flex items-start space-x-2">
        <i class="pi pi-exclamation-circle text-red-500 text-base mt-0.5"></i>
        <span>{{ iamStore.error }}</span>
      </div>

      <!-- Form Inputs -->
      <form class="space-y-5" @submit.prevent="handleSignIn">
        <div>
          <label for="username" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            {{ t('iam.email') }}
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <i class="pi pi-envelope text-sm"></i>
            </span>
            <input
              id="username"
              v-model="username"
              type="email"
              required
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
              :placeholder="t('iam.emailPlaceholder')"
            />
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-1">
            <label for="password" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {{ t('iam.password') }}
            </label>
            <router-link to="/iam/forgot-password" class="text-xs font-medium text-blue-900 hover:underline">
              {{ t('iam.forgotPasswordLink') }}
            </router-link>
          </div>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <i class="pi pi-key text-sm"></i>
            </span>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
              :placeholder="t('iam.passwordPlaceholder')"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="iamStore.isLoading"
          class="w-full py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <i v-if="iamStore.isLoading" class="pi pi-spin pi-spinner text-sm"></i>
          <span>{{ iamStore.isLoading ? t('iam.signingIn') : t('iam.signInBtn') }}</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative flex py-1 items-center">
        <div class="flex-grow border-t border-gray-200"></div>
        <span class="flex-shrink mx-4 text-xs text-gray-400 uppercase tracking-wider">O continuar con</span>
        <div class="flex-grow border-t border-gray-200"></div>
      </div>

      <!-- Google OAuth & Quick Demo Buttons -->
      <div class="space-y-2">
        <button
          type="button"
          @click="handleGoogleSignIn"
          :disabled="iamStore.isLoading"
          class="w-full py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-3"
        >
          <i class="pi pi-google text-red-500 text-base"></i>
          <span>{{ t('iam.googleSignIn') }}</span>
        </button>

        <button
          type="button"
          @click="handleQuickDemoSignIn"
          :disabled="iamStore.isLoading"
          class="w-full py-2.5 px-4 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-semibold text-sm rounded-xl transition-all flex items-center justify-center space-x-2"
        >
          <i class="pi pi-bolt text-sky-600"></i>
          <span>{{ t('iam.demoLoginBtn') }}</span>
        </button>
      </div>

      <!-- Footer navigation link -->
      <div class="text-center text-sm text-gray-600 pt-2 border-t border-gray-100">
        {{ t('iam.noAccount') }}
        <router-link to="/iam/sign-up" class="font-bold text-blue-900 hover:underline">
          {{ t('iam.signUpLink') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../application/iam.store'
import { SignInCommand } from '../../domain/sign-in.command'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const iamStore = useIamStore()

const username = ref('')
const password = ref('')

const handleSignIn = async () => {
  const command = new SignInCommand({
    username: username.value,
    password: password.value
  })

  const success = await iamStore.signIn(command)
  if (success) {
    const redirectPath = (route.query.redirect as string) || '/home'
    router.push(redirectPath)
  }
}

const handleQuickDemoSignIn = async () => {
  const success = await iamStore.signInDemo()
  if (success) {
    const redirectPath = (route.query.redirect as string) || '/home'
    router.push(redirectPath)
  }
}

const handleGoogleSignIn = async () => {
  // Demo simulation for Google OAuth idToken payload
  const demoIdToken = 'google_oauth_demo_token_' + Date.now()
  const success = await iamStore.signInWithGoogle(demoIdToken)
  if (success) {
    const redirectPath = (route.query.redirect as string) || '/home'
    router.push(redirectPath)
  }
}
</script>

<style scoped>
</style>
