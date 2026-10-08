<template>
  <div class="min-h-screen w-full flex bg-surface-50 dark:bg-surface-950 font-sans antialiased text-surface-900 dark:text-surface-100">
    <!-- Left Hero Column (Desktop only, 6 cols on lg / 7 cols on xl) -->
    <div
      class="hidden lg:flex lg:w-1/2 xl:w-7/12 relative flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-[#06122c] via-[#091a3e] to-[#040915] text-white overflow-hidden select-none"
    >
      <!-- Background Ambient Glow & Mesh -->
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <!-- Top Header / Brand -->
      <div class="relative z-10 flex items-center justify-between">
        <router-link to="/home" class="flex items-center space-x-3 group">
          <div
            class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform"
          >
            <i class="pi pi-car text-xl" />
          </div>
          <div>
            <span class="text-lg font-black tracking-wide text-white block leading-tight">SmartFinance</span>
            <span class="text-xs text-blue-300/80 font-medium tracking-widest uppercase">Drive Financial</span>
          </div>
        </router-link>

        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 border border-white/15 text-blue-200 backdrop-blur-md"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          API v1.0 • 109 Endpoints
        </span>
      </div>

      <!-- Center Hero FinTech Messaging & Interactive Cards -->
      <div class="relative z-10 my-auto py-8 max-w-xl space-y-8">
        <div class="space-y-4">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <i class="pi pi-bolt text-xs text-blue-400" />
            Fintech Automotriz B2B & B2C
          </div>

          <h1 class="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white leading-tight tracking-tight">
            Gestión inteligente de crédito vehicular y catálogo
          </h1>

          <p class="text-sm xl:text-base text-slate-300/90 leading-relaxed">
            Calcula cuotas con TCEA exacta, evalúa riesgo crediticio en tiempo real con motor de scoring SBS y gestiona inventario con trazabilidad completa.
          </p>
        </div>

        <!-- Glass Feature KPI Pills -->
        <div class="grid grid-cols-2 gap-3.5 pt-2">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1 hover:bg-white/10 transition-colors">
            <div class="flex items-center space-x-2 text-emerald-400 text-sm font-bold">
              <i class="pi pi-check-circle" />
              <span>TCEA Exacta</span>
            </div>
            <p class="text-xs text-slate-300">Cronogramas de pago en sistema francés y alemán con TIR y VAN.</p>
          </div>

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1 hover:bg-white/10 transition-colors">
            <div class="flex items-center space-x-2 text-purple-400 text-sm font-bold">
              <i class="pi pi-shield" />
              <span>Scoring Crediticio</span>
            </div>
            <p class="text-xs text-slate-300">Modelos de riesgo predictivo calibrados de 300 a 850 puntos.</p>
          </div>

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1 hover:bg-white/10 transition-colors">
            <div class="flex items-center space-x-2 text-sky-400 text-sm font-bold">
              <i class="pi pi-sparkles" />
              <span>Asesor IA Gemini</span>
            </div>
            <p class="text-xs text-slate-300">Consultas financieras instantáneas con recomendaciones personalizadas.</p>
          </div>

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1 hover:bg-white/10 transition-colors">
            <div class="flex items-center space-x-2 text-amber-400 text-sm font-bold">
              <i class="pi pi-building" />
              <span>Verificación B2B</span>
            </div>
            <p class="text-xs text-slate-300">Validación directa con SUNAT RUC y RENIEC DNI para concesionarios.</p>
          </div>
        </div>
      </div>

      <!-- Bottom Security & Trust Footer -->
      <div class="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <div class="flex items-center space-x-2">
          <i class="pi pi-lock text-emerald-400 text-sm" />
          <span>Encriptación SSL 256-bit • Autenticación JWT Stateless</span>
        </div>
        <span class="font-mono text-[11px] text-slate-500">Render Production</span>
      </div>
    </div>

    <!-- Right Form Column (Desktop 6 cols on lg / 5 cols on xl, Full width on mobile) -->
    <div class="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
      <!-- Top Navigation & Language Switcher -->
      <div class="flex items-center justify-between mb-8">
        <router-link
          to="/home"
          class="inline-flex items-center gap-2 text-xs font-semibold text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 transition-colors"
        >
          <i class="pi pi-arrow-left text-xs" />
          <span>Volver al inicio</span>
        </router-link>

        <LanguageSwitcher />
      </div>

      <!-- Center Form Card -->
      <div class="max-w-md w-full mx-auto my-auto space-y-6">
        <!-- Form Header -->
        <div class="space-y-2">
          <!-- Mobile Brand Logo -->
          <div class="lg:hidden flex items-center space-x-2.5 mb-4">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg shadow-md">
              <i class="pi pi-car" />
            </div>
            <div>
              <span class="text-base font-black text-surface-900 dark:text-surface-0 block leading-tight">SmartFinance</span>
              <span class="text-[10px] text-surface-500 dark:text-surface-400 font-semibold tracking-wider uppercase">Drive</span>
            </div>
          </div>

          <h2 class="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-surface-0 tracking-tight">
            {{ t('iam.signInTitle') }}
          </h2>
          <p class="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
            {{ t('iam.signInSubtitle') }}
          </p>
        </div>

        <!-- Error Message using PrimeVue Message Component -->
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

        <!-- Main Form -->
        <form class="space-y-4" @submit.prevent="handleSignIn">
          <!-- Email / Username Input -->
          <div class="space-y-1.5">
            <label for="username" class="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
              {{ t('iam.email') }}
            </label>
            <IconField class="w-full">
              <InputIcon class="pi pi-envelope text-surface-400" />
              <InputText
                id="username"
                v-model="username"
                type="email"
                required
                autocomplete="email"
                class="w-full"
                :placeholder="t('iam.emailPlaceholder')"
                size="large"
              />
            </IconField>
          </div>

          <!-- Password Input with Toggle Mask -->
          <div class="space-y-1.5">
            <div class="flex justify-between items-center">
              <label for="password" class="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                {{ t('iam.password') }}
              </label>
              <router-link
                to="/iam/forgot-password"
                class="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                {{ t('iam.forgotPasswordLink') }}
              </router-link>
            </div>
            <Password
              id="password"
              v-model="password"
              :feedback="false"
              toggleMask
              required
              autocomplete="current-password"
              class="w-full"
              inputClass="w-full"
              :placeholder="t('iam.passwordPlaceholder')"
              size="large"
            />
          </div>

          <!-- Remember Me Checkbox -->
          <div class="flex items-center justify-between pt-1">
            <div class="flex items-center gap-2">
              <Checkbox
                v-model="rememberMe"
                :binary="true"
                inputId="remember-me"
              />
              <label
                for="remember-me"
                class="text-xs text-surface-600 dark:text-surface-400 cursor-pointer select-none font-medium"
              >
                Recordar mi sesión
              </label>
            </div>
          </div>

          <!-- PrimeVue Primary Submit Button -->
          <Button
            type="submit"
            :loading="iamStore.isLoading"
            :label="iamStore.isLoading ? t('iam.signingIn') : t('iam.signInBtn')"
            icon="pi pi-sign-in"
            iconPos="right"
            severity="primary"
            class="w-full shadow-lg shadow-blue-600/20 font-bold"
            size="large"
          />
        </form>

        <!-- PrimeVue Divider -->
        <Divider align="center" class="my-6">
          <span class="text-[11px] text-surface-400 dark:text-surface-500 font-bold uppercase tracking-wider">
            O continuar con
          </span>
        </Divider>

        <!-- Social & Quick Action Buttons with PrimeVue -->
        <div class="space-y-2.5">
          <!-- Google OAuth Button -->
          <Button
            type="button"
            @click="handleGoogleSignIn"
            :disabled="iamStore.isLoading"
            severity="secondary"
            variant="outlined"
            class="w-full font-semibold border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800"
            size="large"
          >
            <i class="pi pi-google text-red-500 text-base mr-2" />
            <span>{{ t('iam.googleSignIn') }}</span>
          </Button>

          <!-- Quick Demo Access Button -->
          <Button
            type="button"
            @click="handleQuickDemoSignIn"
            :disabled="iamStore.isLoading"
            severity="info"
            variant="outlined"
            class="w-full font-semibold border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40"
          >
            <i class="pi pi-bolt text-amber-500 mr-2" />
            <span>{{ t('iam.demoLoginBtn') }}</span>
          </Button>
        </div>

        <!-- Sign Up Redirection Footer -->
        <div class="text-center text-xs text-surface-600 dark:text-surface-400 pt-4 border-t border-surface-100 dark:border-surface-800">
          <span>{{ t('iam.noAccount') }} </span>
          <router-link
            to="/iam/sign-up"
            class="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
          >
            {{ t('iam.signUpLink') }}
          </router-link>
        </div>
      </div>

      <!-- Mobile Bottom Footer -->
      <div class="text-center text-[11px] text-surface-400 dark:text-surface-500 mt-8">
        SmartFinance Drive © {{ new Date().getFullYear() }} • Plataforma Financiera Vehicular
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

import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'

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
:deep(.p-password) {
  width: 100%;
}
:deep(.p-password-input) {
  width: 100%;
}
</style>
