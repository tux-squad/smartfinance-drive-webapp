<template>
  <aside class="w-64 bg-blue-950 border-r border-blue-900 p-4 min-h-screen flex flex-col justify-between text-white shrink-0">
    <div>
      <!-- Brand Logo -->
      <router-link to="/home" class="flex items-center space-x-3 mb-4 mt-4 px-2">
        <i class="pi pi-car text-blue-950 bg-gray-200 rounded-lg p-2.5 text-xl"></i>
        <div>
          <div class="text-xl font-bold leading-tight tracking-wide">SmartFinance</div>
          <div class="text-sky-400 text-xs font-semibold tracking-wider uppercase">Drive Platform</div>
        </div>
      </router-link>

      <!-- Active Role Pill Indicator -->
      <div class="px-2 mb-6">
        <div class="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-900/50 border border-blue-800/60 text-xs">
          <span class="w-2 h-2 rounded-full" :class="roleDotColor"></span>
          <span class="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Rol:</span>
          <span class="font-bold text-sky-200 truncate">{{ activeRoleName }}</span>
        </div>
      </div>

      <!-- Navigation Items -->
      <nav class="space-y-1.5">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="[
            $route.path.startsWith(item.to)
              ? 'bg-sky-600 text-white shadow-xs font-semibold'
              : 'text-gray-300 hover:bg-blue-900/60 hover:text-white'
          ]"
        >
          <div class="flex items-center space-x-3 truncate">
            <i :class="['pi', item.icon, 'text-lg shrink-0']"></i>
            <span class="truncate">{{ t(item.labelKey) }}</span>
          </div>

          <span
            v-if="item.badgeKey"
            class="ml-2 px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-sky-400/20 text-sky-300 border border-sky-400/30"
          >
            {{ t(item.badgeKey) }}
          </span>
        </router-link>
      </nav>
    </div>

    <!-- Help & Support Card -->
    <div class="mt-auto bg-sky-900/40 border border-sky-800/50 rounded-xl p-4 space-y-3">
      <div class="flex items-center space-x-2 text-sky-300 font-semibold text-sm">
        <i class="pi pi-headphones text-base"></i>
        <span>{{ t('sidebar.needHelp') }}</span>
      </div>
      <p class="text-xs text-gray-300 leading-relaxed">
        {{ t('sidebar.helpDescription') }}
      </p>
      <a
        href="tel:+51987654321"
        class="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow-xs transition-colors"
      >
        <i class="pi pi-phone text-xs"></i>
        <span>{{ t('sidebar.callSupport') }}</span>
      </a>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '@/iam/application/iam.store'

const $route = useRoute()
const { t } = useI18n()
const iamStore = useIamStore()

interface NavItem {
  labelKey: string
  to: string
  icon: string
  badgeKey?: string
}

const activeRoleName = computed(() => {
  const roles = iamStore.roles
  if (roles.includes('ROLE_ADMIN')) return 'Admin'
  if (roles.includes('ROLE_DEALER')) return 'Concesionario'
  if (roles.includes('ROLE_FINANCIAL_INSTITUTION')) return 'Banco/Entidad'
  return 'Comprador'
})

const roleDotColor = computed(() => {
  const roles = iamStore.roles
  if (roles.includes('ROLE_ADMIN')) return 'bg-amber-400'
  if (roles.includes('ROLE_DEALER')) return 'bg-emerald-400'
  if (roles.includes('ROLE_FINANCIAL_INSTITUTION')) return 'bg-sky-400'
  return 'bg-gray-400'
})

const navItems = computed<NavItem[]>(() => {
  const roles = iamStore.roles
  const isDealer = roles.includes('ROLE_DEALER')
  const isBank = roles.includes('ROLE_FINANCIAL_INSTITUTION')
  const isAdmin = roles.includes('ROLE_ADMIN')

  return [
    {
      labelKey: isDealer ? 'nav.dealerVehicles' : 'nav.vehicles',
      to: '/vehicles',
      icon: 'pi-car',
      badgeKey: isDealer ? 'nav.badgeDealer' : undefined
    },
    {
      labelKey: isBank ? 'nav.bankEntities' : 'nav.concessionaries',
      to: '/concessionaries',
      icon: 'pi-building',
      badgeKey: isBank ? 'nav.badgeBank' : undefined
    },
    {
      labelKey: (isBank || isDealer) ? 'nav.commercialSimulations' : 'nav.simulations',
      to: '/simulations',
      icon: 'pi-calculator'
    },
    {
      labelKey: (isBank || isAdmin) ? 'nav.riskScoring' : 'nav.scoring',
      to: '/scoring',
      icon: 'pi-shield'
    },
    {
      labelKey: 'nav.reports',
      to: '/reports/depreciation',
      icon: 'pi-chart-line'
    },
    {
      labelKey: 'nav.user',
      to: '/user',
      icon: 'pi-user'
    },
    {
      labelKey: 'nav.billing',
      to: '/billing',
      icon: 'pi-credit-card'
    },
  ]
})
</script>

<style scoped>
</style>
