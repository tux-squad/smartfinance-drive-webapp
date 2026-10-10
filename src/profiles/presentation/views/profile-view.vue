<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header dynamically adapted by Role -->
    <div class="border-b border-gray-100 pb-6 space-y-2">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
          {{ pageTitle }}
        </h1>
        <div>
          <span
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-2xs',
              isDealer
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : isFinancialInstitution
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            ]"
          >
            <i :class="roleBadgeIcon" class="text-xs"></i>
            <span>{{ roleBadgeText }}</span>
          </span>
        </div>
      </div>
      <p class="text-sm text-gray-500">
        {{ pageSubtitle }}
      </p>
    </div>

    <!-- Alert / Toast Messages -->
    <div
      v-if="saveSuccessMessage"
      class="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-sm text-emerald-800 flex items-center justify-between"
    >
      <div class="flex items-center space-x-2">
        <i class="pi pi-check-circle text-emerald-600 text-lg"></i>
        <span class="font-medium">{{ saveSuccessMessage }}</span>
      </div>
      <button type="button" @click="saveSuccessMessage = null" class="text-emerald-500 hover:text-emerald-700">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <div
      v-if="profilesStore.error"
      class="bg-red-50 border border-red-200 p-4 rounded-2xl text-sm text-red-800 flex items-center justify-between"
    >
      <div class="flex items-center space-x-2">
        <i class="pi pi-exclamation-circle text-red-600 text-lg"></i>
        <span>{{ profilesStore.error }}</span>
      </div>
      <button type="button" @click="profilesStore.error = null" class="text-red-400 hover:text-red-700">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <!-- 2-Column Form -->
    <form @submit.prevent="handleSaveProfile" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <!-- Column 1: Personal / Representative Info (Common to all roles) -->
        <div class="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div class="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <i class="pi pi-id-card text-sm"></i>
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900">{{ personalCardTitle }}</h2>
              <p class="text-xs text-gray-500">{{ personalCardSubtitle }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Nombres -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-gray-700">Nombres <span class="text-rose-500">*</span></label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  placeholder="Carlos"
                  class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                />
              </div>

              <!-- Apellidos -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-gray-700">Apellidos <span class="text-rose-500">*</span></label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  placeholder="Mendoza"
                  class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                />
              </div>
            </div>

            <!-- DNI -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-semibold text-gray-700">DNI / Documento de Identidad (8 dígitos) <span class="text-rose-500">*</span></label>
                <button
                  type="button"
                  :disabled="form.dni.length !== 8 || isQueryingReniec"
                  @click="handleLookupReniec"
                  class="text-[11px] font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 flex items-center gap-1 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <i :class="['pi', isQueryingReniec ? 'pi-spin pi-spinner' : 'pi-search', 'text-[10px]']" />
                  <span>{{ isQueryingReniec ? 'Consultando...' : 'Consultar RENIEC' }}</span>
                </button>
              </div>
              <input
                v-model="form.dni"
                type="text"
                maxlength="8"
                required
                @input="form.dni = form.dni.replace(/\D/g, '').slice(0, 8)"
                placeholder="72345678"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
              />
              <p
                v-if="reniecMessage"
                :class="[
                  'text-[11px] flex items-center gap-1.5 font-medium mt-1',
                  reniecSuccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                ]"
              >
                <i :class="['pi text-[10px]', reniecSuccess ? 'pi-check-circle' : 'pi-exclamation-circle']" />
                <span>{{ reniecMessage }}</span>
              </p>
            </div>

            <!-- Fecha de Nacimiento (Mayor de 18 años) -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-semibold text-gray-700">Fecha de Nacimiento <span class="text-rose-500">*</span></label>
                <span class="text-[10px] text-gray-400">Mayor de 18 años</span>
              </div>
              <input
                v-model="form.dateOfBirth"
                type="date"
                required
                min="1920-01-01"
                :max="maxDateOfBirth"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            <!-- Correo Electrónico -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Correo Electrónico <span class="text-rose-500">*</span></label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="carlos.mendoza@email.com"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            <!-- Teléfono / Celular -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-semibold text-gray-700">Teléfono / Celular <span class="text-rose-500">*</span></label>
                <span v-if="phoneValidationStatus === 'valid'" class="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <i class="pi pi-check-circle"></i> Celular válido
                </span>
                <span v-else-if="phoneValidationStatus === 'invalid'" class="text-[10px] font-medium text-rose-500 flex items-center gap-1">
                  <i class="pi pi-exclamation-circle"></i> 9 dígitos (inicia con 9)
                </span>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-slate-500 gap-1.5 select-none">
                  <span>🇵🇪 +51</span>
                  <span class="text-slate-300">|</span>
                </div>
                <input
                  v-model="form.phoneNumber"
                  type="tel"
                  maxlength="11"
                  placeholder="987 654 321"
                  @input="handlePhoneInput"
                  :class="[
                    'w-full pl-20 pr-3.5 py-2.5 bg-gray-50/50 border rounded-xl text-xs font-mono font-medium text-gray-900 focus:bg-white focus:outline-none transition-all shadow-2xs',
                    phoneValidationStatus === 'invalid'
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-gray-200 focus:ring-2 focus:ring-blue-600'
                  ]"
                />
              </div>
              <p class="text-[10px] text-gray-400">
                Formato oficial de 9 dígitos para Perú. Ejemplo: 987 654 321.
              </p>
            </div>
          </div>
        </div>

        <!-- Column 2: Role-Specific Profile Section -->

        <!-- CASE 1: BUYER -> Financial Profile -->
        <div v-if="isBuyer" class="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div class="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <i class="pi pi-wallet text-sm"></i>
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900">Perfil Financiero</h2>
              <p class="text-xs text-gray-500">Datos para evaluar capacidad de pago y tasas preferenciales</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Ingreso Mensual -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-gray-700">Ingreso Mensual Neto</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-gray-400 font-bold">
                    {{ form.currency === 'USD' ? '$' : 'S/' }}
                  </span>
                  <input
                    v-model.number="form.monthlyIncomeAmount"
                    type="number"
                    min="0"
                    step="100"
                    required
                    placeholder="3500.00"
                    class="w-full pl-8 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                  />
                </div>
              </div>

              <!-- Moneda Declarada -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-gray-700">Moneda de Ingresos</label>
                <select
                  v-model="form.currency"
                  class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs cursor-pointer"
                >
                  <option value="PEN">Soles (PEN - S/)</option>
                  <option value="USD">Dólares (USD - $)</option>
                </select>
              </div>
            </div>

            <!-- Situación Laboral -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Situación Laboral</label>
              <select
                v-model="form.employmentStatus"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs cursor-pointer"
              >
                <option value="dependent">Dependiente - Tiempo Completo (Planilla)</option>
                <option value="independent">Independiente con RUC (4ta / 5ta categoría)</option>
                <option value="business">Empresario / Accionista (3ra categoría)</option>
              </select>
            </div>

            <!-- Acreditación Crediticia Badge Box -->
            <div class="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-700">Historial Crediticio</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <i class="pi pi-check-circle mr-1 text-[10px]"></i>
                  Acreditado SBS
                </span>
              </div>
              <p class="text-[11px] text-gray-500 leading-relaxed">
                Tus datos financieros te permiten acceder a pre-aprobaciones automáticas en menos de 24 horas a través de nuestras entidades bancarias aliadas.
              </p>
            </div>
          </div>
        </div>

        <!-- CASE 2: DEALER -> Dealership Corporate Profile -->
        <div v-else-if="isDealer" class="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div class="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <i class="pi pi-building text-sm"></i>
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900">Datos de la Concesionaria</h2>
              <p class="text-xs text-gray-500">Identidad comercial y registro oficial de la agencia</p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Razón Social / Nombre Comercial -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Nombre Comercial de la Concesionaria</label>
              <input
                v-model="dealerBusinessName"
                type="text"
                placeholder="AutoSur Motors SAC"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
              />
            </div>

            <!-- RUC SUNAT -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Número de RUC (SUNAT CIIU 451)</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="dealerRuc"
                  type="text"
                  readonly
                  class="flex-1 px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-mono font-semibold text-gray-700 cursor-not-allowed shadow-2xs"
                />
                <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold shrink-0">
                  Verificado
                </span>
              </div>
            </div>

            <!-- Dirección Física -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Sede Principal / Showroom</label>
              <input
                v-model="dealerAddress"
                type="text"
                placeholder="Av. Javier Prado Este 4520, Surco, Lima"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
              />
            </div>

            <!-- Inventory Summary Widget -->
            <div class="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-gray-800">Inventario Activo</span>
                  <div class="text-[11px] text-gray-500">Unidades publicadas en el catálogo</div>
                </div>
                <span class="text-lg font-black text-gray-900">{{ dealerVehiclesCount }} autos</span>
              </div>
              <div class="flex items-center gap-2 pt-1">
                <router-link
                  to="/dealer/inventory"
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  <span>Gestionar inventario</span>
                  <i class="pi pi-arrow-right text-[10px]"></i>
                </router-link>
                <span class="text-gray-300">•</span>
                <router-link
                  to="/dealer/settings/appearance"
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-[#eb8f47] hover:text-[#d97c36]"
                >
                  <span>Editar tienda</span>
                  <i class="pi pi-external-link text-[10px]"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- CASE 3: FINANCIAL INSTITUTION -> Bank Institutional Profile -->
        <div v-else-if="isFinancialInstitution" class="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div class="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
              <i class="pi pi-building-columns text-sm"></i>
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900">Identidad Institucional</h2>
              <p class="text-xs text-gray-500">Entidad bancaria y productos crediticios ofertados</p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Institutional Multimedia (Logo & Banner) -->
            <div class="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800">Recursos Multimedia del Banco</span>
              </div>

              <!-- Logo Upload Row -->
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shadow-2xs shrink-0">
                  <img
                    v-if="bankLogoUrl"
                    :src="bankLogoUrl"
                    alt="Logo del Banco"
                    class="w-full h-full object-contain p-1.5"
                  />
                  <i v-else class="pi pi-building-columns text-2xl text-blue-400"></i>
                </div>
                <div class="space-y-1 flex-1">
                  <input
                    ref="logoInputRef"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                    class="hidden"
                    @change="handleBankLogoSelected"
                  />
                  <button
                    type="button"
                    :disabled="isUploadingLogo"
                    @click="triggerBankLogoUpload"
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                  >
                    <i v-if="isUploadingLogo" class="pi pi-spin pi-spinner text-xs text-blue-600"></i>
                    <i v-else class="pi pi-upload text-xs text-blue-600"></i>
                    <span>{{ isUploadingLogo ? 'Subiendo...' : 'Subir Logotipo' }}</span>
                  </button>
                  <p class="text-[10px] text-slate-400">
                    PNG, JPG, WebP o SVG con fondo transparente.
                  </p>
                </div>
              </div>

              <!-- Banner Upload Row -->
              <div class="space-y-1.5 pt-2 border-t border-slate-200/60">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-bold text-slate-700">Banner Promocional</span>
                  <span class="text-[10px] font-mono text-slate-400">Recomendado 1200x400 px</span>
                </div>
                <input
                  ref="bannerInputRef"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  class="hidden"
                  @change="handleBankBannerSelected"
                />
                <div
                  @click="triggerBankBannerUpload"
                  class="w-full h-24 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white/70 hover:bg-blue-50/20 cursor-pointer transition-all relative overflow-hidden flex flex-col items-center justify-center p-3 text-center group shadow-2xs"
                >
                  <template v-if="bankBannerUrl">
                    <img :src="bankBannerUrl" alt="Banner del Banco" class="absolute inset-0 w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-2xs">
                      <i v-if="isUploadingBanner" class="pi pi-spin pi-spinner text-xs"></i>
                      <i v-else class="pi pi-image text-xs"></i>
                      <span>{{ isUploadingBanner ? 'Subiendo banner...' : 'Cambiar Banner' }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <i v-if="isUploadingBanner" class="pi pi-spin pi-spinner text-blue-600 text-lg mb-0.5"></i>
                    <i v-else class="pi pi-images text-slate-400 text-lg mb-0.5 group-hover:text-blue-500 transition-colors"></i>
                    <span class="text-xs font-bold text-slate-700">
                      {{ isUploadingBanner ? 'Subiendo banner...' : 'Subir Banner Promocional' }}
                    </span>
                    <span class="text-[10px] text-slate-400">Clic para seleccionar imagen</span>
                  </template>
                </div>
              </div>
            </div>

            <!-- Razón Social del Banco -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Razón Social del Banco</label>
              <input
                v-model="bankEntityName"
                type="text"
                readonly
                class="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 cursor-not-allowed shadow-2xs"
              />
            </div>

            <!-- RUC Institucional -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">RUC Institucional (SUNAT CIIU 6419)</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="bankRuc"
                  type="text"
                  readonly
                  class="flex-1 px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-mono font-semibold text-gray-700 cursor-not-allowed shadow-2xs"
                />
                <span class="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-[10px] font-bold shrink-0">
                  Regulado SBS
                </span>
              </div>
            </div>

            <!-- Rate Benchmarks Active Widget -->
            <div class="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-blue-950">Tasas de Referencia TEA Activas</span>
                <span class="text-[10px] font-bold text-blue-700">{{ bankBenchmarks.length }} plazos</span>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs">
                <div
                  v-for="b in bankBenchmarks"
                  :key="b.loanTermMonths"
                  class="p-2.5 bg-white rounded-xl border border-blue-100 flex items-center justify-between shadow-2xs"
                >
                  <span class="text-gray-600 font-medium">{{ b.loanTermMonths }} meses</span>
                  <span class="font-extrabold text-blue-900">{{ b.annualEffectiveRate }}% TEA</span>
                </div>
              </div>

              <div class="pt-1">
                <router-link
                  to="/concessionaries/entities"
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
                >
                  <i class="pi pi-cog text-xs"></i>
                  <span>Administrar tasas y productos bancarios</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Button: Guardar cambios -->
      <div class="flex justify-end items-center pt-2">
        <button
          type="submit"
          :disabled="isSaving"
          class="px-6 py-2.5 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] disabled:opacity-50 text-white font-semibold text-xs text-center shadow-xs transition-colors flex items-center gap-2"
        >
          <i v-if="isSaving" class="pi pi-spin pi-spinner text-xs"></i>
          <i v-else class="pi pi-save text-xs"></i>
          <span>Guardar cambios</span>
        </button>
      </div>
    </form>

    <!-- If Buyer: Optional Accreditation Card to elevate to Dealer or Bank -->
    <div v-if="isBuyer" class="bg-white dark:bg-surface-900 rounded-2xl border border-dashed border-gray-300 dark:border-surface-700 p-6 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
            <i class="pi pi-building"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900 dark:text-surface-100">¿Deseas acreditar esta cuenta como Concesionaria o Banco?</h3>
            <p class="text-xs text-gray-500 dark:text-surface-400">
              Si tu cuenta está como Comprador pero deseas acceder al panel y catálogo de Concesionaria o Financiera, valida tu RUC SUNAT para elevar tu rol al instante.
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="showElevation = !showElevation"
          class="px-4 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shrink-0 cursor-pointer"
        >
          <i class="pi pi-verified mr-1.5"></i>
          <span>{{ showElevation ? 'Ocultar' : 'Acreditar Empresa' }}</span>
        </button>
      </div>

      <!-- Expandable Elevation Form -->
      <div v-if="showElevation" class="pt-4 border-t border-gray-100 dark:border-surface-800 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="space-y-1 sm:col-span-1">
            <label class="block text-xs font-semibold text-gray-700 dark:text-surface-300">Tipo de Empresa</label>
            <select
              v-model="elevationType"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-xl text-xs font-medium text-gray-800 dark:text-surface-200"
            >
              <option value="dealer">Concesionaria (CIIU 451)</option>
              <option value="bank">Entidad Financiera (CIIU 64/66)</option>
            </select>
          </div>

          <div class="space-y-1 sm:col-span-1">
            <label class="block text-xs font-semibold text-gray-700 dark:text-surface-300">Número de RUC (11 dígitos)</label>
            <div class="flex items-center gap-1.5">
              <input
                v-model="elevationRuc"
                type="text"
                maxlength="11"
                placeholder="20100138019"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-xl text-xs font-mono text-gray-900 dark:text-surface-100"
              />
              <button
                type="button"
                :disabled="elevationRuc.length !== 11 || isElevatingRuc"
                @click="handleLookupElevationRuc"
                class="px-2.5 py-2 rounded-xl bg-gray-100 dark:bg-surface-800 hover:bg-gray-200 text-gray-700 dark:text-surface-300 text-xs font-bold shrink-0 disabled:opacity-50"
              >
                <i :class="['pi', isElevatingRuc ? 'pi-spin pi-spinner' : 'pi-search', 'text-xs']" />
              </button>
            </div>
          </div>

          <div class="space-y-1 sm:col-span-1">
            <label class="block text-xs font-semibold text-gray-700 dark:text-surface-300">Razón Social</label>
            <input
              v-model="elevationCompanyName"
              type="text"
              placeholder="Toyota del Perú S.A."
              class="w-full px-3 py-2 bg-gray-50 dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-xl text-xs text-gray-900 dark:text-surface-100"
            />
          </div>
        </div>

        <div class="flex justify-end pt-1">
          <button
            type="button"
            :disabled="isSubmittingElevation || elevationRuc.length !== 11 || !elevationCompanyName"
            @click="handleExecuteElevation"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <i v-if="isSubmittingElevation" class="pi pi-spin pi-spinner text-xs"></i>
            <i v-else class="pi pi-check text-xs"></i>
            <span>Confirmar y Acreditar Rol</span>
          </button>
        </div>
      </div>
    </div>

    <!-- If Dealer: Show official accredited badge card -->
    <div v-if="isDealer" class="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
          <i class="pi pi-verified"></i>
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900">Acreditación Oficial de Concesionaria</h3>
          <p class="text-xs text-gray-500">
            Tu empresa se encuentra registrada y habilitada para publicar vehículos y recibir solicitudes directas.
          </p>
        </div>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        Activa y Operativa
      </span>
    </div>

    <!-- If Financial Institution: Show SBS regulatory card -->
    <div v-else-if="isFinancialInstitution" class="bg-white rounded-2xl border border-blue-200 p-6 shadow-xs flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl">
          <i class="pi pi-shield"></i>
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900">Acreditación Regulatoria SBS y SUNAT</h3>
          <p class="text-xs text-gray-500">
            Institución financiera autorizada para ofertar productos de crédito vehicular y recibir simulaciones.
          </p>
        </div>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
        Supervisada
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useIamStore } from '@/iam/application/iam.store'
import { useProfilesStore } from '../../application/profiles.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { usePartnersStore } from '@/partners/application/partners.store'
import { CreateProfileCommand } from '../../domain/create-profile.command'
import { UpdateProfileCommand } from '../../domain/update-profile.command'
import { RoleRequestCommand } from '@/iam/domain/role-request.command'

const route = useRoute()
const iamStore = useIamStore()
const profilesStore = useProfilesStore()
const catalogStore = useCatalogStore()
const partnersStore = usePartnersStore()

const isSaving = ref(false)
const saveSuccessMessage = ref<string | null>(null)

// Elevation State
const showElevation = ref(false)
const elevationType = ref<'dealer' | 'bank'>('dealer')
const elevationRuc = ref('20100138019')
const elevationCompanyName = ref('Toyota del Perú S.A.')
const isElevatingRuc = ref(false)
const isSubmittingElevation = ref(false)

const handleLookupElevationRuc = async () => {
  if (elevationRuc.value.length !== 11) return
  isElevatingRuc.value = true
  try {
    const res = await iamStore.lookupRuc(elevationRuc.value)
    if (res) {
      elevationCompanyName.value = res.razonSocial || (res as any).companyName || elevationCompanyName.value
    }
  } finally {
    isElevatingRuc.value = false
  }
}

const handleExecuteElevation = async () => {
  const userId = iamStore.currentUser?.id || localStorage.getItem('user_id')
  if (!userId || elevationRuc.value.length !== 11) return

  isSubmittingElevation.value = true
  profilesStore.error = null
  try {
    const cmd = new RoleRequestCommand({
      userId: String(userId),
      ruc: elevationRuc.value.trim(),
      companyName: elevationCompanyName.value.trim()
    })

    let ok = false
    if (elevationType.value === 'dealer') {
      ok = await iamStore.requestDealerRole(cmd)
    } else {
      ok = await iamStore.requestFinancialInstitutionRole(cmd)
    }

    if (ok) {
      saveSuccessMessage.value = elevationType.value === 'dealer'
        ? '¡Cuenta acreditada con éxito como Concesionaria Oficial!'
        : '¡Cuenta acreditada con éxito como Entidad Financiera!'
      showElevation.value = false
      if (elevationType.value === 'dealer') {
        dealerBusinessName.value = elevationCompanyName.value
        dealerRuc.value = elevationRuc.value
        await catalogStore.fetchVehicles()
      } else {
        bankEntityName.value = elevationCompanyName.value
        bankRuc.value = elevationRuc.value
      }
    }
  } finally {
    isSubmittingElevation.value = false
  }
}

// Maximum date for $\ge$ 18 years old
const maxDateOfBirth = computed(() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 18)
  return d.toISOString().split('T')[0]
})

// Role computed checks
const isDealer = computed(() => iamStore.roles.includes('ROLE_DEALER'))
const isFinancialInstitution = computed(() => iamStore.roles.includes('ROLE_FINANCIAL_INSTITUTION'))
const isBuyer = computed(() => !isDealer.value && !isFinancialInstitution.value)

// Dynamic Titles
const pageTitle = computed(() => {
  if (isDealer.value) return 'Perfil de Concesionaria'
  if (isFinancialInstitution.value) return 'Perfil de Entidad Financiera'
  return 'Mi Perfil'
})

const pageSubtitle = computed(() => {
  if (isDealer.value) return 'Gestiona los datos de tu empresa automotriz, acreditación oficial y contacto del representante.'
  if (isFinancialInstitution.value) return 'Administra los datos institucionales del banco, acreditación regulatoria SBS y tasas activas.'
  return 'Gestiona tu información personal y datos financieros para tus pre-evaluaciones de crédito vehicular.'
})

const roleBadgeText = computed(() => {
  if (isDealer.value) return 'Concesionario Oficial Acreditado'
  if (isFinancialInstitution.value) return 'Entidad Financiera Acreditada SBS'
  return 'Comprador Pre-aprobado'
})

const roleBadgeIcon = computed(() => {
  if (isDealer.value) return 'pi pi-car'
  if (isFinancialInstitution.value) return 'pi pi-building-columns'
  return 'pi pi-user'
})

const personalCardTitle = computed(() => {
  if (isDealer.value) return 'Representante Comercial'
  if (isFinancialInstitution.value) return 'Funcionario de Crédito'
  return 'Información Personal'
})

const personalCardSubtitle = computed(() => {
  if (isDealer.value) return 'Datos del contacto responsable de la concesionaria'
  if (isFinancialInstitution.value) return 'Datos del asesor o gestor financiero autorizado'
  return 'Datos oficiales de identificación del comprador'
})

// Form Data
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  dni: '',
  dateOfBirth: '',
  phoneNumber: '',
  monthlyIncomeAmount: 0,
  currency: 'PEN',
  employmentStatus: 'dependent'
})

// Dealer Data
const dealerBusinessName = ref('')
const dealerRuc = ref('')
const dealerAddress = ref('')
const dealerVehiclesList = ref<import('@/catalog/domain/vehicle.entity').Vehicle[]>([])
const dealerVehiclesCount = computed(() => dealerVehiclesList.value.length)

// Bank Data
const bankEntityName = ref('')
const bankRuc = ref('')
const isUploadingLogo = ref(false)
const isUploadingBanner = ref(false)
const logoInputRef = ref<HTMLInputElement | null>(null)
const bannerInputRef = ref<HTMLInputElement | null>(null)

const bankLogoUrl = computed(() => {
  return partnersStore.myFinancialEntity?.logoUrl || (partnersStore.financialEntities.length > 0 ? partnersStore.financialEntities[0]?.logoUrl : null)
})

const bankBannerUrl = computed(() => {
  return partnersStore.myFinancialEntity?.bannerUrl || (partnersStore.financialEntities.length > 0 ? partnersStore.financialEntities[0]?.bannerUrl : null)
})

const bankBenchmarks = computed(() => {
  if (partnersStore.myFinancialEntity?.rateBenchmarks && partnersStore.myFinancialEntity.rateBenchmarks.length > 0) {
    return partnersStore.myFinancialEntity.rateBenchmarks
  }
  if (partnersStore.financialEntities.length > 0 && partnersStore.financialEntities[0]?.rateBenchmarks) {
    return partnersStore.financialEntities[0].rateBenchmarks
  }
  return []
})

const triggerBankLogoUpload = () => {
  logoInputRef.value?.click()
}

const triggerBankBannerUpload = () => {
  bannerInputRef.value?.click()
}

const handleBankLogoSelected = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  isUploadingLogo.value = true
  try {
    const updated = await partnersStore.uploadMyFinancialEntityLogo(file)
    if (updated) {
      saveSuccessMessage.value = 'Logo corporativo subido exitosamente.'
    }
  } catch (err: any) {
    profilesStore.error = err?.message || 'Error al subir el logo corporativo.'
  } finally {
    isUploadingLogo.value = false
    if (target) target.value = ''
  }
}

const handleBankBannerSelected = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  isUploadingBanner.value = true
  try {
    const updated = await partnersStore.uploadMyFinancialEntityBanner(file)
    if (updated) {
      saveSuccessMessage.value = 'Banner publicitario subido exitosamente.'
    }
  } catch (err: any) {
    profilesStore.error = err?.message || 'Error al subir el banner publicitario.'
  } finally {
    isUploadingBanner.value = false
    if (target) target.value = ''
  }
}

// Phone Validation & Mask State
const cleanPhoneDigits = computed(() => {
  return form.phoneNumber.replace(/\D/g, '')
})

const isPhoneValid = computed(() => {
  const digits = cleanPhoneDigits.value
  if (!digits) return false
  return digits.length === 9 && digits.startsWith('9')
})

const phoneValidationStatus = computed<'empty' | 'valid' | 'invalid'>(() => {
  const digits = cleanPhoneDigits.value
  if (!digits) return 'empty'
  if (digits.length === 9 && digits.startsWith('9')) return 'valid'
  return 'invalid'
})

const handlePhoneInput = () => {
  let digits = form.phoneNumber.replace(/\D/g, '')
  if (digits.startsWith('51') && digits.length > 9) {
    digits = digits.slice(2)
  }
  digits = digits.slice(0, 9)
  if (digits.length > 6) {
    form.phoneNumber = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  } else if (digits.length > 3) {
    form.phoneNumber = `${digits.slice(0, 3)} ${digits.slice(3)}`
  } else {
    form.phoneNumber = digits
  }
}

// RENIEC Lookup State
const isQueryingReniec = ref(false)
const reniecMessage = ref<string | null>(null)
const reniecSuccess = ref<boolean | null>(null)

const handleLookupReniec = async () => {
  if (!form.dni || form.dni.length !== 8) {
    reniecMessage.value = 'El DNI debe tener 8 dígitos numéricos.'
    reniecSuccess.value = false
    return
  }
  isQueryingReniec.value = true
  reniecMessage.value = null
  try {
    const res = await iamStore.lookupDni(form.dni)
    if (res && res.dni) {
      reniecSuccess.value = true
      if (res.firstNames) form.firstName = res.firstNames
      if (res.paternalSurname || res.maternalSurname) {
        form.lastName = `${res.paternalSurname || ''} ${res.maternalSurname || ''}`.trim()
      } else if (res.fullLegalName) {
        const parts = res.fullLegalName.split(' ')
        if (!form.firstName) form.firstName = parts[0] || ''
        if (!form.lastName) form.lastName = parts.slice(1).join(' ') || ''
      }
      reniecMessage.value = `Validado con RENIEC: ${res.fullLegalName || form.firstName}`
    } else {
      reniecSuccess.value = false
      reniecMessage.value = 'No se encontró información para el DNI ingresado.'
    }
  } catch {
    reniecSuccess.value = false
    reniecMessage.value = 'Error al consultar el servicio de RENIEC.'
  } finally {
    isQueryingReniec.value = false
  }
}

const populateFormData = () => {
  const p = profilesStore.currentProfile
  if (p) {
    form.firstName = p.firstName || ''
    form.lastName = p.lastName || ''
    form.email = p.email || ''
    form.dni = p.dni || ''
    form.dateOfBirth = p.dateOfBirth || ''
    if (p.phoneNumber) {
      let digits = p.phoneNumber.replace(/\D/g, '')
      if (digits.startsWith('51') && digits.length > 9) digits = digits.slice(2)
      digits = digits.slice(0, 9)
      if (digits.length === 9) {
        form.phoneNumber = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
      } else {
        form.phoneNumber = digits
      }
    } else {
      form.phoneNumber = ''
    }
    form.monthlyIncomeAmount = p.monthlyIncomeAmount || 3500
    form.currency = p.currency || 'PEN'
    form.employmentStatus = p.employmentStatus || 'dependent'
  } else {
    const u = iamStore.currentUser
    if (u) {
      if (u.username?.includes('@')) {
        form.email = u.username
      }
      const savedFirstName = localStorage.getItem('user_first_name') || ''
      const savedLastName = localStorage.getItem('user_last_name') || ''
      const savedName = localStorage.getItem('user_name') || ''
      if (savedFirstName) {
        form.firstName = savedFirstName
      }
      if (savedLastName) {
        form.lastName = savedLastName
      }
      if (!form.firstName && savedName && !savedName.includes('@')) {
        const parts = savedName.split(' ')
        form.firstName = parts[0] || ''
        form.lastName = parts.slice(1).join(' ') || ''
      }
    }
  }
}

onMounted(async () => {
  profilesStore.error = null
  const userId = iamStore.currentUser?.id || localStorage.getItem('user_id')
  const profileIdParam = (route.query.profileId as string) || ''
  const promises: Promise<any>[] = []

  if (profileIdParam) {
    promises.push(profilesStore.fetchProfileById(profileIdParam))
  } else if (userId) {
    promises.push(profilesStore.fetchProfileByUserId(userId))
  }
  if (isDealer.value) {
    promises.push(catalogStore.fetchVehiclesByUserId().then(v => {
      dealerVehiclesList.value = v || []
    }).catch(() => {
      dealerVehiclesList.value = []
    }))
    promises.push(partnersStore.fetchMyDealership().then(d => {
      if (d) {
        dealerBusinessName.value = d.name || ''
        dealerRuc.value = d.ruc || ''
        dealerAddress.value = d.address || ''
      }
    }))
  }
  if (isFinancialInstitution.value) {
    promises.push(
      partnersStore.fetchMyFinancialEntity().then(entity => {
        if (entity) {
          bankEntityName.value = entity.name || ''
          bankRuc.value = entity.ruc || ''
        } else {
          return partnersStore.fetchFinancialEntities().then(() => {
            if (partnersStore.financialEntities.length > 0) {
              bankEntityName.value = partnersStore.financialEntities[0]?.name || ''
              bankRuc.value = partnersStore.financialEntities[0]?.ruc || ''
            }
          })
        }
      }).catch(() => {
        return partnersStore.fetchFinancialEntities().then(() => {
          if (partnersStore.financialEntities.length > 0) {
            bankEntityName.value = partnersStore.financialEntities[0]?.name || ''
            bankRuc.value = partnersStore.financialEntities[0]?.ruc || ''
          }
        })
      })
    )
  }

  await Promise.all(promises)
  populateFormData()
})

const handleSaveProfile = async () => {
  isSaving.value = true
  saveSuccessMessage.value = null
  profilesStore.error = null

  try {
    const cleanFirst = form.firstName.trim()
    const cleanLast = form.lastName.trim()
    const cleanEmail = form.email.trim() || iamStore.username || 'usuario@smartfinance.com'
    const cleanDni = form.dni.trim()
    const cleanDob = form.dateOfBirth || '2000-01-01'
    const digits = cleanPhoneDigits.value
    if (!digits || !isPhoneValid.value) {
      profilesStore.error = 'Por favor ingresa un número de celular válido para Perú (9 dígitos que empiece con 9).'
      isSaving.value = false
      return
    }
    const cleanPhone = `+51 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`

    if (profilesStore.hasProfile && profilesStore.currentProfile?.id) {
      const command = new UpdateProfileCommand({
        profileId: profilesStore.currentProfile.id,
        firstName: cleanFirst,
        lastName: cleanLast,
        email: cleanEmail,
        dni: cleanDni,
        dateOfBirth: cleanDob,
        phoneNumber: cleanPhone,
        monthlyIncomeAmount: Number(form.monthlyIncomeAmount) || 0,
        currency: form.currency || 'PEN',
        employmentStatus: form.employmentStatus || 'EMPLOYED'
      })
      const success = await profilesStore.updateProfile(command)
      if (success) {
        saveSuccessMessage.value = 'Información de perfil actualizada con éxito.'
        if (cleanFirst) localStorage.setItem('user_first_name', cleanFirst)
        if (cleanLast) localStorage.setItem('user_last_name', cleanLast)
        if (isDealer.value && (dealerBusinessName.value || dealerAddress.value)) {
          await partnersStore.updateMyDealership({
            name: dealerBusinessName.value,
            address: dealerAddress.value,
            ruc: dealerRuc.value
          })
        }
      }
    } else {
      const command = new CreateProfileCommand({
        userId: String(iamStore.currentUser?.id || localStorage.getItem('user_id') || '1'),
        firstName: cleanFirst,
        lastName: cleanLast,
        email: cleanEmail,
        dni: cleanDni,
        dateOfBirth: cleanDob,
        phoneNumber: cleanPhone,
        monthlyIncomeAmount: Number(form.monthlyIncomeAmount) || 0,
        currency: form.currency || 'PEN',
        employmentStatus: form.employmentStatus || 'EMPLOYED'
      })
      const success = await profilesStore.createProfile(command)
      if (success) {
        saveSuccessMessage.value = 'Perfil guardado con éxito.'
        if (cleanFirst) localStorage.setItem('user_first_name', cleanFirst)
        if (cleanLast) localStorage.setItem('user_last_name', cleanLast)
        const full = `${cleanFirst} ${cleanLast}`.trim()
        if (full) localStorage.setItem('user_name', full)
        if (isDealer.value && (dealerBusinessName.value || dealerAddress.value)) {
          await partnersStore.updateMyDealership({
            name: dealerBusinessName.value,
            address: dealerAddress.value,
            ruc: dealerRuc.value
          })
        }
      }
    }
  } catch {
    // Error is handled in store
  } finally {
    isSaving.value = false
    setTimeout(() => {
      saveSuccessMessage.value = null
    }, 4000)
  }
}
</script>

<style scoped>
</style>
