<template>
  <header class="bg-white border-b border-gray-200 shadow-xs">
    <div class="flex justify-between items-center px-8 py-3.5">
      <!-- Breadcrumbs matching mockup -->
      <div class="flex items-center space-x-2 text-sm flex-wrap">
        <template v-for="(crumb, idx) in breadcrumbTrail" :key="idx">
          <span v-if="idx > 0" class="text-gray-400">/</span>
          <span :class="[idx === breadcrumbTrail.length - 1 ? 'text-blue-950 font-bold' : 'text-gray-500 font-medium']">
            {{ crumb }}
          </span>
        </template>
      </div>

      <div class="flex items-center space-x-5">
        <!-- Language Switcher -->
        <LanguageSwitcher />

        <!-- User Profile Pill matching mockup (Carlos Mendoza / Comprador Pre-aprobado) -->
        <div class="flex items-center space-x-3 text-right">
          <div>
            <div class="text-sm font-bold text-gray-900 leading-tight">
              {{ userDisplayName }}
            </div>
            <div class="text-[11px] text-gray-500 font-medium">
              {{ userRoleSubtitle }}
            </div>
          </div>
          <router-link
            to="/user"
            class="w-9 h-9 rounded-full bg-[#0d2a5c] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:opacity-90 transition-opacity shrink-0"
          >
            {{ userInitials }}
          </router-link>
        </div>

        <!-- Auth Section / Sign Out -->
        <div class="pl-2 border-l border-gray-200">
          <AuthenticationSection />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '@/iam/application/iam.store'
import { useProfilesStore } from '@/profiles/application/profiles.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { usePartnersStore } from '@/partners/application/partners.store'
import LanguageSwitcher from './language-switcher.vue'
import AuthenticationSection from '@/iam/presentation/components/authentication-section.vue'

const $route = useRoute()
const { t } = useI18n()
const iamStore = useIamStore()
const profilesStore = useProfilesStore()
const catalogStore = useCatalogStore()
const partnersStore = usePartnersStore()

const currentPanelTitle = computed(() => {
  const roles = iamStore.roles
  if (roles.includes('ROLE_ADMIN')) return t('header.adminPanel')
  if (roles.includes('ROLE_DEALER')) return t('header.dealerPanel')
  if (roles.includes('ROLE_FINANCIAL_INSTITUTION')) return t('header.bankPanel')
  return t('header.buyerPanel')
})

const currentSectionSubtitle = computed(() => {
  const path = $route.path
  if (path === '/user') return t('header.myProfile')
  if (path.startsWith('/reports/applications')) return t('header.applicationsReport')
  if (path === '/settings') return t('header.settings')
  if (path === '/consultation') return t('header.aiConsultation')
  if (path === '/concessionaries') return t('header.portalAllies')
  if (path === '/vehicles' || path === '/home') return t('header.portalAllies')

  const roles = iamStore.roles
  if (roles.includes('ROLE_ADMIN')) return t('header.adminSubtitle')
  if (roles.includes('ROLE_DEALER')) return t('header.dealerSubtitle')
  if (roles.includes('ROLE_FINANCIAL_INSTITUTION')) return t('header.bankSubtitle')
  return t('header.buyerSubtitle')
})

const breadcrumbTrail = computed<string[]>(() => {
  const panel = currentPanelTitle.value
  const path = $route.path

  // Dealership portal breadcrumbs matching mockups
  if (path === '/dealer/inventory/new') {
    return [panel, 'Inventario', 'Añadir Vehículo']
  }
  if (path === '/dealer/inventory') {
    return [panel, 'Gestión de Inventario']
  }
  if (path.startsWith('/dealer/prospects/') && path !== '/dealer/prospects') {
    return [panel, 'Prospectos', 'Detalle del Prospecto']
  }
  if (path === '/dealer/prospects') {
    return [panel, 'Prospectos']
  }
  if (path === '/dealer/messages') {
    return [panel, 'Mensajes']
  }
  if (path.startsWith('/dealer/settings')) {
    return [panel, 'Configuración', 'Apariencia']
  }
  if (path === '/home' && iamStore.roles.includes('ROLE_DEALER')) {
    return [panel, 'Dashboard']
  }

  if (path === '/messages') {
    return [panel, 'Mensajes']
  }
  if (path === '/vehicles/compare') {
    return [panel, 'Comparar Vehículos']
  }
  if (path.startsWith('/vehicles/') && path.endsWith('/pre-evaluation')) {
    const vehicleName = catalogStore.selectedVehicle
      ? `${catalogStore.selectedVehicle.brand} ${catalogStore.selectedVehicle.model} ${catalogStore.selectedVehicle.manufactureYear}`
      : 'Vehículo'
    return [panel, vehicleName, 'Pre-evaluación Crediticia']
  }
  if (path.startsWith('/vehicles/') && path !== '/vehicles') {
    const vehicleName = catalogStore.selectedVehicle
      ? `${catalogStore.selectedVehicle.brand} ${catalogStore.selectedVehicle.model} ${catalogStore.selectedVehicle.manufactureYear}`
      : 'Detalle del Vehículo'
    return [panel, 'Vehículos a buscar', vehicleName]
  }
  if (path.startsWith('/concessionaries/') && path !== '/concessionaries' && path !== '/concessionaries/entities') {
    const entity = partnersStore.financialEntities.find(e => e.id === $route.params.id)
    const entityName = entity ? entity.name : 'Concesionaria Aliada'
    return [panel, 'Portal Aliados', entityName]
  }
  if (path === '/concessionaries') {
    return [panel, 'Concesionarias a buscar']
  }
  if (path === '/vehicles' || path === '/home') {
    return [panel, 'Catálogo General de Vehículos']
  }
  if (path === '/user') {
    if (iamStore.roles.includes('ROLE_DEALER')) return [panel, 'Perfil de Concesionaria']
    if (iamStore.roles.includes('ROLE_FINANCIAL_INSTITUTION')) return [panel, 'Perfil Institucional']
    return [panel, t('header.myProfile')]
  }
  if (path.startsWith('/reports/applications')) {
    return [panel, t('header.applicationsReport')]
  }
  if (path === '/settings') {
    return [panel, t('header.settings')]
  }
  if (path === '/consultation') {
    return [panel, t('header.aiConsultation')]
  }

  return [panel, currentSectionSubtitle.value]
})

const userDisplayName = computed(() => {
  if (profilesStore.currentProfile?.fullName) {
    return profilesStore.currentProfile.fullName
  }
  if (iamStore.username && iamStore.username !== 'Invitado') {
    const raw = iamStore.username.split('@')[0] || ''
    const name = raw.replace(/[._-]/g, ' ')
    if (name) {
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
  }
  return iamStore.username || 'Usuario'
})

const userInitials = computed(() => {
  const parts = userDisplayName.value.trim().split(' ')
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
  }
  return userDisplayName.value.substring(0, 2).toUpperCase()
})

const userRoleSubtitle = computed(() => {
  const roles = iamStore.roles
  if (roles.includes('ROLE_ADMIN')) return 'Administrador'
  if (roles.includes('ROLE_DEALER')) return 'Concesionario Acreditado'
  if (roles.includes('ROLE_FINANCIAL_INSTITUTION')) return 'Entidad Financiera'
  return t('header.userRole')
})
</script>

<style scoped>
</style>
