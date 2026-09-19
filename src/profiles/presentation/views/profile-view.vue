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
                <label class="block text-xs font-semibold text-gray-700">Nombres</label>
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
                <label class="block text-xs font-semibold text-gray-700">Apellidos</label>
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
              <label class="block text-xs font-semibold text-gray-700">DNI / Documento de Identidad</label>
              <input
                v-model="form.dni"
                type="text"
                maxlength="8"
                required
                placeholder="72345678"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            <!-- Correo Electrónico -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Correo Electrónico</label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="carlos.mendoza@email.com"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            <!-- Teléfono -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Teléfono / Celular</label>
              <input
                v-model="form.phoneNumber"
                type="tel"
                placeholder="+51 987 654 321"
                class="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
              />
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
      <div class="flex justify-start">
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

    <!-- Bottom Role Elevation / Accreditation Section -->
    <!-- If Buyer: allow elevation via SUNAT -->
    <DealerRoleRequestCard v-if="isBuyer" />

    <!-- If Dealer: Show official accredited badge card -->
    <div v-else-if="isDealer" class="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs flex items-center justify-between">
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
import { useIamStore } from '@/iam/application/iam.store'
import { useProfilesStore } from '../../application/profiles.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { usePartnersStore } from '@/partners/application/partners.store'
import { CreateProfileCommand } from '../../domain/create-profile.command'
import { UpdateProfileCommand } from '../../domain/update-profile.command'
import DealerRoleRequestCard from '@/iam/presentation/components/dealer-role-request-card.vue'

const iamStore = useIamStore()
const profilesStore = useProfilesStore()
const catalogStore = useCatalogStore()
const partnersStore = usePartnersStore()

const isSaving = ref(false)
const saveSuccessMessage = ref<string | null>(null)

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
  phoneNumber: '',
  monthlyIncomeAmount: 0,
  currency: 'PEN',
  employmentStatus: 'dependent'
})

// Dealer Data
const dealerBusinessName = ref('AutoSur Motors SAC')
const dealerRuc = ref('20100138019')
const dealerAddress = ref('Av. Javier Prado Este 4520, Surco, Lima')
const dealerVehiclesCount = computed(() => catalogStore.vehicles.length)

// Bank Data
const bankEntityName = ref('Banco de Crédito del Perú (BCP)')
const bankRuc = ref('20100047218')
const bankBenchmarks = computed(() => {
  if (partnersStore.financialEntities.length > 0 && partnersStore.financialEntities[0]?.rateBenchmarks) {
    return partnersStore.financialEntities[0].rateBenchmarks
  }
  return [
    { loanTermMonths: 24, annualEffectiveRate: 8.90 },
    { loanTermMonths: 36, annualEffectiveRate: 9.50 },
    { loanTermMonths: 48, annualEffectiveRate: 10.20 },
    { loanTermMonths: 60, annualEffectiveRate: 10.80 }
  ]
})

const populateFormData = () => {
  const p = profilesStore.currentProfile
  if (p) {
    form.firstName = p.firstName || ''
    form.lastName = p.lastName || ''
    form.email = p.email || ''
    form.dni = p.dni || ''
    form.phoneNumber = p.phoneNumber || ''
    form.monthlyIncomeAmount = p.monthlyIncomeAmount || 0
    form.currency = p.currency || 'PEN'
  } else {
    const username = iamStore.username || ''
    if (username.includes('@')) {
      form.email = username
    }
  }
}

onMounted(async () => {
  const userId = iamStore.currentUser?.id || localStorage.getItem('user_id')
  const promises: Promise<any>[] = []

  if (userId) {
    promises.push(profilesStore.fetchProfileByUserId(userId))
  }
  if (isDealer.value) {
    promises.push(catalogStore.fetchVehicles())
  }
  if (isFinancialInstitution.value) {
    promises.push(partnersStore.fetchFinancialEntities())
  }

  await Promise.all(promises)
  populateFormData()

  if (partnersStore.financialEntities.length > 0 && partnersStore.financialEntities[0]?.name) {
    bankEntityName.value = partnersStore.financialEntities[0].name
  }
})

const handleSaveProfile = async () => {
  isSaving.value = true
  saveSuccessMessage.value = null

  try {
    if (profilesStore.hasProfile && profilesStore.currentProfile) {
      const command = new UpdateProfileCommand({
        profileId: profilesStore.currentProfile.id,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        dni: form.dni,
        phoneNumber: form.phoneNumber,
        monthlyIncomeAmount: Number(form.monthlyIncomeAmount),
        currency: form.currency
      })
      const success = await profilesStore.updateProfile(command)
      if (success) {
        saveSuccessMessage.value = 'Información de perfil actualizada con éxito.'
      }
    } else {
      const command = new CreateProfileCommand({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        dni: form.dni,
        phoneNumber: form.phoneNumber,
        monthlyIncomeAmount: Number(form.monthlyIncomeAmount),
        currency: form.currency
      })
      const success = await profilesStore.createProfile(command)
      if (success) {
        saveSuccessMessage.value = 'Perfil guardado con éxito.'
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
