<template>
  <div class="min-h-screen w-full flex flex-col lg:flex-row bg-surface-100 dark:bg-surface-950 font-sans antialiased text-surface-900 dark:text-surface-100 overflow-x-hidden">
    <!-- Left Column: Full-bleed Edge-to-Edge Video Panel (NOT floating, flush with viewport) -->
    <div
      class="hidden lg:block lg:w-1/2 xl:w-7/12 relative h-screen bg-black select-none shrink-0"
    >
      <!-- Pure 1080p Video (No blur filter, crisp clarity, full bleed) -->
      <video
        autoplay
        loop
        muted
        playsinline
        class="w-full h-full object-cover object-center"
      >
        <source :src="heroVideoWebm" type="video/webm" />
        <source :src="heroVideoMp4" type="video/mp4" />
      </video>

      <!-- Minimalist Brand Overlay (Only the application name) -->
      <router-link
        to="/home"
        class="absolute top-8 left-8 z-10 flex items-center space-x-3 px-4 py-2.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 text-white shadow-xl hover:bg-black/60 transition-all group"
      >
        <div
          class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 flex items-center justify-center text-white text-base shadow-md group-hover:scale-105 transition-transform"
        >
          <i class="pi pi-car" />
        </div>
        <div>
          <span class="text-sm font-black tracking-wide block leading-none text-white">SmartFinance</span>
          <span class="text-[10px] text-blue-300/90 font-medium tracking-widest uppercase">Drive</span>
        </div>
      </router-link>
    </div>

    <!-- Right Column: Container with Floating Minimalist Form Card -->
    <div class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 xl:p-14 min-h-screen">
      <!-- Floating Form Capsule (Elevated, rounded-3xl, shadow-2xl) -->
      <div
        class="w-full max-w-md bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200/80 dark:border-surface-800 shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between transition-all"
      >
        <!-- Top Navigation Bar -->
        <div class="flex items-center justify-between mb-6">
          <router-link
            to="/home"
            class="inline-flex items-center gap-2 text-xs font-semibold text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 transition-colors"
          >
            <i class="pi pi-arrow-left text-xs" />
            <span>Volver al inicio</span>
          </router-link>

          <LanguageSwitcher />
        </div>

        <!-- Center Form Area -->
        <div class="space-y-5">
          <!-- Form Header -->
          <div class="space-y-1.5">
            <!-- Mobile Brand Logo -->
            <div class="lg:hidden flex items-center space-x-2.5 mb-4">
              <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-base shadow-md">
                <i class="pi pi-car" />
              </div>
              <div>
                <span class="text-base font-black text-surface-900 dark:text-surface-0 block leading-tight">SmartFinance</span>
                <span class="text-[10px] text-surface-500 dark:text-surface-400 font-semibold tracking-wider uppercase">Drive</span>
              </div>
            </div>

            <h2 class="text-2xl font-black text-surface-900 dark:text-surface-0 tracking-tight">
              {{ t('iam.signInTitle') }}
            </h2>
            <p class="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
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
            <div class="space-y-1">
              <label for="username" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
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
                  class="w-full"
                  :placeholder="t('iam.emailPlaceholder')"
                />
              </IconField>
            </div>

            <!-- Password Input -->
            <div class="space-y-1">
              <div class="flex justify-between items-center">
                <label for="password" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                  {{ t('iam.password') }}
                </label>
                <router-link
                  to="/iam/forgot-password"
                  class="text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
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
                  class="text-xs text-surface-600 dark:text-surface-400 cursor-pointer select-none font-medium"
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
              class="w-full font-bold shadow-md shadow-blue-600/20"
            />
          </form>

          <!-- PrimeVue Divider -->
          <Divider align="center" class="my-3">
            <span class="text-[10px] text-surface-400 dark:text-surface-500 font-bold uppercase tracking-wider">
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
              class="w-full font-medium text-xs border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800"
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
              class="w-full font-medium text-xs border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40"
            >
              <i class="pi pi-bolt text-amber-500 mr-2" />
              <span>{{ t('iam.demoLoginBtn') }}</span>
            </Button>
          </div>

          <!-- Sign Up Link -->
          <div class="text-center text-xs text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-100 dark:border-surface-800">
            <span>{{ t('iam.noAccount') }} </span>
            <router-link
              to="/iam/sign-up"
              class="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              {{ t('iam.signUpLink') }}
            </router-link>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-[10px] text-surface-400 dark:text-surface-500 mt-6 pt-2">
          SmartFinance Drive © {{ new Date().getFullYear() }} • Sistema Financiero Vehicular
        </div>
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
