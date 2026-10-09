<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-surface-800 dark:text-surface-100 overflow-y-auto">
    <div class="max-w-xl w-full space-y-6 bg-surface-0 dark:bg-surface-900 p-6 sm:p-8 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xl">
      <!-- Top Navigation & Language Switcher -->
      <div class="flex items-center justify-between">
        <router-link
          to="/home"
          class="inline-flex items-center gap-2 text-xs font-semibold text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
        >
          <i class="pi pi-arrow-left text-xs" />
          <span>Volver al inicio</span>
        </router-link>

        <LanguageSwitcher />
      </div>

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
        <p class="text-xs text-surface-500 max-w-md mx-auto">
          {{ t('iam.signUpSubtitle') }}
        </p>
      </div>

      <!-- Stepper Progress Indicator -->
      <div class="pt-2">
        <div class="flex items-center justify-between relative">
          <!-- Step connecting line background -->
          <div class="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-surface-200 dark:bg-surface-800 -z-0"></div>
          <!-- Step connecting line filled progress -->
          <div
            class="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-300 -z-0"
            :style="{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }"
          ></div>

          <!-- Step Items -->
          <div
            v-for="(stepItem, index) in steps"
            :key="stepItem.step"
            class="relative z-10 flex flex-col items-center cursor-pointer group"
            @click="goToStep(stepItem.step)"
          >
            <div
              :class="[
                'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm',
                currentStep === stepItem.step
                  ? 'bg-primary text-white ring-4 ring-primary/20 scale-110 shadow-primary/30'
                  : currentStep > stepItem.step
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-400 border border-surface-200 dark:border-surface-700'
              ]"
            >
              <i v-if="currentStep > stepItem.step" class="pi pi-check text-xs font-black"></i>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span
              :class="[
                'text-[10px] font-bold mt-1.5 transition-colors hidden sm:block tracking-tight text-center max-w-[100px]',
                currentStep === stepItem.step
                  ? 'text-primary'
                  : currentStep > stepItem.step
                    ? 'text-surface-700 dark:text-surface-300'
                    : 'text-surface-400'
              ]"
            >
              {{ stepItem.title }}
            </span>
          </div>
        </div>
      </div>

      <!-- Success Alert -->
      <Message v-if="successMessage || iamStore.successMessage" severity="success" :closable="false" class="w-full text-xs">
        {{ successMessage || iamStore.successMessage }}
      </Message>

      <!-- Error Alert -->
      <Message v-if="iamStore.error" severity="error" :closable="true" @close="iamStore.error = null" class="w-full text-xs">
        {{ iamStore.error }}
      </Message>

      <!-- Form Steps Container -->
      <form class="space-y-5" @submit.prevent="handleSignUp">
        <!-- =================================================================== -->
        <!-- PASO 1: Acceso, Tipo de Cuenta y Verificación de Correo (OTP)      -->
        <!-- =================================================================== -->
        <div v-show="currentStep === 1" class="space-y-4">
          <!-- Step Title Badge -->
          <div class="flex items-center justify-between pb-2 border-b border-surface-200 dark:border-surface-800">
            <span class="text-xs font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center">1</span>
              <span>Paso 1: Acceso y Verificación</span>
            </span>
            <span class="text-[10px] text-surface-400 font-medium">Credenciales maestras</span>
          </div>

          <!-- Account Type Selector -->
          <div class="space-y-2">
            <label class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
              {{ t('iam.accountType') }} <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <!-- Option A: Buyer / Personal -->
              <button
                type="button"
                @click="accountType = 'buyer'"
                :class="[
                  'p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2',
                  accountType === 'buyer'
                    ? 'border-primary bg-primary-50/60 dark:bg-primary-950/30 text-primary-900 dark:text-primary-100 ring-2 ring-primary/20 shadow-xs'
                    : 'border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/40 hover:border-surface-300 dark:hover:border-surface-600'
                ]"
              >
                <div class="flex items-center justify-between">
                  <i class="pi pi-user text-base" :class="accountType === 'buyer' ? 'text-primary' : 'text-surface-400'" />
                  <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md" :class="accountType === 'buyer' ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'">
                    Personal
                  </span>
                </div>
                <div>
                  <span class="font-bold text-xs block leading-tight">{{ t('iam.accountTypeBuyer') }}</span>
                  <span class="text-[10px] text-surface-500 block leading-tight mt-0.5">Comprador de autos</span>
                </div>
              </button>

              <!-- Option B: Dealer / Concesionaria -->
              <button
                type="button"
                @click="accountType = 'dealer'"
                :class="[
                  'p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2',
                  accountType === 'dealer'
                    ? 'border-primary bg-primary-50/60 dark:bg-primary-950/30 text-primary-900 dark:text-primary-100 ring-2 ring-primary/20 shadow-xs'
                    : 'border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/40 hover:border-surface-300 dark:hover:border-surface-600'
                ]"
              >
                <div class="flex items-center justify-between">
                  <i class="pi pi-car text-base" :class="accountType === 'dealer' ? 'text-primary' : 'text-surface-400'" />
                  <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md" :class="accountType === 'dealer' ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'">
                    Empresa
                  </span>
                </div>
                <div>
                  <span class="font-bold text-xs block leading-tight">{{ t('iam.accountTypeDealer') }}</span>
                  <span class="text-[10px] text-surface-500 block leading-tight mt-0.5">Venta y catálogo</span>
                </div>
              </button>

              <!-- Option C: Financial Institution / Banco -->
              <button
                type="button"
                @click="accountType = 'bank'"
                :class="[
                  'p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2',
                  accountType === 'bank'
                    ? 'border-primary bg-primary-50/60 dark:bg-primary-950/30 text-primary-900 dark:text-primary-100 ring-2 ring-primary/20 shadow-xs'
                    : 'border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/40 hover:border-surface-300 dark:hover:border-surface-600'
                ]"
              >
                <div class="flex items-center justify-between">
                  <i class="pi pi-building text-base" :class="accountType === 'bank' ? 'text-primary' : 'text-surface-400'" />
                  <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md" :class="accountType === 'bank' ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'">
                    Banco
                  </span>
                </div>
                <div>
                  <span class="font-bold text-xs block leading-tight">{{ t('iam.accountTypeBank') }}</span>
                  <span class="text-[10px] text-surface-500 block leading-tight mt-0.5">Créditos y tasas</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Email & Verification OTP -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="reg-username" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                {{ t('iam.email') }} <span class="text-rose-500">*</span>
              </label>
              <span v-if="iamStore.emailVerified" class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <i class="pi pi-check" /> Verificado
              </span>
              <span v-else-if="username && isEmailValid" class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <i class="pi pi-check text-[10px]" /> Formato válido
              </span>
              <span v-else-if="username && !isEmailValid" class="text-[10px] text-rose-500 font-medium">
                Correo inválido
              </span>
            </div>

            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <i class="pi pi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs pointer-events-none z-10"></i>
                <InputText
                  id="reg-username"
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
              <Button
                type="button"
                severity="secondary"
                outlined
                :disabled="!isEmailValid || otpCooldown > 0 || iamStore.emailVerified"
                :loading="iamStore.isLoading && !iamStore.isVerifyingOtp"
                @click="sendOtp"
                class="!text-xs !px-4 !py-2.5 !rounded-xl shrink-0 font-bold"
                :label="otpCooldown > 0 ? `${otpCooldown}s` : (iamStore.emailVerified ? 'Verificado' : (otpSent ? 'Reenviar OTP' : 'Enviar OTP'))"
              />
            </div>

            <!-- OTP Code Verification Box -->
            <div v-if="otpSent && !iamStore.emailVerified" class="p-3 rounded-2xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 space-y-2">
              <div class="flex items-center justify-between text-[11px] text-surface-600 dark:text-surface-300">
                <span class="font-medium">Ingrese el código de 6 dígitos enviado a su correo:</span>
                <span class="text-[10px] text-surface-400">Vence en 15 min</span>
              </div>
              <div class="flex items-center gap-2">
                <InputText
                  v-model="otpCode"
                  maxlength="6"
                  placeholder="Ej: 849201"
                  class="w-full font-mono text-center tracking-widest !text-sm !py-2.5 !rounded-xl"
                />
                <Button
                  type="button"
                  severity="primary"
                  :disabled="otpCode.length !== 6"
                  :loading="iamStore.isVerifyingOtp"
                  @click="confirmOtp"
                  class="!text-xs !px-4 !py-2.5 !rounded-xl shrink-0 font-bold"
                  label="Validar"
                />
              </div>
              <p class="text-[10px] text-surface-500 dark:text-surface-400">
                * Nota: Si solicitó un reenvío, ingrese el código más reciente recibido en su bandeja.
              </p>
            </div>

            <!-- Verified Email Confirmation Card -->
            <div
              v-if="iamStore.emailVerified"
              class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between text-emerald-800 dark:text-emerald-300"
            >
              <div class="flex items-center gap-1.5 font-bold">
                <i class="pi pi-check-circle text-xs" />
                <span>Correo verificado exitosamente</span>
              </div>
              <span v-if="iamStore.emailVerificationToken" class="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                {{ iamStore.emailVerificationToken.slice(0, 16) }}...
              </span>
            </div>
          </div>

          <!-- Password Input with Live Security Meter -->
          <div class="space-y-1.5">
            <label for="reg-password" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
              {{ t('iam.password') }} <span class="text-rose-500">*</span>
            </label>
            <Password
              id="reg-password"
              inputId="reg-password-input"
              v-model="password"
              required
              :feedback="false"
              toggleMask
              class="w-full !rounded-xl"
              inputClass="w-full !text-xs !py-2.5 !rounded-xl"
              :placeholder="t('iam.passwordPlaceholder')"
            />

            <!-- Live Password Complexity Checklist -->
            <div v-if="password" class="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 text-[10px] space-y-1">
              <span class="font-bold text-surface-600 dark:text-surface-300 block mb-1">Requisitos de contraseña segura:</span>
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
            <span v-else class="text-[10px] text-surface-500 font-medium flex items-center gap-1">
              <i class="pi pi-info-circle text-[10px]" />
              <span>{{ t('iam.passwordHelp') }}</span>
            </span>
          </div>

          <!-- Step 1 Controls -->
          <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              @click="fillDemoData"
              class="text-xs text-primary hover:underline font-semibold flex items-center space-x-1 order-2 sm:order-1"
            >
              <i class="pi pi-sparkles text-xs"></i>
              <span>{{ t('iam.fillDemoBtn') }}</span>
            </button>

            <Button
              type="button"
              severity="primary"
              :disabled="!canAdvanceStep1"
              @click="nextStep"
              class="w-full sm:w-auto !px-6 !py-2.5 !rounded-xl !text-xs font-bold order-1 sm:order-2 shadow-md shadow-primary/20"
              label="Continuar a Identificación"
              icon="pi pi-arrow-right"
              iconPos="right"
            />
          </div>
        </div>

        <!-- =================================================================== -->
        <!-- PASO 2: Identificación Personal (Nombres, DNI y Teléfono)          -->
        <!-- =================================================================== -->
        <div v-show="currentStep === 2" class="space-y-4">
          <!-- Step Title Badge -->
          <div class="flex items-center justify-between pb-2 border-b border-surface-200 dark:border-surface-800">
            <span class="text-xs font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center">2</span>
              <span>{{ accountType === 'buyer' ? 'Paso 2: Identificación Personal' : 'Paso 2: Representante Legal / Contacto' }}</span>
            </span>
            <span class="text-[10px] text-surface-400 font-medium">
              {{ accountType === 'buyer' ? 'Paso final' : 'Paso 2 de 3' }}
            </span>
          </div>

          <!-- Names Row: First Name & Last Name -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label for="reg-firstname" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                {{ t('iam.firstName') }} <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs pointer-events-none z-10"></i>
                <InputText
                  id="reg-firstname"
                  v-model="firstName"
                  required
                  :placeholder="t('iam.firstNamePlaceholder')"
                  class="w-full !pl-9 !py-2.5 !text-xs !rounded-xl"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label for="reg-lastname" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                {{ t('iam.lastName') }} <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs pointer-events-none z-10"></i>
                <InputText
                  id="reg-lastname"
                  v-model="lastName"
                  required
                  :placeholder="t('iam.lastNamePlaceholder')"
                  class="w-full !pl-9 !py-2.5 !text-xs !rounded-xl"
                />
              </div>
            </div>
          </div>

          <!-- DNI Input (Optional / Formato Perú 8 dígitos) -->
          <div class="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 space-y-2">
            <div class="flex items-center justify-between">
              <label for="reg-dni" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                Documento de Identidad (DNI) <span class="normal-case text-surface-400 font-normal text-[10px]">(Opcional)</span>
              </label>
              <span class="text-[10px] text-surface-400">8 dígitos</span>
            </div>

            <div class="relative">
              <i class="pi pi-id-card absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs pointer-events-none z-10"></i>
              <InputText
                id="reg-dni"
                v-model="dni"
                maxlength="8"
                placeholder="Ingrese 8 dígitos de su DNI"
                class="w-full !pl-9 !py-2.5 !text-xs !rounded-xl font-mono"
              />
            </div>
            <p class="text-[10px] text-surface-500">
              * El DNI se vinculará a tu perfil para agilizar las solicitudes de financiamiento automotriz.
            </p>
            <p v-if="dni && dni.length !== 8" class="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
              <i class="pi pi-exclamation-circle"></i>
              El DNI debe tener exactamente 8 dígitos (o déjalo vacío).
            </p>
          </div>

          <!-- Phone Number (Optional) with Direct Instant Format Validation -->
          <div class="space-y-2 p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
            <div class="flex items-center justify-between">
              <label for="reg-phone" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                Teléfono Celular <span class="normal-case text-surface-400 font-normal text-[10px]">(Opcional)</span>
              </label>
              <span v-if="phoneNumber && isPhoneValid" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <i class="pi pi-check" /> Formato válido (+51)
              </span>
              <span v-else-if="phoneNumber && !isPhoneValid" class="text-[10px] text-rose-500 font-medium">
                Debe tener 9 dígitos (inicia con 9)
              </span>
            </div>

            <div class="relative">
              <i class="pi pi-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs pointer-events-none z-10"></i>
              <InputText
                id="reg-phone"
                v-model="phoneNumber"
                @input="phoneNumber = phoneNumber.replace(/[^\d+ ]/g, '')"
                placeholder="+51 987 654 321"
                class="w-full !pl-9 !py-2.5 !text-xs !rounded-xl font-mono"
              />
            </div>
            <p class="text-[10px] text-surface-500">
              * Se asociará a tu perfil para contacto con asesores y recepción de ofertas crediticias.
            </p>
          </div>

          <!-- Step 2 Controls -->
          <div class="pt-2 flex items-center justify-between gap-3">
            <Button
              type="button"
              severity="secondary"
              outlined
              @click="prevStep"
              class="!px-4 !py-2.5 !rounded-xl !text-xs font-bold"
              label="Atrás"
              icon="pi pi-arrow-left"
            />

            <!-- If Buyer: Final Submit in Step 2 -->
            <Button
              v-if="accountType === 'buyer'"
              type="submit"
              :loading="iamStore.isLoading"
              :disabled="!canAdvanceStep2"
              :label="iamStore.isLoading ? t('iam.registering') : 'Crear Cuenta de Comprador'"
              icon="pi pi-check"
              iconPos="right"
              severity="primary"
              class="w-full sm:w-auto !px-6 !py-2.5 !rounded-xl !text-xs font-bold shadow-md shadow-primary/20"
            />

            <!-- If Dealer/Bank: Advance to Step 3 -->
            <Button
              v-else
              type="button"
              severity="primary"
              :disabled="!canAdvanceStep2"
              @click="nextStep"
              class="w-full sm:w-auto !px-6 !py-2.5 !rounded-xl !text-xs font-bold shadow-md shadow-primary/20"
              label="Continuar a Datos de Empresa"
              icon="pi pi-arrow-right"
              iconPos="right"
            />
          </div>
        </div>

        <!-- =================================================================== -->
        <!-- PASO 3: Datos de Empresa (Solo Concesionaria o Entidad Financiera)  -->
        <!-- =================================================================== -->
        <div v-show="currentStep === 3" class="space-y-4">
          <!-- Step Title Badge -->
          <div class="flex items-center justify-between pb-2 border-b border-surface-200 dark:border-surface-800">
            <span class="text-xs font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center">3</span>
              <span>
                {{ accountType === 'dealer' ? 'Paso 3: Concesionaria Automotriz' : 'Paso 3: Entidad Financiera' }}
              </span>
            </span>
            <span class="text-[10px] text-primary font-bold">Validación SUNAT</span>
          </div>

          <!-- Dealer Specific Step 3 -->
          <div v-if="accountType === 'dealer'" class="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 space-y-3">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="reg-corporate-ruc" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                  {{ t('iam.rucNumber') }} (11 dígitos) <span class="text-rose-500">*</span>
                </label>
                <span v-if="corporateRuc && corporateRuc.length === 11" class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <i class="pi pi-check" /> 11 dígitos
                </span>
              </div>
              <div class="relative">
                <i class="pi pi-building absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs pointer-events-none z-10"></i>
                <InputText
                  id="reg-corporate-ruc"
                  v-model="corporateRuc"
                  maxlength="11"
                  required
                  placeholder="Ej: 20100138019"
                  class="w-full !pl-9 !py-2.5 !text-xs !rounded-xl font-mono"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label for="reg-company-name" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                {{ t('iam.companyName') }} <span class="text-rose-500">*</span>
              </label>
              <InputText
                id="reg-company-name"
                v-model="companyName"
                required
                :placeholder="t('iam.companyNamePlaceholder')"
                class="w-full !py-2.5 !text-xs !rounded-xl"
              />
            </div>

            <div class="text-[11px] text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 p-2.5 rounded-xl flex items-start gap-2">
              <i class="pi pi-info-circle text-primary mt-0.5 shrink-0" />
              <span>El backend validará automáticamente que el RUC esté ACTIVO, HABIDO y registrado con actividad automotriz (CIIU 451).</span>
            </div>
          </div>

          <!-- Bank Specific Step 3 -->
          <div v-if="accountType === 'bank'" class="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 space-y-3">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="reg-corporate-ruc-bank" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                  {{ t('iam.rucNumber') }} (11 dígitos) <span class="text-rose-500">*</span>
                </label>
                <span v-if="corporateRuc && corporateRuc.length === 11" class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <i class="pi pi-check" /> 11 dígitos
                </span>
              </div>
              <div class="relative">
                <i class="pi pi-building absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs pointer-events-none z-10"></i>
                <InputText
                  id="reg-corporate-ruc-bank"
                  v-model="corporateRuc"
                  maxlength="11"
                  required
                  placeholder="Ej: 20100047218"
                  class="w-full !pl-9 !py-2.5 !text-xs !rounded-xl font-mono"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label for="reg-company-name-bank" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                {{ t('iam.institutionName') }} <span class="text-rose-500">*</span>
              </label>
              <InputText
                id="reg-company-name-bank"
                v-model="companyName"
                required
                :placeholder="t('iam.institutionNamePlaceholder')"
                class="w-full !py-2.5 !text-xs !rounded-xl"
              />
            </div>

            <div class="text-[11px] text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 p-2.5 rounded-xl flex items-start gap-2">
              <i class="pi pi-info-circle text-primary mt-0.5 shrink-0" />
              <span>El backend validará automáticamente que el RUC esté ACTIVO, HABIDO y con actividad de intermediación financiera (CIIU 64/66).</span>
            </div>
          </div>

          <!-- Step 3 Controls -->
          <div class="pt-2 flex items-center justify-between gap-3">
            <Button
              type="button"
              severity="secondary"
              outlined
              @click="prevStep"
              class="!px-4 !py-2.5 !rounded-xl !text-xs font-bold"
              label="Atrás"
              icon="pi pi-arrow-left"
            />

            <Button
              type="submit"
              :loading="iamStore.isLoading"
              :disabled="!canAdvanceStep3"
              :label="iamStore.isLoading ? t('iam.registering') : (accountType === 'dealer' ? 'Completar Registro de Concesionaria' : 'Completar Registro de Entidad Financiera')"
              icon="pi pi-check"
              iconPos="right"
              severity="primary"
              class="w-full sm:w-auto !px-6 !py-2.5 !rounded-xl !text-xs font-bold shadow-md shadow-primary/20"
            />
          </div>
        </div>
      </form>

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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../application/iam.store'
import { SignUpCommand } from '../../domain/sign-up.command'
import { SignInCommand } from '../../domain/sign-in.command'
import { RoleRequestCommand } from '../../domain/role-request.command'

// PrimeVue Components
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'

const { t } = useI18n()
const router = useRouter()
const iamStore = useIamStore()

// Step Navigation State
type AccountType = 'buyer' | 'dealer' | 'bank'
const accountType = ref<AccountType>('buyer')
const currentStep = ref<number>(1)

const totalSteps = computed(() => (accountType.value === 'buyer' ? 2 : 3))

const steps = computed(() => {
  if (accountType.value === 'buyer') {
    return [
      { step: 1, title: 'Acceso y Verificación', subtitle: 'Tipo, Correo y Contraseña', icon: 'pi pi-shield' },
      { step: 2, title: 'Identificación', subtitle: 'Nombres, DNI y Teléfono', icon: 'pi pi-user' }
    ]
  } else if (accountType.value === 'dealer') {
    return [
      { step: 1, title: 'Acceso y Verificación', subtitle: 'Credenciales del Administrador', icon: 'pi pi-shield' },
      { step: 2, title: 'Representante', subtitle: 'Datos del Titular / Contacto', icon: 'pi pi-user' },
      { step: 3, title: 'Concesionaria', subtitle: 'RUC y Razón Social (SUNAT)', icon: 'pi pi-car' }
    ]
  } else {
    return [
      { step: 1, title: 'Acceso y Verificación', subtitle: 'Credenciales del Administrador', icon: 'pi pi-shield' },
      { step: 2, title: 'Representante', subtitle: 'Datos del Titular / Contacto', icon: 'pi pi-user' },
      { step: 3, title: 'Entidad Financiera', subtitle: 'RUC y Razón Social (SUNAT)', icon: 'pi pi-building' }
    ]
  }
})

// Keep currentStep within bounds if accountType changes
watch(accountType, () => {
  if (currentStep.value > totalSteps.value) {
    currentStep.value = totalSteps.value
  }
})

// Common Account Fields (Paso 1)
const username = ref('')
const password = ref('')
const otpCode = ref('')
const otpSent = ref(false)
const otpCooldown = ref(0)
const successMessage = ref('')

// Personal Identification Fields (Paso 2)
const firstName = ref('')
const lastName = ref('')
const dni = ref('')
const phoneNumber = ref('')

// Corporate Fields (Paso 3)
const corporateRuc = ref('')
const companyName = ref('')

// Computed Validations
const isEmailValid = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(username.value.trim())
})

const passwordCriteria = computed(() => {
  const val = password.value || ''
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

const cleanPhoneNumber = computed(() => {
  return phoneNumber.value.replace(/\D/g, '')
})

const isPhoneValid = computed(() => {
  const digits = cleanPhoneNumber.value
  if (!digits) return false
  if (digits.length === 9 && digits.startsWith('9')) return true
  if (digits.length === 11 && digits.startsWith('519')) return true
  return false
})

// Step Advance Guards
const canAdvanceStep1 = computed(() => {
  return isEmailValid.value && iamStore.emailVerified && isPasswordValid.value
})

const canAdvanceStep2 = computed(() => {
  const hasNames = firstName.value.trim().length > 0 && lastName.value.trim().length > 0
  const dniValid = !dni.value || dni.value.trim().length === 8
  const phoneValid = !phoneNumber.value || isPhoneValid.value
  return hasNames && dniValid && phoneValid
})

const canAdvanceStep3 = computed(() => {
  if (accountType.value === 'buyer') return true
  return corporateRuc.value.trim().length === 11 && companyName.value.trim().length > 0
})

// Input format watchers
watch(dni, (val) => {
  if (!val) return
  const clean = val.replace(/\D/g, '').slice(0, 8)
  if (clean !== val) {
    dni.value = clean
  }
})

watch(corporateRuc, (val) => {
  if (!val) return
  const clean = val.replace(/\D/g, '').slice(0, 11)
  if (clean !== val) {
    corporateRuc.value = clean
  }
})

watch(username, () => {
  iamStore.emailVerified = false
  iamStore.emailVerificationToken = null
  otpSent.value = false
})

// Step Navigation Handlers
const goToStep = (targetStep: number) => {
  if (targetStep === currentStep.value) return
  if (targetStep < currentStep.value) {
    currentStep.value = targetStep
    iamStore.error = null
    return
  }
  if (targetStep === 2 && !canAdvanceStep1.value) {
    if (!iamStore.emailVerified) {
      iamStore.error = 'Debes validar el código OTP enviado a tu correo antes de avanzar.'
    } else if (!isPasswordValid.value) {
      iamStore.error = 'Por favor ingresa una contraseña que cumpla con los requisitos de seguridad.'
    }
    return
  }
  if (targetStep === 3) {
    if (!canAdvanceStep1.value) {
      goToStep(1)
      return
    }
    if (!canAdvanceStep2.value) {
      iamStore.error = 'Por favor completa tus nombres y apellidos antes de pasar a datos de empresa.'
      return
    }
  }
  iamStore.error = null
  currentStep.value = targetStep
}

const nextStep = () => {
  if (currentStep.value === 1) {
    if (!canAdvanceStep1.value) {
      if (!iamStore.emailVerified) {
        iamStore.error = 'Debes verificar tu correo con el código OTP de 6 dígitos antes de continuar.'
      } else if (!isPasswordValid.value) {
        iamStore.error = 'La contraseña no cumple con los requisitos de seguridad requeridos.'
      }
      return
    }
    currentStep.value = 2
    iamStore.error = null
  } else if (currentStep.value === 2) {
    if (!canAdvanceStep2.value) {
      iamStore.error = 'Por favor completa tus nombres y apellidos antes de avanzar.'
      return
    }
    if (totalSteps.value > 2) {
      currentStep.value = 3
      iamStore.error = null
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    iamStore.error = null
  }
}

// OTP Handlers
const sendOtp = async () => {
  if (!username.value || !isEmailValid.value) return
  otpCode.value = ''
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

// Quick Demo Data Fill
const fillDemoData = () => {
  iamStore.error = null
  const randomSuffix = Math.floor(Math.random() * 100000)
  password.value = 'Password123!'
  iamStore.emailVerified = true
  iamStore.phoneVerified = true

  if (accountType.value === 'buyer') {
    firstName.value = 'Juan'
    lastName.value = 'Pérez'
    dni.value = '72849102'
    username.value = `comprador_${randomSuffix}@smartfinance.com`
    phoneNumber.value = '+51 987654321'
  } else if (accountType.value === 'dealer') {
    firstName.value = 'Carlos'
    lastName.value = 'Gómez'
    username.value = `dealer_${randomSuffix}@toyota.pe`
    phoneNumber.value = '+51 987654321'
    corporateRuc.value = '20100138019'
    companyName.value = 'Toyota del Perú S.A.'
  } else if (accountType.value === 'bank') {
    firstName.value = 'Ana'
    lastName.value = 'Torres'
    username.value = `banco_${randomSuffix}@bcp.com.pe`
    phoneNumber.value = '+51 987654321'
    corporateRuc.value = '20100047218'
    companyName.value = 'Banco de Crédito del Perú BCP'
  }
}

// Final Submit Handler
const handleSignUp = async () => {
  iamStore.error = null

  // Capture clean DOM inputs / refs
  const emailInput = document.getElementById('reg-username') as HTMLInputElement | null
  const passwordInput =
    (document.getElementById('reg-password-input') as HTMLInputElement | null) ||
    (document.querySelector('#reg-password input, input[type="password"]') as HTMLInputElement | null)
  const firstNameInput = document.getElementById('reg-firstname') as HTMLInputElement | null
  const lastNameInput = document.getElementById('reg-lastname') as HTMLInputElement | null
  const dniInput = document.getElementById('reg-dni') as HTMLInputElement | null
  const rucInput =
    (document.getElementById('reg-corporate-ruc') as HTMLInputElement | null) ||
    (document.getElementById('reg-corporate-ruc-bank') as HTMLInputElement | null)
  const companyInput =
    (document.getElementById('reg-company-name') as HTMLInputElement | null) ||
    (document.getElementById('reg-company-name-bank') as HTMLInputElement | null)

  const cleanEmail = (emailInput?.value || username.value || '').trim()
  const cleanPassword = (passwordInput?.value || password.value || '').trim()
  const cleanFirstName = (firstNameInput?.value || firstName.value || '').trim()
  const cleanLastName = (lastNameInput?.value || lastName.value || '').trim()
  const cleanDni = (dniInput?.value || dni.value || '').trim()
  const cleanRuc = (rucInput?.value || corporateRuc.value || '').trim()
  const cleanCompanyName = (companyInput?.value || companyName.value || '').trim()

  // Validate Step 1
  if (!cleanEmail || !isEmailValid.value) {
    currentStep.value = 1
    iamStore.error = 'Por favor ingrese un correo electrónico válido.'
    return
  }
  if (!iamStore.emailVerified) {
    currentStep.value = 1
    if (!otpSent.value) {
      await sendOtp()
    }
    iamStore.error = 'Por favor valida el código OTP de 6 dígitos enviado a tu correo antes de continuar.'
    return
  }
  if (!cleanPassword || !isPasswordValid.value) {
    currentStep.value = 1
    iamStore.error = 'La contraseña debe cumplir con todos los requisitos de seguridad.'
    return
  }

  // Validate Step 2
  if (!cleanFirstName || !cleanLastName) {
    currentStep.value = 2
    iamStore.error = 'Por favor complete nombres y apellidos obligatorios.'
    return
  }
  if (cleanDni && cleanDni.length !== 8) {
    currentStep.value = 2
    iamStore.error = 'El DNI debe tener exactamente 8 dígitos.'
    return
  }
  if (phoneNumber.value && !isPhoneValid.value) {
    currentStep.value = 2
    iamStore.error = 'El teléfono celular debe tener 9 dígitos válidos (+51 9XXXXXXXX).'
    return
  }

  // Validate Step 3 for Dealer / Bank
  if (accountType.value === 'dealer' || accountType.value === 'bank') {
    if (!cleanRuc || cleanRuc.length !== 11) {
      currentStep.value = 3
      iamStore.error = 'El RUC corporativo debe tener 11 dígitos numéricos.'
      return
    }
    if (!cleanCompanyName) {
      currentStep.value = 3
      iamStore.error = accountType.value === 'dealer'
        ? 'Por favor ingrese la Razón Social de la concesionaria.'
        : 'Por favor ingrese el Nombre de la Entidad Financiera.'
      return
    }
  }

  // Step 1: Execute POST /api/v1/auth/registrations
  const signUpCommand = new SignUpCommand({
    username: cleanEmail,
    email: cleanEmail,
    password: cleanPassword,
    firstName: cleanFirstName,
    lastName: cleanLastName,
    roles: ['ROLE_USER']
  })

  let createdUser = await iamStore.signUp(signUpCommand)

  // Recovery: If user already exists (e.g. from an interrupted prior attempt), try auto-sign in
  const errorMsg = String(iamStore.error || '')
  if (!createdUser && errorMsg && (
    errorMsg.includes('registrado') ||
    errorMsg.includes('ya existe') ||
    errorMsg.includes('alreadyExists')
  )) {
    iamStore.error = null
    const signInOk = await iamStore.signIn(new SignInCommand({
      username: cleanEmail,
      password: cleanPassword
    }))
    if (signInOk && iamStore.currentUser) {
      createdUser = {
        id: Number(iamStore.currentUser.id),
        username: iamStore.currentUser.username,
        roles: iamStore.currentUser.roles
      }
    } else {
      iamStore.error = 'El correo ya está registrado con otra contraseña. Por favor inicia sesión o recupera tu contraseña.'
      return
    }
  }

  if (!createdUser || !createdUser.id) {
    return
  }

  // Step 2: Auto-login to obtain session & token (POST /api/v1/auth/sessions) if needed
  if (!iamStore.isAuthenticated) {
    const signInOk = await iamStore.signIn(new SignInCommand({
      username: cleanEmail,
      password: cleanPassword
    }))
    if (!signInOk) {
      return
    }
  }

  const userId = iamStore.currentUser?.id || createdUser.id

  // Cache user names in localStorage for session profile fallback
  if (cleanFirstName) localStorage.setItem('user_first_name', cleanFirstName)
  if (cleanLastName) localStorage.setItem('user_last_name', cleanLastName)
  const fullDisplayName = `${cleanFirstName} ${cleanLastName}`.trim()
  if (fullDisplayName) localStorage.setItem('user_name', fullDisplayName)

  // Step 3 & 4: Elevation flow based on selected account type
  if (accountType.value === 'dealer') {
    const dealerRoleOk = await iamStore.requestDealerRole(new RoleRequestCommand({
      userId,
      ruc: cleanRuc,
      companyName: cleanCompanyName
    }))

    if (!dealerRoleOk) {
      return
    }

    await iamStore.refreshSession()
    successMessage.value = '¡Concesionaria registrada y acreditada con éxito! Redirigiendo a tu panel...'
    setTimeout(() => {
      router.push('/dealer/dashboard')
    }, 1200)
    return
  }

  if (accountType.value === 'bank') {
    const bankRoleOk = await iamStore.requestFinancialInstitutionRole(new RoleRequestCommand({
      userId,
      ruc: cleanRuc,
      companyName: cleanCompanyName
    }))

    if (!bankRoleOk) {
      return
    }

    await iamStore.refreshSession()
    successMessage.value = '¡Entidad Financiera registrada con éxito! Redirigiendo a tu panel...'
    setTimeout(() => {
      router.push('/bank/dashboard')
    }, 1200)
    return
  }

  // Personal / Buyer Account: Auto-create initial profile
  try {
    const { useProfilesStore } = await import('@/profiles/application/profiles.store')
    const { CreateProfileCommand } = await import('@/profiles/domain/create-profile.command')
    const profilesStore = useProfilesStore()
    const resolvedLegalName = iamStore.reniecData?.fullLegalName || fullDisplayName || cleanEmail
    const sanitizedMobile = cleanPhoneNumber.value.length >= 9 ? cleanPhoneNumber.value.slice(-9) : ''
    await profilesStore.createProfile(new CreateProfileCommand({
      fullLegalNames: resolvedLegalName,
      email: cleanEmail,
      nationalId: cleanDni || '00000000',
      phoneCountryCode: '+51',
      mobilePhone: sanitizedMobile,
      monthlyIncomeAmount: 3500,
      monthlyIncomeCurrency: 'PEN'
    }))
  } catch {
    // Continue if profile creation can be finished later in profile view
  }

  successMessage.value = t('iam.signUpSuccess')
  setTimeout(() => {
    router.push('/catalog')
  }, 1200)
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
