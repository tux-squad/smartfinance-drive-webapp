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

      <!-- Account Type Selection (Selector Inicial: Comprador, Concesionario, Entidad Financiera) -->
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

      <!-- Success Alert -->
      <Message v-if="successMessage || iamStore.successMessage" severity="success" :closable="false" class="w-full text-xs">
        {{ successMessage || iamStore.successMessage }}
      </Message>

      <!-- Error Alert -->
      <Message v-if="iamStore.error" severity="error" :closable="true" @close="iamStore.error = null" class="w-full text-xs">
        {{ iamStore.error }}
      </Message>

      <!-- Registration Form -->
      <form class="space-y-4" @submit.prevent="handleSignUp">
        <!-- Section Header for Step 1 -->
        <div class="pt-2 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between">
          <span class="text-xs font-bold text-surface-900 dark:text-surface-100 flex items-center gap-1.5">
            <span class="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center">1</span>
            <span>{{ t('iam.step1Title') }}</span>
          </span>
          <span class="text-[10px] text-surface-400 font-medium">Requerido</span>
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

        <!-- Option A: Buyer Specific Verification (DNI & Phone) -->
        <template v-if="accountType === 'buyer'">
          <!-- DNI Input -->
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
              * El DNI se vinculará a tu perfil de comprador para evaluaciones crediticias en el portal.
            </p>
            <p v-if="dni && dni.length !== 8" class="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
              <i class="pi pi-exclamation-circle"></i>
              El DNI debe tener exactamente 8 dígitos (o déjalo vacío).
            </p>
          </div>

          <!-- Phone Verification (Firebase SMS) -->
          <div class="space-y-3 p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
            <div class="flex items-center justify-between">
              <label for="reg-phone" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                Verificación Telefónica <span class="normal-case text-surface-400 font-normal text-[10px]">(Opcional)</span>
              </label>
              <span v-if="iamStore.phoneVerified" class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <i class="pi pi-check" /> Verificado
              </span>
            </div>

            <div id="recaptcha-phone-container" style="position: absolute; opacity: 0; pointer-events: none; width: 1px; height: 1px;"></div>

            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <i class="pi pi-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs pointer-events-none z-10"></i>
                <InputText
                  id="reg-phone"
                  v-model="phoneNumber"
                  placeholder="+51 987 654 321"
                  :disabled="iamStore.phoneVerified"
                  class="w-full !pl-9 !py-2.5 !text-xs !rounded-xl"
                />
              </div>
              <Button
                type="button"
                severity="secondary"
                outlined
                :disabled="!phoneNumber || smsCooldown > 0 || iamStore.phoneVerified"
                :loading="iamStore.isLoading && !iamStore.isVerifyingOtp"
                @click="handleSendSms"
                class="!text-xs !px-4 !py-2.5 !rounded-xl shrink-0 font-bold"
                :label="smsCooldown > 0 ? `${smsCooldown}s` : (iamStore.phoneVerified ? 'Verificado' : 'Enviar SMS')"
              />
            </div>

            <!-- SMS Code Verification Input -->
            <div v-if="smsSent && !iamStore.phoneVerified" class="p-3 rounded-2xl bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 space-y-2">
              <span class="text-[11px] text-surface-600 dark:text-surface-300 block">
                Ingrese el código de 6 dígitos recibido por SMS:
              </span>
              <div class="flex items-center gap-2">
                <InputText
                  v-model="phoneSmsCode"
                  maxlength="6"
                  placeholder="Ej: 123456"
                  class="w-full font-mono text-center tracking-widest !text-sm !py-2.5 !rounded-xl"
                />
                <Button
                  type="button"
                  severity="primary"
                  :disabled="phoneSmsCode.length !== 6"
                  :loading="iamStore.isVerifyingOtp"
                  @click="handleVerifySms"
                  class="!text-xs !px-4 !py-2.5 !rounded-xl shrink-0 font-bold"
                  label="Validar SMS"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- Option B: Dealer Specific Corporate Data (Step 2) -->
        <template v-if="accountType === 'dealer'">
          <div class="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-surface-900 dark:text-surface-100 flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center">2</span>
                <span>{{ t('iam.step2DealerTitle') }}</span>
              </span>
              <span class="text-[10px] text-primary font-bold">Validación SUNAT</span>
            </div>

            <div class="space-y-1.5">
              <label for="reg-dealer-ruc" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                {{ t('iam.rucNumber') }} (11 dígitos) <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <i class="pi pi-building absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs pointer-events-none z-10"></i>
                <InputText
                  id="reg-dealer-ruc"
                  v-model="corporateRuc"
                  maxlength="11"
                  required
                  placeholder="Ej: 20100138019"
                  class="w-full !pl-9 !py-2.5 !text-xs !rounded-xl"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label for="reg-dealer-company" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                {{ t('iam.companyName') }} <span class="text-rose-500">*</span>
              </label>
              <InputText
                id="reg-dealer-company"
                v-model="companyName"
                required
                :placeholder="t('iam.companyNamePlaceholder')"
                class="w-full !py-2.5 !text-xs !rounded-xl"
              />
            </div>

            <div class="text-[11px] text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 p-2.5 rounded-xl flex items-start gap-2">
              <i class="pi pi-info-circle text-primary mt-0.5 shrink-0" />
              <span>El backend verificará que el RUC esté ACTIVO, HABIDO y registrado con actividad automotriz (CIIU 451).</span>
            </div>
          </div>
        </template>

        <!-- Option C: Financial Institution Specific Data (Step 2) -->
        <template v-if="accountType === 'bank'">
          <div class="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-surface-900 dark:text-surface-100 flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center">2</span>
                <span>{{ t('iam.step2BankTitle') }}</span>
              </span>
              <span class="text-[10px] text-primary font-bold">Validación SUNAT</span>
            </div>

            <div class="space-y-1.5">
              <label for="reg-bank-ruc" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                {{ t('iam.rucNumber') }} (11 dígitos) <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <i class="pi pi-building absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs pointer-events-none z-10"></i>
                <InputText
                  id="reg-bank-ruc"
                  v-model="corporateRuc"
                  maxlength="11"
                  required
                  placeholder="Ej: 20100047218"
                  class="w-full !pl-9 !py-2.5 !text-xs !rounded-xl"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label for="reg-bank-institution" class="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                {{ t('iam.institutionName') }} <span class="text-rose-500">*</span>
              </label>
              <InputText
                id="reg-bank-institution"
                v-model="companyName"
                required
                :placeholder="t('iam.institutionNamePlaceholder')"
                class="w-full !py-2.5 !text-xs !rounded-xl"
              />
            </div>

            <div class="text-[11px] text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 p-2.5 rounded-xl flex items-start gap-2">
              <i class="pi pi-info-circle text-primary mt-0.5 shrink-0" />
              <span>El backend verificará que el RUC esté ACTIVO, HABIDO y con actividad de intermediación financiera (CIIU 64/66).</span>
            </div>
          </div>
        </template>

        <!-- Quick Fill Demo Button -->
        <div class="flex justify-end pt-1">
          <button
            type="button"
            @click="fillDemoData"
            class="text-xs text-primary hover:underline font-semibold flex items-center space-x-1"
          >
            <i class="pi pi-sparkles text-xs"></i>
            <span>{{ t('iam.fillDemoBtn') }} ({{ accountType === 'buyer' ? 'Comprador' : (accountType === 'dealer' ? 'Dealer' : 'Banco') }})</span>
          </button>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          :loading="iamStore.isLoading"
          :label="iamStore.isLoading ? t('iam.registering') : t('iam.signUpBtn')"
          icon="pi pi-user-plus"
          iconPos="right"
          severity="primary"
          class="w-full font-bold !py-3 shadow-md shadow-primary/20 !rounded-xl transition-all !text-xs"
        />
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
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../application/iam.store'
import { SignUpCommand } from '../../domain/sign-up.command'
import { SignInCommand } from '../../domain/sign-in.command'
import { RoleRequestCommand } from '../../domain/role-request.command'
import { firebasePhoneAuthService } from '@/iam/infrastructure/firebase-phone-auth.service'

// PrimeVue Components
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'

const { t } = useI18n()
const router = useRouter()
const iamStore = useIamStore()

// Account Type Selection
type AccountType = 'buyer' | 'dealer' | 'bank'
const accountType = ref<AccountType>('buyer')

// Common Account Fields
const firstName = ref('')
const lastName = ref('')
const username = ref('')
const password = ref('')

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

// Buyer specific fields
const dni = ref('')
const otpCode = ref('')
const otpSent = ref(false)
const otpCooldown = ref(0)
const successMessage = ref('')

// Phone Verification with Firebase
const phoneNumber = ref('')
const phoneSmsCode = ref('')
const smsSent = ref(false)
const smsCooldown = ref(0)

// Dealer & Bank Corporate Fields
const corporateRuc = ref('')
const companyName = ref('')

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

watch(phoneNumber, () => {
  iamStore.phoneVerified = false
  iamStore.phoneVerificationToken = null
  smsSent.value = false
})

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

onUnmounted(() => {
  firebasePhoneAuthService.clearRecaptcha()
})

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
    corporateRuc.value = '20100138019'
    companyName.value = 'Toyota del Perú S.A.'
  } else if (accountType.value === 'bank') {
    firstName.value = 'Ana'
    lastName.value = 'Torres'
    username.value = `banco_${randomSuffix}@bcp.com.pe`
    corporateRuc.value = '20100047218'
    companyName.value = 'Banco de Crédito del Perú BCP'
  }
}

const handleSignUp = async () => {
  iamStore.error = null

  // Capture DOM input values (resolving inner inputs if autofilled)
  const emailInput = document.getElementById('reg-username') as HTMLInputElement | null
  const passwordInput =
    (document.getElementById('reg-password-input') as HTMLInputElement | null) ||
    (document.querySelector('#reg-password input, input[type="password"]') as HTMLInputElement | null)
  const firstNameInput = document.getElementById('reg-firstname') as HTMLInputElement | null
  const lastNameInput = document.getElementById('reg-lastname') as HTMLInputElement | null
  const dniInput = document.getElementById('reg-dni') as HTMLInputElement | null

  const cleanEmail = (emailInput?.value || username.value || '').trim()
  const cleanPassword = (passwordInput?.value || password.value || '').trim()
  const cleanFirstName = (firstNameInput?.value || firstName.value || '').trim()
  const cleanLastName = (lastNameInput?.value || lastName.value || '').trim()
  const cleanDni = (dniInput?.value || dni.value || '').trim()

  if (!cleanEmail || !cleanPassword || !cleanFirstName || !cleanLastName) {
    iamStore.error = 'Por favor complete todos los campos obligatorios.'
    return
  }

  if (cleanDni && cleanDni.length !== 8) {
    iamStore.error = 'El DNI debe tener exactamente 8 dígitos. Corrígelo o déjalo vacío.'
    return
  }

  if (!isPasswordValid.value) {
    iamStore.error = 'La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, un número y un carácter especial.'
    return
  }

  // Pre-requisite validation: Email OTP verification (Paso 1.1)
  if (!iamStore.emailVerified) {
    if (!otpSent.value) {
      await sendOtp()
    }
    iamStore.error = 'Por favor valida el código OTP de 6 dígitos enviado a tu correo antes de continuar.'
    return
  }

  // Step 1: Execute POST /api/v1/auth/registrations (as per Section 2 / 1.2)
  const signUpCommand = new SignUpCommand({
    username: cleanEmail,
    email: cleanEmail,
    password: cleanPassword,
    firstName: cleanFirstName,
    lastName: cleanLastName,
    roles: ['ROLE_USER']
  })

  const createdUser = await iamStore.signUp(signUpCommand)
  if (!createdUser || !createdUser.id) {
    return
  }

  // Step 2: Auto-login to obtain session & token (POST /api/v1/auth/sessions)
  const signInOk = await iamStore.signIn(new SignInCommand({
    username: cleanEmail,
    password: cleanPassword
  }))

  if (!signInOk) {
    return
  }

  const userId = iamStore.currentUser?.id || createdUser.id

  // Cache user names in localStorage for session profile fallback
  if (cleanFirstName) localStorage.setItem('user_first_name', cleanFirstName)
  if (cleanLastName) localStorage.setItem('user_last_name', cleanLastName)
  const fullDisplayName = `${cleanFirstName} ${cleanLastName}`.trim()
  if (fullDisplayName) localStorage.setItem('user_name', fullDisplayName)

  // Step 3 & 4: Elevation flow based on selected account type
  if (accountType.value === 'dealer') {
    if (!corporateRuc.value || corporateRuc.value.length !== 11 || !companyName.value) {
      iamStore.error = 'Por favor ingrese el RUC de 11 dígitos y la Razón Social de la concesionaria.'
      return
    }

    const dealerRoleOk = await iamStore.requestDealerRole(new RoleRequestCommand({
      userId,
      ruc: corporateRuc.value.trim(),
      companyName: companyName.value.trim()
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
    if (!corporateRuc.value || corporateRuc.value.length !== 11 || !companyName.value) {
      iamStore.error = 'Por favor ingrese el RUC de 11 dígitos y el Nombre de la Entidad Financiera.'
      return
    }

    const bankRoleOk = await iamStore.requestFinancialInstitutionRole(new RoleRequestCommand({
      userId,
      ruc: corporateRuc.value.trim(),
      companyName: companyName.value.trim()
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
    await profilesStore.createProfile(new CreateProfileCommand({
      fullLegalNames: resolvedLegalName,
      email: cleanEmail,
      nationalId: cleanDni || '00000000',
      mobilePhone: phoneNumber.value || '',
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
