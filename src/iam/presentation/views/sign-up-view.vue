<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-surface-800 dark:text-surface-100 overflow-y-auto">
    <div class="max-w-lg w-full space-y-6 bg-surface-0 dark:bg-surface-900 p-6 sm:p-8 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xl">
      <!-- Form Header -->
      <div class="text-center space-y-2">
        <router-link to="/home" class="inline-flex items-center space-x-2.5 text-primary font-bold mb-1">
          <div class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 p-1 flex items-center justify-center shadow-xs border border-surface-200 dark:border-surface-700">
            <img src="/logo.svg" alt="SmartFinance Logo" class="w-full h-full object-contain dark:hidden" />
            <img src="/logo-white.svg" alt="SmartFinance Logo" class="w-full h-full object-contain hidden dark:block" />
          </div>
          <span class="text-xl font-black text-surface-900 dark:text-surface-0">SmartFinance Drive</span>
        </router-link>
        <h2 class="text-2xl font-black text-surface-900 dark:text-surface-0 tracking-tight">
          {{ t('iam.signUpTitle') }}
        </h2>
        <p class="text-xs text-surface-500">
          {{ t('iam.signUpSubtitle') }}
        </p>
      </div>

      <!-- Success Alert -->
      <Message v-if="successMessage || iamStore.successMessage" severity="success" :closable="false" class="w-full text-xs">
        {{ successMessage || iamStore.successMessage }}
      </Message>

      <!-- Error Alert -->
      <Message v-if="iamStore.error" severity="error" :closable="false" class="w-full text-xs">
        {{ iamStore.error }}
      </Message>

      <!-- Form Inputs -->
      <Fluid>
        <form class="space-y-4" @submit.prevent="handleSignUp">
          <!-- Step 1: DNI RENIEC Lookup -->
          <div class="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 space-y-2.5">
            <div class="flex items-center justify-between">
              <label for="reg-dni" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                Documento de Identidad (DNI)
              </label>
              <span class="text-[10px] text-primary font-semibold">Validación RENIEC</span>
            </div>

            <div class="flex gap-2">
              <IconField class="flex-1">
                <InputIcon class="pi pi-id-card text-surface-400 text-xs" />
                <InputText
                  id="reg-dni"
                  v-model="dni"
                  maxlength="8"
                  placeholder="Ingrese 8 dígitos de su DNI"
                  class="w-full"
                  fluid
                />
              </IconField>
              <Button
                type="button"
                severity="secondary"
                variant="outlined"
                :loading="iamStore.isLookingUpDni"
                :disabled="dni.length !== 8"
                @click="searchDni"
                v-tooltip.top="'Consultar nombres en RENIEC'"
              >
                <i class="pi pi-search" />
              </Button>
            </div>

            <!-- RENIEC Verified Result Card -->
            <div
              v-if="iamStore.reniecData"
              class="p-2.5 rounded-xl bg-primary-50/70 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 text-xs space-y-1"
            >
              <div class="flex items-center gap-1.5 font-bold text-primary">
                <i class="pi pi-check-circle text-xs" />
                <span>{{ iamStore.reniecData.fullLegalName }}</span>
              </div>
              <p v-if="iamStore.reniecData.district" class="text-[10px] text-surface-500">
                {{ iamStore.reniecData.district }}, {{ iamStore.reniecData.province }} - {{ iamStore.reniecData.department }}
              </p>
            </div>
          </div>

          <!-- Step 2: Email & Verification OTP -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="reg-username" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                {{ t('iam.email') }}
              </label>
              <span v-if="iamStore.emailVerified" class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <i class="pi pi-check" /> Verificado
              </span>
            </div>

            <div class="flex gap-2">
              <IconField class="flex-1">
                <InputIcon class="pi pi-envelope text-surface-400 text-xs" />
                <InputText
                  id="reg-username"
                  v-model="username"
                  type="email"
                  required
                  fluid
                  :placeholder="t('iam.emailPlaceholder')"
                />
              </IconField>
              <Button
                type="button"
                severity="secondary"
                variant="outlined"
                :disabled="!username || otpCooldown > 0 || iamStore.emailVerified"
                :loading="iamStore.isLoading && !iamStore.isVerifyingOtp"
                @click="sendOtp"
                class="text-xs shrink-0"
              >
                {{ otpCooldown > 0 ? `${otpCooldown}s` : (iamStore.emailVerified ? 'Verificado' : 'Enviar OTP') }}
              </Button>
            </div>

            <!-- OTP Code Verification Input -->
            <div v-if="otpSent && !iamStore.emailVerified" class="p-3 rounded-2xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 space-y-2">
              <span class="text-[11px] text-surface-600 dark:text-surface-300 block">
                Ingrese el código de 6 dígitos enviado a su correo:
              </span>
              <div class="flex gap-2">
                <InputText
                  v-model="otpCode"
                  maxlength="6"
                  placeholder="Ej: 849201"
                  fluid
                  class="font-mono text-center tracking-widest text-sm"
                />
                <Button
                  type="button"
                  severity="primary"
                  :disabled="otpCode.length !== 6"
                  :loading="iamStore.isVerifyingOtp"
                  @click="confirmOtp"
                  class="text-xs shrink-0"
                  label="Validar"
                />
              </div>
            </div>
          </div>

          <!-- Step 2.5: Phone Verification (Firebase SMS Auth) -->
          <div class="space-y-3 p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
            <div class="flex items-center justify-between">
              <label for="reg-phone" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                Verificación Telefónica (SMS Firebase)
              </label>
              <span v-if="iamStore.phoneVerified" class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <i class="pi pi-check" /> Verificado
              </span>
            </div>

            <!-- Invisible reCAPTCHA container for Firebase Phone Auth -->
            <div id="recaptcha-phone-container" class="hidden"></div>

            <div class="flex gap-2">
              <IconField class="flex-1">
                <InputIcon class="pi pi-phone text-surface-400 text-xs" />
                <InputText
                  id="reg-phone"
                  v-model="phoneNumber"
                  placeholder="+51 987 654 321"
                  :disabled="iamStore.phoneVerified"
                  fluid
                />
              </IconField>
              <Button
                type="button"
                severity="secondary"
                variant="outlined"
                :disabled="!phoneNumber || smsCooldown > 0 || iamStore.phoneVerified"
                :loading="iamStore.isLoading && !iamStore.isVerifyingOtp"
                @click="handleSendSms"
                class="text-xs shrink-0"
              >
                {{ smsCooldown > 0 ? `${smsCooldown}s` : (iamStore.phoneVerified ? 'Verificado' : 'Enviar SMS') }}
              </Button>
            </div>

            <!-- SMS Code Verification Input -->
            <div v-if="smsSent && !iamStore.phoneVerified" class="p-3 rounded-2xl bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 space-y-2">
              <span class="text-[11px] text-surface-600 dark:text-surface-300 block">
                Ingrese el código de 6 dígitos recibido por SMS:
              </span>
              <div class="flex gap-2">
                <InputText
                  v-model="phoneSmsCode"
                  maxlength="6"
                  placeholder="Ej: 123456"
                  fluid
                  class="font-mono text-center tracking-widest text-sm"
                />
                <Button
                  type="button"
                  severity="primary"
                  :disabled="phoneSmsCode.length !== 6"
                  :loading="iamStore.isVerifyingOtp"
                  @click="handleVerifySms"
                  class="text-xs shrink-0"
                  label="Validar SMS"
                />
              </div>
            </div>

            <!-- Fallback manual token toggle -->
            <div v-if="!iamStore.phoneVerified" class="pt-1">
              <button
                type="button"
                @click="manualTokenPrompt = !manualTokenPrompt"
                class="text-[10px] text-surface-500 hover:text-primary transition-colors underline"
              >
                {{ manualTokenPrompt ? 'Ocultar ingreso manual' : '¿Ya cuentas con un Firebase ID Token? Ingresar manualmente' }}
              </button>

              <div v-if="manualTokenPrompt" class="mt-2 flex gap-2">
                <InputText
                  v-model="phoneFirebaseToken"
                  placeholder="Pegar Firebase ID Token..."
                  fluid
                  class="font-mono text-[11px]"
                />
                <Button
                  type="button"
                  severity="secondary"
                  :disabled="!phoneFirebaseToken"
                  :loading="iamStore.isLoading"
                  @click="confirmPhoneToken"
                  class="text-xs shrink-0"
                  label="Validar Token"
                />
              </div>
            </div>
          </div>

          <!-- Step 3: Password -->
          <div class="space-y-1.5">
            <label for="reg-password" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
              {{ t('iam.password') }}
            </label>
            <Password
              id="reg-password"
              v-model="password"
              required
              toggleMask
              fluid
              :placeholder="t('iam.passwordPlaceholder')"
            />
            <span class="text-[10px] text-surface-500 font-medium flex items-center gap-1">
              <i class="pi pi-info-circle text-[10px]" />
              <span>{{ t('iam.passwordHelp') }}</span>
            </span>
          </div>

          <!-- Quick Fill Demo Button -->
          <div class="flex justify-end pt-1">
            <button
              type="button"
              @click="fillDemoData"
              class="text-xs text-primary hover:underline font-semibold flex items-center space-x-1"
            >
              <i class="pi pi-sparkles text-xs"></i>
              <span>{{ t('iam.fillDemoBtn') }}</span>
            </button>
          </div>

          <!-- Informative note about Dealer / Financial Partner elevation -->
          <div class="p-3 bg-surface-50 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 flex items-start space-x-2 text-xs text-surface-600 dark:text-surface-400">
            <i class="pi pi-info-circle text-primary mt-0.5 shrink-0"></i>
            <span>{{ t('iam.dealerNotice') }}</span>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            :loading="iamStore.isLoading"
            :label="iamStore.isLoading ? t('iam.registering') : t('iam.signUpBtn')"
            icon="pi pi-user-plus"
            iconPos="right"
            severity="primary"
            fluid
            class="font-bold !py-2.5 shadow-md shadow-primary/20 rounded-xl transition-all"
          />
        </form>
      </Fluid>

      <!-- Footer navigation link -->
      <div class="text-center text-xs text-surface-500 pt-2 border-t border-surface-100 dark:border-surface-800">
        {{ t('iam.hasAccount') }}
        <router-link to="/iam/sign-in" class="font-bold text-primary hover:underline ml-1">
          {{ t('iam.signInLink') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../application/iam.store'
import { SignUpCommand } from '../../domain/sign-up.command'
import { firebasePhoneAuthService } from '@/iam/infrastructure/firebase-phone-auth.service'

// PrimeVue Components
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Fluid from 'primevue/fluid'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const { t } = useI18n()
const router = useRouter()
const iamStore = useIamStore()

const dni = ref('')
const username = ref('')
const password = ref('')
const otpCode = ref('')
const otpSent = ref(false)
const otpCooldown = ref(0)
const successMessage = ref('')

// Phone Verification with Firebase
const phoneNumber = ref('')
const phoneSmsCode = ref('')
const smsSent = ref(false)
const smsCooldown = ref(0)
const phoneFirebaseToken = ref('')
const manualTokenPrompt = ref(false)

watch(dni, (val) => {
  if (!val) return
  const clean = val.replace(/\D/g, '').slice(0, 8)
  if (clean !== val) {
    dni.value = clean
  }
  if (clean.length === 8) {
    searchDni()
  }
})

const searchDni = async () => {
  if (dni.value.length === 8) {
    await iamStore.lookupDni(dni.value)
  }
}

const sendOtp = async () => {
  if (!username.value) return
  const ok = await iamStore.sendEmailOtp(username.value)
  if (ok) {
    otpSent.value = true
    otpCooldown.value = 60
    const interval = setInterval(() => {
      otpCooldown.value--
      if (otpCooldown.value <= 0) {
        clearInterval(interval)
      }
    }, 1000)
  }
}

const confirmOtp = async () => {
  if (otpCode.value.length !== 6) return
  await iamStore.verifyEmailOtp(username.value, otpCode.value)
}

const handleSendSms = async () => {
  if (!phoneNumber.value) return
  try {
    firebasePhoneAuthService.setupRecaptcha('recaptcha-phone-container')
    const ok = await iamStore.sendPhoneSms(phoneNumber.value)
    if (ok) {
      smsSent.value = true
      smsCooldown.value = 60
      const timer = setInterval(() => {
        smsCooldown.value--
        if (smsCooldown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  } catch (err: any) {
    console.error('Error al inicializar o enviar SMS:', err)
  }
}

const handleVerifySms = async () => {
  if (phoneSmsCode.value.length !== 6) return
  await iamStore.verifyPhoneSmsCode(phoneSmsCode.value)
}

const confirmPhoneToken = async () => {
  if (!phoneFirebaseToken.value) return
  await iamStore.verifyPhoneToken(phoneFirebaseToken.value)
}

onUnmounted(() => {
  firebasePhoneAuthService.clearRecaptcha()
})

const fillDemoData = () => {
  dni.value = '72849102'
  username.value = 'demo_user_' + Math.floor(Math.random() * 1000) + '@smartfinance.com'
  password.value = 'Password123!'
  phoneNumber.value = '+51 987654321'
  phoneFirebaseToken.value = 'demo-firebase-id-token-valid'
  manualTokenPrompt.value = true
  searchDni()
}

const handleSignUp = async () => {
  const command = new SignUpCommand({
    username: username.value,
    password: password.value,
    roles: ['ROLE_USER']
  })

  const createdUser = await iamStore.signUp(command)
  if (createdUser && createdUser.id) {
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
