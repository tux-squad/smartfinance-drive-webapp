<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-surface-800 dark:text-surface-100">
    <div class="max-w-md w-full space-y-6 bg-surface-0 dark:bg-surface-900 p-8 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xl">
      <!-- Top Navigation & Language Switcher -->
      <div class="flex items-center justify-between">
        <router-link
          to="/iam/sign-in"
          class="inline-flex items-center gap-2 text-xs font-semibold text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
        >
          <i class="pi pi-arrow-left text-xs" />
          <span>{{ t('iam.signInLink') }}</span>
        </router-link>

        <LanguageSwitcher />
      </div>

      <!-- Form Header -->
      <div class="text-center space-y-3">
        <router-link to="/home" class="inline-flex items-center gap-2.5 mx-auto group">
          <div class="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-white/10 p-1.5 flex items-center justify-center border border-emerald-600/20 dark:border-white/10 group-hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="SmartFinance Logo" class="w-full h-full object-contain dark:hidden" />
            <img src="/logo-white.svg" alt="SmartFinance Logo" class="w-full h-full object-contain hidden dark:block" />
          </div>
          <div class="text-left">
            <span class="text-base font-black tracking-wide block leading-none text-surface-900 dark:text-surface-0">SmartFinance</span>
            <span class="text-[10px] text-primary-600 dark:text-primary-400 font-bold tracking-widest uppercase">Drive</span>
          </div>
        </router-link>

        <h2 class="text-2xl font-black text-surface-900 dark:text-surface-0 tracking-tight">
          {{ t('iam.resetPasswordTitle') }}
        </h2>
        <p class="text-xs text-surface-500 max-w-sm mx-auto">
          {{ t('iam.resetPasswordSubtitle') }}
        </p>
        <p v-if="accountEmail" class="text-[11px] text-surface-600 dark:text-surface-400 font-medium">
          Token solicitado para: <span class="font-bold font-mono text-surface-800 dark:text-surface-200">{{ accountEmail }}</span>
        </p>
      </div>

      <!-- Success Alert -->
      <Message v-if="iamStore.successMessage" severity="success" :closable="false" class="w-full text-xs">
        {{ iamStore.successMessage }}
      </Message>

      <!-- Error Alert -->
      <Message v-if="iamStore.error" severity="error" :closable="true" @close="iamStore.error = null" class="w-full text-xs">
        {{ iamStore.error }}
      </Message>

      <!-- Form Inputs -->
      <form class="space-y-4" @submit.prevent="handlePasswordReset">
        <div class="space-y-1.5">
          <label for="reset-token" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
            {{ t('iam.resetToken') }} <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <i class="pi pi-ticket absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs pointer-events-none z-10"></i>
            <InputText
              id="reset-token"
              v-model="resetToken"
              type="text"
              required
              class="w-full !pl-9 !py-2.5 !text-xs !rounded-xl font-mono"
              :placeholder="t('iam.resetTokenPlaceholder')"
            />
          </div>
        </div>

        <!-- New Password -->
        <div class="space-y-1.5">
          <label for="new-password" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
            {{ t('iam.newPassword') }} <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <Password
              id="new-password"
              inputId="new-password-input"
              v-model="newPassword"
              required
              :feedback="false"
              toggleMask
              class="w-full !rounded-xl"
              inputClass="w-full !text-xs !py-2.5 !rounded-xl"
              :placeholder="t('iam.passwordPlaceholder')"
            />
          </div>

          <!-- Password criteria -->
          <div v-if="newPassword" class="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 text-[10px] space-y-1">
            <span class="font-bold text-surface-600 dark:text-surface-300 block mb-1">Requisitos de contraseña:</span>
            <div class="grid grid-cols-2 gap-1 font-medium">
              <span class="flex items-center gap-1" :class="passwordCriteria.minLength ? 'text-emerald-600' : 'text-surface-400'">
                <i :class="passwordCriteria.minLength ? 'pi pi-check-circle' : 'pi pi-circle'" class="text-[9px]" />
                Mínimo 8 caracteres
              </span>
              <span class="flex items-center gap-1" :class="passwordCriteria.hasUpper ? 'text-emerald-600' : 'text-surface-400'">
                <i :class="passwordCriteria.hasUpper ? 'pi pi-check-circle' : 'pi pi-circle'" class="text-[9px]" />
                1 Mayúscula (A-Z)
              </span>
              <span class="flex items-center gap-1" :class="passwordCriteria.hasNumber ? 'text-emerald-600' : 'text-surface-400'">
                <i :class="passwordCriteria.hasNumber ? 'pi pi-check-circle' : 'pi pi-circle'" class="text-[9px]" />
                1 Número (0-9)
              </span>
              <span class="flex items-center gap-1" :class="passwordCriteria.hasSpecial ? 'text-emerald-600' : 'text-surface-400'">
                <i :class="passwordCriteria.hasSpecial ? 'pi pi-check-circle' : 'pi pi-circle'" class="text-[9px]" />
                1 Carácter especial (*!@#$)
              </span>
            </div>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="space-y-1.5">
          <label for="confirm-password" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
            Confirmar Contraseña <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <Password
              id="confirm-password"
              inputId="confirm-password-input"
              v-model="confirmPassword"
              required
              :feedback="false"
              toggleMask
              class="w-full !rounded-xl"
              inputClass="w-full !text-xs !py-2.5 !rounded-xl"
              placeholder="Repite la contraseña"
            />
          </div>
          <span v-if="confirmPassword && newPassword !== confirmPassword" class="text-[10px] text-rose-500 font-medium">
            Las contraseñas no coinciden
          </span>
        </div>

        <Button
          type="submit"
          :disabled="!resetToken || !isPasswordValid || newPassword !== confirmPassword"
          :loading="iamStore.isLoading"
          class="w-full font-bold !py-3 shadow-md shadow-emerald-500/20 !rounded-xl transition-all !text-xs"
          severity="success"
          :label="iamStore.isLoading ? t('iam.resetting') : t('iam.resetPasswordBtn')"
          icon="pi pi-check-circle"
          iconPos="right"
        />
      </form>

      <!-- Footer navigation link -->
      <div class="text-center text-xs text-surface-500 pt-3 border-t border-surface-100 dark:border-surface-800">
        <router-link to="/iam/sign-in" class="font-bold text-primary hover:underline inline-flex items-center gap-1">
          <i class="pi pi-arrow-left text-xs mr-1"></i>
          <span>{{ t('iam.signInLink') }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../application/iam.store'
import { PasswordResetCommand } from '../../domain/password-reset.command'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const iamStore = useIamStore()

const resetToken = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const accountEmail = ref('')

const passwordCriteria = computed(() => {
  const val = newPassword.value || ''
  return {
    minLength: val.length >= 8,
    hasUpper: /[A-Z]/.test(val),
    hasNumber: /[0-9]/.test(val),
    hasSpecial: /[@$!%*?&#^+=._-]/.test(val)
  }
})

const isPasswordValid = computed(() => {
  const c = passwordCriteria.value
  return c.minLength && c.hasUpper && c.hasNumber && c.hasSpecial
})

onMounted(() => {
  iamStore.successMessage = null
  iamStore.error = null

  if (route.query.token && typeof route.query.token === 'string') {
    resetToken.value = route.query.token
  }

  if (route.query.email && typeof route.query.email === 'string') {
    accountEmail.value = route.query.email
  }
})

const handlePasswordReset = async () => {
  iamStore.error = null

  if (!resetToken.value.trim()) {
    iamStore.error = 'Por favor ingrese el token de recuperación.'
    return
  }

  if (!isPasswordValid.value) {
    iamStore.error = 'La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, un número y un carácter especial.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    iamStore.error = 'Las contraseñas ingresadas no coinciden.'
    return
  }

  const command = new PasswordResetCommand({
    resetToken: resetToken.value.trim(),
    newPassword: newPassword.value.trim()
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
:deep(.p-password) {
  width: 100%;
}
:deep(.p-password-input) {
  width: 100%;
}
</style>

