<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
      <!-- Form Header -->
      <div class="text-center space-y-2">
        <div class="w-14 h-14 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-md">
          <i class="pi pi-shield"></i>
        </div>
        <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">
          {{ t('iam.resetPasswordTitle') }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ t('iam.resetPasswordSubtitle') }}
        </p>
      </div>

      <!-- Success Alert -->
      <div v-if="iamStore.successMessage" class="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg text-sm text-emerald-800 flex items-start space-x-2">
        <i class="pi pi-check-circle text-emerald-600 text-base mt-0.5"></i>
        <span>{{ iamStore.successMessage }}</span>
      </div>

      <!-- Error Alert -->
      <div v-if="iamStore.error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700 flex items-start space-x-2">
        <i class="pi pi-exclamation-circle text-red-500 text-base mt-0.5"></i>
        <span>{{ iamStore.error }}</span>
      </div>

      <!-- Form Inputs -->
      <form class="space-y-5" @submit.prevent="handlePasswordReset">
        <div>
          <label for="reset-token" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            {{ t('iam.resetToken') }}
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <i class="pi pi-ticket text-sm"></i>
            </span>
            <input
              id="reset-token"
              v-model="resetToken"
              type="text"
              required
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-mono"
              :placeholder="t('iam.resetTokenPlaceholder')"
            />
          </div>
        </div>

        <div>
          <label for="new-password" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            {{ t('iam.newPassword') }}
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <i class="pi pi-lock text-sm"></i>
            </span>
            <input
              id="new-password"
              v-model="newPassword"
              type="password"
              required
              minlength="6"
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              :placeholder="t('iam.passwordPlaceholder')"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="iamStore.isLoading"
          class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <i v-if="iamStore.isLoading" class="pi pi-spin pi-spinner text-sm"></i>
          <span>{{ iamStore.isLoading ? t('iam.resetting') : t('iam.resetPasswordBtn') }}</span>
        </button>
      </form>

      <!-- Footer navigation link -->
      <div class="text-center text-sm text-gray-600 pt-2 border-t border-gray-100">
        <router-link to="/iam/sign-in" class="font-bold text-blue-900 hover:underline">
          <i class="pi pi-arrow-left text-xs mr-1"></i> {{ t('iam.signInLink') }}
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
import { PasswordResetCommand } from '../../domain/password-reset.command'

const { t } = useI18n()
const router = useRouter()
const iamStore = useIamStore()

const resetToken = ref('')
const newPassword = ref('')

const handlePasswordReset = async () => {
  const command = new PasswordResetCommand({
    resetToken: resetToken.value,
    newPassword: newPassword.value
  })

  const success = await iamStore.resetPassword(command)
  if (success) {
    setTimeout(() => {
      router.push('/iam/sign-in')
    }, 1500)
  }
}
</script>

<style scoped>
</style>
