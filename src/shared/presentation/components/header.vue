<template>
  <header class="bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200/80 dark:border-surface-800 shadow-xs sticky top-0 z-20 transition-colors">
    <div class="flex justify-between items-center px-4 md:px-8 py-3">
      <!-- Left side: Mobile Toggle & Breadcrumbs -->
      <div class="flex items-center space-x-3 text-sm flex-wrap">
        <!-- Mobile Sidebar Toggle -->
        <button
          type="button"
          @click="layoutStore.toggleMobile"
          class="lg:hidden p-2 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-label="Abrir menú"
        >
          <i class="pi pi-bars text-lg" />
        </button>

        <!-- Mobile Brand Logo -->
        <router-link to="/home" class="lg:hidden flex items-center gap-2">
          <img src="/logo.svg" alt="SmartFinance Logo" class="h-6 w-auto object-contain dark:hidden" />
          <img src="/logo-white.svg" alt="SmartFinance Logo" class="h-6 w-auto object-contain hidden dark:block" />
        </router-link>

        <!-- Desktop Quick Slim Toggle -->
        <button
          type="button"
          @click="layoutStore.toggleSlim"
          v-tooltip.bottom="layoutStore.isSlim ? 'Expandir barra lateral' : 'Contraer a modo Slim'"
          class="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          <i :class="['pi text-sm', layoutStore.isSlim ? 'pi-align-left' : 'pi-align-justify']" />
        </button>

        <!-- Breadcrumbs matching mockup -->
        <div class="hidden sm:flex items-center space-x-2 text-xs md:text-sm flex-wrap">
          <template v-for="(crumb, idx) in breadcrumbTrail" :key="idx">
            <span v-if="idx > 0" class="text-surface-400 dark:text-surface-600">/</span>
            <span :class="[idx === breadcrumbTrail.length - 1 ? 'text-blue-900 dark:text-blue-400 font-bold' : 'text-surface-500 dark:text-surface-400 font-medium']">
              {{ crumb }}
            </span>
          </template>
        </div>
      </div>

      <!-- Right side: Multi-column Toggle, Language Switcher, Profile, Auth -->
      <div class="flex items-center space-x-3 md:space-x-4">
        <!-- Multi-Column Context Rail Toggle -->
        <button
          type="button"
          @click="layoutStore.toggleContextRail"
          v-tooltip.bottom="layoutStore.isContextRailOpen ? 'Ocultar panel lateral (Multi-Column)' : 'Mostrar panel lateral (Multi-Column)'"
          class="flex items-center justify-center w-9 h-9 rounded-xl border transition-all"
          :class="[
            layoutStore.isContextRailOpen
              ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-400 shadow-xs'
              : 'border-surface-200 dark:border-surface-700 text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-100 hover:bg-surface-50 dark:hover:bg-surface-800'
          ]"
        >
          <i class="pi pi-table text-sm" />
        </button>

        <!-- Language Switcher -->
        <LanguageSwitcher />

        <!-- User Profile Pill -->
        <div class="flex items-center space-x-2.5 md:space-x-3 text-right">
          <div class="hidden sm:block">
            <div class="text-xs md:text-sm font-bold text-surface-900 dark:text-surface-100 leading-tight">
              {{ userDisplayName }}
            </div>
            <div class="text-[10px] md:text-[11px] text-surface-500 dark:text-surface-400 font-medium">
              {{ userRoleSubtitle }}
            </div>
          </div>
          <router-link
            to="/user"
            class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0d2a5c] to-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs hover:opacity-90 transition-opacity shrink-0"
            v-tooltip.bottom="'Ver perfil'"
          >
            {{ userInitials }}
          </router-link>
        </div>

        <!-- Auth Section / Sign Out -->
        <div class="pl-2 border-l border-surface-200 dark:border-surface-700">
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
import { useLayoutStore } from '@/shared/application/layout.store'
import LanguageSwitcher from './language-switcher.vue'
import AuthenticationSection from '@/iam/presentation/components/authentication-section.vue'

const $route = useRoute()
const { t } = useI18n()
const iamStore = useIamStore()
const profilesStore = useProfilesStore()
const catalogStore = useCatalogStore()
const partnersStore = usePartnersStore()
const layoutStore = useLayoutStore()

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
    return [panel, t('header.breadcrumbs.inventory'), t('header.breadcrumbs.addVehicle')]
  }
  if (path === '/dealer/inventory') {
    return [panel, t('header.breadcrumbs.inventoryManagement')]
  }
  if (path.startsWith('/dealer/prospects/') && path !== '/dealer/prospects') {
    return [panel, t('header.breadcrumbs.prospects'), t('header.breadcrumbs.prospectDetail')]
  }
  if (path === '/dealer/prospects') {
    return [panel, t('header.breadcrumbs.prospects')]
  }
  if (path.startsWith('/dealer/settings')) {
    return [panel, t('header.breadcrumbs.settings'), t('header.breadcrumbs.appearance')]
  }
  if (path === '/billing') {
    return [panel, t('header.breadcrumbs.settings'), t('header.breadcrumbs.b2bMembership')]
  }
  if (path === '/home' && iamStore.roles.includes('ROLE_DEALER')) {
    return [panel, t('header.breadcrumbs.dashboard')]
  }

  if (path === '/vehicles/compare') {
    return [panel, t('header.breadcrumbs.compareVehicles')]
  }
  if (path.startsWith('/vehicles/') && path.endsWith('/pre-evaluation')) {
    const vehicleName = catalogStore.selectedVehicle
      ? `${catalogStore.selectedVehicle.brand} ${catalogStore.selectedVehicle.model} ${catalogStore.selectedVehicle.manufactureYear}`
      : t('header.breadcrumbs.vehicle')
    return [panel, vehicleName, t('header.breadcrumbs.preEvaluation')]
  }
  if (path.startsWith('/vehicles/') && path !== '/vehicles') {
    const vehicleName = catalogStore.selectedVehicle
      ? `${catalogStore.selectedVehicle.brand} ${catalogStore.selectedVehicle.model} ${catalogStore.selectedVehicle.manufactureYear}`
      : t('header.breadcrumbs.vehicleDetail')
    return [panel, t('header.breadcrumbs.searchVehicles'), vehicleName]
  }
  if (path.startsWith('/concessionaries/') && path !== '/concessionaries' && path !== '/concessionaries/entities') {
    const entity = partnersStore.financialEntities.find(e => e.id === $route.params.id)
    const entityName = entity ? entity.name : t('header.breadcrumbs.partnerDealer')
    return [panel, t('header.breadcrumbs.alliesPortal'), entityName]
  }
  if (path === '/concessionaries') {
    return [panel, t('header.breadcrumbs.searchDealerships')]
  }
  if (path === '/vehicles' || path === '/home') {
    return [panel, t('header.breadcrumbs.generalCatalog')]
  }
  if (path === '/user') {
    if (iamStore.roles.includes('ROLE_DEALER')) return [panel, t('header.breadcrumbs.dealerProfile')]
    if (iamStore.roles.includes('ROLE_FINANCIAL_INSTITUTION')) return [panel, t('header.breadcrumbs.bankProfile')]
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
  if (roles.includes('ROLE_ADMIN')) return t('header.adminRole')
  if (roles.includes('ROLE_DEALER')) return t('header.dealerRole')
  if (roles.includes('ROLE_FINANCIAL_INSTITUTION')) return t('header.bankRole')
  return t('header.userRole')
})
</script>

<style scoped>
</style>
