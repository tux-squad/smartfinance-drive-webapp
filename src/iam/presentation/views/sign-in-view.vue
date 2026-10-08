<template>
  <div class="relative min-h-screen w-full flex items-center justify-center lg:justify-end p-4 sm:p-6 lg:p-12 xl:p-20 font-sans antialiased select-none overflow-hidden">
    <!-- Full-Screen Video Background (Pure 1080p, no blur, fills entire screen) -->
    <video
      autoplay
      loop
      muted
      playsinline
      class="fixed inset-0 w-full h-full object-cover object-center z-0"
    >
      <source :src="heroVideoWebm" type="video/webm" />
      <source :src="heroVideoMp4" type="video/mp4" />
    </video>

    <!-- Subtle atmospheric tint to preserve video clarity while guaranteeing contrast -->
    <div class="fixed inset-0 z-0 bg-black/30 pointer-events-none" />

    <!-- Minimalist Brand Logo (Floating top-left over the video) -->
    <router-link
      to="/home"
      class="fixed top-6 left-6 sm:top-8 sm:left-8 z-20 flex items-center space-x-3 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 text-slate-900 shadow-xl hover:bg-white hover:scale-[1.02] transition-all group"
    >
      <div
        class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white text-base shadow-md group-hover:scale-105 transition-transform"
      >
        <i class="pi pi-car" />
      </div>
      <div>
        <span class="text-sm font-black tracking-wide block leading-none text-slate-900">SmartFinance</span>
        <span class="text-[10px] text-blue-600 font-bold tracking-widest uppercase">Drive</span>
      </div>
    </router-link>

    <!-- Floating Minimalist Form Capsule (Encimado al video, Light Theme Blanco, Glassmorphism elegante) -->
    <div
      class="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-2xl shadow-black/40 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-slate-800 transition-all"
    >
      <!-- Top Navigation Bar -->
      <div class="flex items-center justify-between mb-6">
        <router-link
          to="/home"
          class="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <i class="pi pi-arrow-left text-xs" />
          <span>Volver al inicio</span>
        </router-link>

        <LanguageSwitcher />
      </div>

      <!-- Center Form Content -->
      <div class="space-y-5">
        <!-- Form Header -->
        <div class="space-y-1.5">
          <!-- Mobile Brand Logo -->
          <div class="lg:hidden flex items-center space-x-2.5 mb-4">
            <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-base shadow-md">
              <i class="pi pi-car" />
            </div>
            <div>
              <span class="text-base font-black text-slate-900 block leading-tight">SmartFinance</span>
              <span class="text-[10px] text-blue-600 font-bold tracking-wider uppercase">Drive</span>
            </div>
          </div>

          <h2 class="text-2xl font-black text-slate-900 tracking-tight">
            {{ t('iam.signInTitle') }}
          </h2>
          <p class="text-xs text-slate-500 leading-relaxed">
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

        <!-- Sign-In Form -->
        <form class="space-y-4" @submit.prevent="handleSignIn">
          <!-- Email Input -->
          <div class="space-y-1.5">
            <label for="username" class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              {{ t('iam.email') }}
            </label>
            <IconField class="w-full">
              <InputIcon class="pi pi-envelope text-slate-400 text-xs" />
              <InputText
                id="username"
                v-model="username"
                type="email"
                required
                autocomplete="email"
                class="w-full !bg-slate-50 hover:!bg-white focus:!bg-white !border-slate-200 focus:!border-blue-500 !text-slate-900 placeholder:!text-slate-400 !rounded-xl"
                :placeholder="t('iam.emailPlaceholder')"
              />
            </IconField>
          </div>

          <!-- Password Input -->
          <div class="space-y-1.5">
            <div class="flex justify-between items-center">
              <label for="password" class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                {{ t('iam.password') }}
              </label>
              <router-link
                to="/iam/forgot-password"
                class="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
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
              inputClass="w-full !bg-slate-50 hover:!bg-white focus:!bg-white !border-slate-200 focus:!border-blue-500 !text-slate-900 placeholder:!text-slate-400 !rounded-xl"
              :placeholder="t('iam.passwordPlaceholder')"
            />
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between pt-0.5">
            <div class="flex items-center gap-2">
              <Checkbox
                v-model="rememberMe"
                :binary="true"
                inputId="remember-me"
              />
              <label
                for="remember-me"
                class="text-xs text-slate-600 cursor-pointer select-none font-medium"
              >
                Recordar mi sesión
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            :loading="iamStore.isLoading"
            :label="iamStore.isLoading ? t('iam.signingIn') : t('iam.signInBtn')"
            icon="pi pi-sign-in"
            iconPos="right"
            severity="primary"
            class="w-full font-bold shadow-lg shadow-blue-600/25 !bg-blue-600 hover:!bg-blue-700 !text-white !border-none !rounded-xl !py-2.5 transition-all"
          />
        </form>

        <!-- PrimeVue Divider -->
        <Divider align="center" class="my-3 !border-slate-200">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            O continuar con
          </span>
        </Divider>

        <!-- Alternative Auth Buttons -->
        <div class="space-y-2">
          <!-- Google Button -->
          <Button
            type="button"
            @click="handleGoogleSignIn"
            :disabled="iamStore.isLoading"
            severity="secondary"
            variant="outlined"
            class="w-full font-medium text-xs !bg-white hover:!bg-slate-50 !border-slate-200 !text-slate-700 !rounded-xl !py-2 shadow-xs transition-all"
          >
            <i class="pi pi-google text-red-500 mr-2" />
            <span>{{ t('iam.googleSignIn') }}</span>
          </Button>

          <!-- Quick Demo Button -->
          <Button
            type="button"
            @click="handleQuickDemoSignIn"
            :disabled="iamStore.isLoading"
            severity="info"
            variant="outlined"
            class="w-full font-medium text-xs !bg-sky-50/70 hover:!bg-sky-100/70 !border-sky-200 !text-sky-700 !rounded-xl !py-2 transition-all"
          >
            <i class="pi pi-bolt text-amber-500 mr-2" />
            <span>{{ t('iam.demoLoginBtn') }}</span>
          </Button>
        </div>

        <!-- Sign Up Link -->
        <div class="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>{{ t('iam.noAccount') }} </span>
          <router-link
            to="/iam/sign-up"
            class="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-1"
          >
            <span>{{ t('iam.signUpLink') }}</span>
            <i class="pi pi-arrow-right text-[10px]" />
          </router-link>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-[10px] text-slate-400 mt-6 pt-2">
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
:deep(.p-password) {
  width: 100%;
}
:deep(.p-password-input) {
  width: 100%;
}
</style>
