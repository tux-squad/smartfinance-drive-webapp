<template>
  <aside class="w-64 bg-[#0a1936] border-r border-blue-950/60 p-4 min-h-screen flex flex-col justify-between text-white shrink-0">
    <div>
      <!-- Brand Logo matching mockup -->
      <router-link to="/vehicles" class="flex items-center space-x-3 mb-8 mt-2 px-2">
        <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl shrink-0 shadow-sm">
          <i class="pi pi-car"></i>
        </div>
        <div>
          <div class="text-base font-bold leading-tight tracking-wide text-white">SmartFinance</div>
          <div class="text-gray-400 text-xs font-normal">Drive</div>
        </div>
      </router-link>

      <!-- Navigation Items for Buyer Flow -->
      <nav class="space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all"
          :class="[
            isCurrentRoute(item.to)
              ? 'bg-blue-600 text-white shadow-sm font-semibold'
              : 'text-gray-300 hover:bg-blue-900/40 hover:text-white'
          ]"
        >
          <div class="flex items-center space-x-3 truncate">
            <i :class="['pi', item.icon, 'text-base shrink-0']"></i>
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

    <!-- Help & Support Card matching mockup -->
    <div class="mt-auto bg-[#122347] border border-blue-900/50 rounded-2xl p-4 space-y-2.5">
      <div class="text-white font-bold text-xs">
        {{ t('sidebar.needHelp') }}
      </div>
      <p class="text-[11px] text-gray-300 leading-relaxed">
        {{ t('sidebar.helpDescription') }}
      </p>
      <a
        href="tel:+51987654321"
        class="flex items-center justify-center space-x-1.5 w-full py-2 px-3 rounded-xl bg-[#00a887] hover:bg-[#009275] text-white font-bold text-xs shadow-xs transition-colors"
      >
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

const isDealer = computed(() => iamStore.roles.includes('ROLE_DEALER'))
const isBank = computed(() => iamStore.roles.includes('ROLE_FINANCIAL_INSTITUTION'))
const isAdmin = computed(() => iamStore.roles.includes('ROLE_ADMIN'))

const isCurrentRoute = (targetPath: string): boolean => {
  if (targetPath === '/vehicles' && ($route.path === '/vehicles' || $route.path === '/home')) return true
  return $route.path.startsWith(targetPath)
}

const navItems = computed<NavItem[]>(() => {
  // If user is Buyer (ROLE_USER, not dealer, not bank, not admin) -> exactly the 6 mockup links
  if (!isDealer.value && !isBank.value && !isAdmin.value) {
    return [
      {
        labelKey: 'nav.buyerVehicles',
        to: '/vehicles',
        icon: 'pi-car'
      },
      {
        labelKey: 'nav.buyerConcessionaires',
        to: '/concessionaries',
        icon: 'pi-building'
      },
      {
        labelKey: 'nav.buyerAiConsultation',
        to: '/consultation',
        icon: 'pi-comments'
      },
      {
        labelKey: 'nav.buyerReport',
        to: '/reports/applications',
        icon: 'pi-file'
      },
      {
        labelKey: 'nav.buyerProfile',
        to: '/user',
        icon: 'pi-user'
      },
      {
        labelKey: 'nav.buyerSettings',
        to: '/settings',
        icon: 'pi-cog'
      }
    ]
  }

  // If user has Dealer or Bank or Admin roles, preserve expanded tools
  return [
    {
      labelKey: isDealer.value ? 'nav.dealerVehicles' : 'nav.vehicles',
      to: '/vehicles',
      icon: 'pi-car',
      badgeKey: isDealer.value ? 'nav.badgeDealer' : undefined
    },
    {
      labelKey: isBank.value ? 'nav.bankEntities' : 'nav.concessionaries',
      to: '/concessionaries',
      icon: 'pi-building',
      badgeKey: isBank.value ? 'nav.badgeBank' : undefined
    },
    {
      labelKey: (isBank.value || isDealer.value) ? 'nav.commercialSimulations' : 'nav.simulations',
      to: '/simulations',
      icon: 'pi-calculator'
    },
    {
      labelKey: (isBank.value || isAdmin.value) ? 'nav.riskScoring' : 'nav.scoring',
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
      labelKey: 'nav.buyerSettings',
      to: '/settings',
      icon: 'pi-cog'
    },
    {
      labelKey: 'nav.billing',
      to: '/billing',
      icon: 'pi-credit-card'
    }
  ]
})
</script>

<style scoped>
</style>
