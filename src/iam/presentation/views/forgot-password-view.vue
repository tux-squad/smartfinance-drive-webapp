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
          <div class="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-white/10 p-1.5 flex items-center justify-center border border-blue-600/20 dark:border-white/10 group-hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="SmartFinance Logo" class="w-full h-full object-contain dark:hidden" />
            <img src="/logo-white.svg" alt="SmartFinance Logo" class="w-full h-full object-contain hidden dark:block" />
          </div>
          <div class="text-left">
            <span class="text-base font-black tracking-wide block leading-none text-surface-900 dark:text-surface-0">SmartFinance</span>
            <span class="text-[10px] text-primary-600 dark:text-primary-400 font-bold tracking-widest uppercase">Drive</span>
          </div>
        </router-link>

        <h2 class="text-2xl font-black text-surface-900 dark:text-surface-0 tracking-tight">
          {{ t('iam.forgotPasswordTitle') }}
        </h2>
        <p class="text-xs text-surface-500 max-w-sm mx-auto">
          {{ t('iam.forgotPasswordSubtitle') }}
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
      <form class="space-y-4" @submit.prevent="handlePasswordRecovery">
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label for="recovery-username" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
              {{ t('iam.email') }} <span class="text-rose-500">*</span>
            </label>
            <span v-if="username && isEmailValid" class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <i class="pi pi-check text-[10px]" /> Formato válido
            </span>
            <span v-else-if="username && !isEmailValid" class="text-[10px] text-rose-500 font-medium">
              Correo inválido
            </span>
          </div>

          <div class="relative">
            <i class="pi pi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs pointer-events-none z-10"></i>
            <InputText
              id="recovery-username"
              v-model="username"
              type="email"
              required
              :class="[
                'w-full !pl-9 !py-2.5 !text-xs !rounded-xl transition-all',
                username && !isEmailValid ? '!border-rose-400 focus:!ring-rose-400' : ''
              ]"
              :placeholder="t('iam.emailPlaceholder')"
            />
          </div>
        </div>

        <Button
          type="submit"
          :disabled="!username || !isEmailValid"
          :loading="iamStore.isLoading"
          class="w-full font-bold !py-3 shadow-md shadow-primary/20 !rounded-xl transition-all !text-xs"
          severity="primary"
          :label="iamStore.isLoading ? t('iam.sending') : t('iam.sendRecoveryBtn')"
          icon="pi pi-send"
          iconPos="right"
        />
      </form>

      <!-- Footer navigation links -->
      <div class="text-center text-xs text-surface-500 pt-3 border-t border-surface-100 dark:border-surface-800 flex items-center justify-center">
        <router-link to="/iam/sign-in" class="font-bold text-primary hover:underline inline-flex items-center gap-1">
          <i class="pi pi-arrow-left text-xs"></i>
          <span>Volver al Inicio de Sesión</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../application/iam.store'
import { PasswordRecoveryCommand } from '../../domain/password-recovery.command'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'

const { t } = useI18n()
const iamStore = useIamStore()
const username = ref('')

const isEmailValid = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(username.value.trim())
})

onMounted(() => {
  iamStore.successMessage = null
  iamStore.error = null
})

const handlePasswordRecovery = async () => {
  if (!username.value || !isEmailValid.value) {
    iamStore.error = 'Por favor ingrese un correo electrónico válido.'
    return
  }
  const command = new PasswordRecoveryCommand({ username: username.value.trim() })
  await iamStore.requestPasswordRecovery(command)
}
</script>

<style scoped>
</style>

