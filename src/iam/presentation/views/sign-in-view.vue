<template>
  <div class="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-center lg:justify-between p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 font-sans antialiased select-none overflow-y-auto">
    <!-- Full-Screen Video Background (Pure 1080p, no blur, fills entire screen) -->
    <video
      autoplay
      loop
      muted
      playsinline
      class="fixed inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
    >
      <source :src="heroVideoWebm" type="video/webm" />
      <source :src="heroVideoMp4" type="video/mp4" />
    </video>

    <!-- Subtle atmospheric tint to preserve video clarity while guaranteeing contrast -->
    <div class="fixed inset-0 z-0 bg-black/40 pointer-events-none" />

    <!-- Left Side Hero (Desktop only: Pure application brand and tagline over video) -->
    <div class="hidden lg:flex flex-col justify-center z-10 max-w-lg xl:max-w-xl pl-4 xl:pl-8 text-white select-none">
      <router-link
        to="/home"
        class="inline-flex items-center space-x-3.5 mb-6 group"
      >
        <div
          class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md p-1.5 flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform border border-white/20"
        >
          <img src="/logo-white.svg" alt="SmartFinance Logo" class="w-full h-full object-contain" />
        </div>
        <div>
          <span class="text-2xl font-black tracking-wide block leading-none text-white drop-shadow-md">SmartFinance</span>
          <span class="text-xs text-primary-300 font-bold tracking-widest uppercase drop-shadow">Drive</span>
        </div>
      </router-link>

      <h1 class="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white mb-3 drop-shadow-md">
        Plataforma Inteligente de Crédito Automotriz
      </h1>
      <p class="text-sm xl:text-base text-surface-200 leading-relaxed font-normal max-w-md drop-shadow">
        Simula tus cuotas en segundos, evalúa opciones de financiamiento y gestiona tus vehículos de manera ágil y transparente.
      </p>
    </div>

    <!-- Floating Minimalist Form Capsule (Encimado al video, Light Theme Blanco acorde al tema) -->
    <div
      class="relative z-10 w-full max-w-md my-auto bg-surface-0/95 backdrop-blur-2xl rounded-3xl border border-surface-200/80 shadow-2xl shadow-black/40 p-5 sm:p-8 lg:p-10 flex flex-col justify-between text-surface-800 transition-all"
    >
      <!-- Top Navigation Bar -->
      <div class="flex items-center justify-between mb-5">
        <router-link
          to="/home"
          class="inline-flex items-center gap-2 text-xs font-semibold text-surface-500 hover:text-surface-900 transition-colors"
        >
          <i class="pi pi-arrow-left text-xs" />
          <span>Volver al inicio</span>
        </router-link>

        <LanguageSwitcher />
      </div>

      <!-- Center Form Content -->
      <div class="space-y-4 sm:space-y-5">
        <!-- Form Header -->
        <div class="space-y-1.5">
          <!-- Mobile Brand Logo -->
          <div class="lg:hidden flex items-center space-x-2.5 mb-3">
            <div class="w-10 h-10 rounded-xl bg-surface-100 p-1 flex items-center justify-center shadow-xs border border-surface-200">
              <img src="/logo.svg" alt="SmartFinance Logo" class="w-full h-full object-contain" />
            </div>
            <div>
              <span class="text-base font-black text-surface-900 block leading-tight">SmartFinance</span>
              <span class="text-[10px] text-primary font-bold tracking-wider uppercase">Drive</span>
            </div>
          </div>

          <h2 class="text-2xl font-black text-surface-900 tracking-tight">
            {{ t('iam.signInTitle') }}
          </h2>
          <p class="text-xs text-surface-500 leading-relaxed">
            {{ t('iam.signInSubtitle') }}
          </p>
        </div>

        <!-- PrimeVue Error Message -->
        <Message
          v-if="iamStore.error"
          severity="error"
          :closable="false"
          class="w-full shadow-xs"
        >
          <div class="flex items-center gap-2 text-xs font-medium">
            <span>{{ iamStore.error }}</span>
          </div>
        </Message>

        <!-- PrimeVue Fluid Responsive Form -->
        <Fluid>
          <form class="space-y-4" @submit.prevent="handleSignIn">
            <!-- Email Input -->
            <div class="space-y-1.5">
              <label for="username" class="block text-[11px] font-bold text-surface-700 uppercase tracking-wider">
                {{ t('iam.email') }}
              </label>
              <IconField class="w-full">
                <InputIcon class="pi pi-envelope text-surface-400 text-xs" />
                <InputText
                  id="username"
                  v-model="username"
                  type="email"
                  required
                  autocomplete="email"
                  fluid
                  :placeholder="t('iam.emailPlaceholder')"
                />
              </IconField>
            </div>

            <!-- Password Input -->
            <div class="space-y-1.5">
              <label for="password" class="block text-[11px] font-bold text-surface-700 uppercase tracking-wider">
                {{ t('iam.password') }}
              </label>
              <Password
                id="password"
                v-model="password"
                :feedback="false"
                toggleMask
                required
                autocomplete="current-password"
                fluid
                :placeholder="t('iam.passwordPlaceholder')"
              />
            </div>

            <!-- Remember Me & Forgot Password Responsive Row -->
            <div class="flex flex-wrap items-center justify-between gap-2 pt-0.5">
              <div class="flex items-center gap-2">
                <Checkbox
                  v-model="rememberMe"
                  :binary="true"
                  inputId="remember-me"
                />
                <label
                  for="remember-me"
                  class="text-xs text-surface-600 cursor-pointer select-none font-medium"
                >
                  Recordar mi sesión
                </label>
              </div>

              <router-link
                to="/iam/forgot-password"
                class="text-xs font-semibold text-primary hover:text-primary-emphasis hover:underline transition-colors"
              >
                {{ t('iam.forgotPasswordLink') }}
              </router-link>
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              :loading="iamStore.isLoading"
              :label="iamStore.isLoading ? t('iam.signingIn') : t('iam.signInBtn')"
              icon="pi pi-sign-in"
              iconPos="right"
              severity="primary"
              fluid
              class="font-bold shadow-md shadow-primary/20 !rounded-xl !py-2.5 transition-all"
            />
          </form>
        </Fluid>

        <!-- PrimeVue Divider -->
        <Divider align="center" class="my-3">
          <span class="text-[10px] text-surface-400 font-bold uppercase tracking-wider">
            O continuar con
          </span>
        </Divider>

        <!-- Alternative Auth Buttons (Responsive Grid) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <!-- Google Button -->
          <Button
            type="button"
            @click="handleGoogleSignIn"
            :disabled="iamStore.isLoading"
            severity="secondary"
            variant="outlined"
            fluid
            class="font-medium text-xs !rounded-xl !py-2.5 shadow-xs transition-all justify-center"
          >
            <i class="pi pi-google mr-2" />
            <span class="truncate">{{ t('iam.googleSignIn') }}</span>
          </Button>

          <!-- Quick Demo Button -->
          <Button
            type="button"
            @click="handleQuickDemoSignIn"
            :disabled="iamStore.isLoading"
            severity="info"
            variant="outlined"
            fluid
            class="font-medium text-xs !rounded-xl !py-2.5 transition-all justify-center"
          >
            <i class="pi pi-bolt mr-2" />
            <span class="truncate">{{ t('iam.demoLoginBtn') }}</span>
          </Button>
        </div>

        <!-- Sign Up Link -->
        <div class="text-center text-xs text-surface-500 pt-2 border-t border-surface-200">
          <span>{{ t('iam.noAccount') }} </span>
          <router-link
            to="/iam/sign-up"
            class="font-bold text-primary hover:text-primary-emphasis hover:underline transition-colors inline-flex items-center gap-1"
          >
            <span>{{ t('iam.signUpLink') }}</span>
            <i class="pi pi-arrow-right text-[10px]" />
          </router-link>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-[10px] text-surface-400 mt-5 pt-2">
        SmartFinance Drive © {{ new Date().getFullYear() }} • Sistema Financiero Vehicular
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../application/iam.store'
import { SignInCommand } from '../../domain/sign-in.command'

// PrimeVue Components
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
import Divider from 'primevue/divider'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Fluid from 'primevue/fluid'

import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'
import heroVideoWebm from '@/assets/7154229-hd_1920_1080_25fps.webm'
import heroVideoMp4 from '@/assets/7154229-hd_1920_1080_25fps.mp4'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const iamStore = useIamStore()

const username = ref('')
const password = ref('')
const rememberMe = ref(true)

const STORAGE_REMEMBERED_EMAIL = 'smartfinance_remembered_username'

onMounted(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_REMEMBERED_EMAIL)
    if (saved) {
      username.value = saved
      rememberMe.value = true
    }
  }
})

const handleSignIn = async () => {
  if (rememberMe.value && typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_REMEMBERED_EMAIL, username.value)
  } else if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_REMEMBERED_EMAIL)
  }

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
  const demoIdToken = 'google_oauth_demo_token_' + Date.now()
  const success = await iamStore.signInWithGoogle(demoIdToken)
  if (success) {
    const redirectPath = (route.query.redirect as string) || '/home'
    router.push(redirectPath)
  }
}
</script>

<style scoped>
:deep(.p-fluid),
:deep(.p-fluid .p-component) {
  width: 100%;
}
:deep(.p-password) {
  width: 100%;
}
:deep(.p-password-input) {
  width: 100%;
}
</style>
