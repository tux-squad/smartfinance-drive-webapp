<template>
  <div>
    <!-- Mobile Backdrop Overlay -->
    <div
      v-if="layoutStore.isMobileOpen"
      class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
      @click="layoutStore.closeMobile"
    />

    <!-- Floating Slim Sidebar Capsule -->
    <aside
      class="fixed top-3 bottom-3 left-3 z-50 flex flex-col justify-between rounded-3xl bg-[#09152e]/95 dark:bg-[#071124]/95 text-white backdrop-blur-xl border border-white/10 shadow-2xl shadow-slate-950/20 transition-all duration-300 ease-in-out select-none"
      :class="[
        // Mobile visibility
        layoutStore.isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0',
        // Desktop width based on Slim state
        layoutStore.isSlim ? 'lg:w-20 p-3' : 'lg:w-64 p-4'
      ]"
    >
      <!-- Top Section: Brand + Navigation -->
      <div class="flex flex-col h-full min-h-0">
        <!-- Brand Header -->
        <div class="mb-6 pt-1">
          <router-link
            :to="isDealer ? '/dealer/inventory' : '/vehicles'"
            class="flex items-center group"
            :class="[layoutStore.isSlim ? 'justify-center' : 'space-x-3 px-2']"
            v-tooltip.right="layoutStore.isSlim ? 'SmartFinance Drive' : undefined"
            @click="layoutStore.closeMobile"
          >
            <div
              class="w-11 h-11 rounded-2xl bg-white/10 p-1.5 flex items-center justify-center shrink-0 shadow-lg shadow-black/20 group-hover:scale-105 transition-transform border border-white/10"
            >
              <img src="/logo-white.svg" alt="SmartFinance Logo" class="w-full h-full object-contain" />
            </div>
            <div v-if="!layoutStore.isSlim" class="overflow-hidden transition-all duration-300">
              <div class="text-sm font-black leading-tight tracking-wide text-white">SmartFinance</div>
              <div class="text-[11px] text-blue-300/80 font-medium">Drive Financial</div>
            </div>
          </router-link>
        </div>

        <!-- Navigation Links (Scrollable if many items) -->
        <nav class="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden pr-0.5 custom-scrollbar">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            @click="layoutStore.closeMobile"
            v-tooltip.right="layoutStore.isSlim ? t(item.labelKey) : undefined"
            class="relative flex items-center rounded-2xl transition-all duration-200 group"
            :class="[
              layoutStore.isSlim
                ? 'w-11 h-11 mx-auto justify-center'
                : 'px-3.5 py-2.5 justify-between w-full text-xs font-medium',
              isCurrentRoute(item.to)
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            ]"
          >
            <!-- Icon + Label (Slim vs Expanded) -->
            <div
              class="flex items-center"
              :class="[layoutStore.isSlim ? 'justify-center' : 'space-x-3 truncate']"
            >
              <i
                :class="[
                  'pi',
                  item.icon,
                  'text-base shrink-0 group-hover:scale-110 transition-transform',
                  isCurrentRoute(item.to) ? 'text-white' : 'text-slate-300 group-hover:text-white'
                ]"
              />
              <span v-if="!layoutStore.isSlim" class="truncate text-xs font-medium">
                {{ t(item.labelKey) }}
              </span>
            </div>

            <!-- Badge (Slim dot vs Expanded Pill) -->
            <template v-if="item.badgeKey">
              <!-- Slim dot badge -->
              <span
                v-if="layoutStore.isSlim"
                class="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-sky-400 border-2 border-[#09152e] animate-pulse"
              />
              <!-- Expanded pill badge -->
              <span
                v-else
                class="ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-sky-400/20 text-sky-300 border border-sky-400/30 shrink-0"
              >
                {{ t(item.badgeKey) }}
              </span>
            </template>
          </router-link>
        </nav>
      </div>

      <!-- Bottom Controls Section -->
      <div class="pt-4 border-t border-white/10 space-y-2 mt-auto">
        <!-- Support Card (Expanded mode) -->
        <div
          v-if="!layoutStore.isSlim"
          class="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2"
        >
          <div class="text-white font-bold text-xs flex items-center justify-between">
            <span>{{ t('sidebar.needHelp') }}</span>
            <i class="pi pi-question-circle text-xs text-blue-300" />
          </div>
          <p class="text-[11px] text-slate-300 leading-snug">
            {{ t('sidebar.helpDescription') }}
          </p>
          <a
            href="tel:+51987654321"
            class="flex items-center justify-center space-x-1.5 w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <i class="pi pi-phone text-xs" />
            <span>{{ t('sidebar.callSupport') }}</span>
          </a>
        </div>

        <!-- Support Icon (Slim mode) -->
        <a
          v-else
          href="tel:+51987654321"
          v-tooltip.right="t('sidebar.callSupport')"
          class="w-11 h-11 mx-auto flex items-center justify-center rounded-2xl bg-white/5 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 border border-white/10 transition-colors"
        >
          <i class="pi pi-phone text-sm" />
        </a>

        <!-- Slim / Expand Toggle Button (Desktop only) -->
        <button
          type="button"
          @click="layoutStore.toggleSlim"
          v-tooltip.right="layoutStore.isSlim ? 'Expandir menú' : 'Modo Slim (Compacto)'"
          class="hidden lg:flex items-center rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          :class="[
            layoutStore.isSlim
              ? 'w-11 h-11 mx-auto justify-center'
              : 'w-full px-3 py-2 justify-between text-xs font-medium'
          ]"
        >
          <div class="flex items-center space-x-2">
            <i
              :class="[
                'pi text-sm transition-transform duration-300',
                layoutStore.isSlim ? 'pi-angle-right' : 'pi-angle-left'
              ]"
            />
            <span v-if="!layoutStore.isSlim" class="text-xs">
              Contraer a Slim
            </span>
          </div>
          <span
            v-if="!layoutStore.isSlim"
            class="text-[10px] text-slate-400 font-mono bg-white/5 px-1.5 py-0.5 rounded"
          >
            Slim
          </span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '@/iam/application/iam.store'
import { useLayoutStore } from '@/shared/application/layout.store'

const $route = useRoute()
const { t } = useI18n()
const iamStore = useIamStore()
const layoutStore = useLayoutStore()

interface NavItem {
  labelKey: string
  to: string
  icon: string
  badgeKey?: string
}

const isDealer = computed(() => iamStore.roles.includes('ROLE_DEALER'))
const isBank = computed(() => iamStore.roles.includes('ROLE_FINANCIAL_INSTITUTION') || iamStore.roles.includes('ROLE_FINANCIAL_ANALYST'))
const isAdmin = computed(() => iamStore.roles.includes('ROLE_ADMIN'))

const isCurrentRoute = (targetPath: string): boolean => {
  if (targetPath === '/home') return $route.path === '/home'
  if (targetPath === '/vehicles') return $route.path === '/vehicles' || (!isDealer.value && !isBank.value && !isAdmin.value && $route.path === '/')
  if (targetPath === '/simulations') return $route.path.startsWith('/simulations')
  if (targetPath === '/scoring') return $route.path.startsWith('/scoring')
  if (targetPath === '/reports/depreciation') return $route.path.startsWith('/reports/depreciation') || $route.path.startsWith('/projections')
  if (targetPath === '/reports/applications') return $route.path.startsWith('/reports/applications')
  if (targetPath === '/concessionaries/entities') return $route.path.startsWith('/concessionaries/entities')
  if (targetPath === '/concessionaries') return $route.path === '/concessionaries' || ($route.path.startsWith('/concessionaries/') && !$route.path.startsWith('/concessionaries/entities'))
  if (targetPath === '/dealer/inventory/new') return $route.path === '/dealer/inventory/new'
  if (targetPath === '/dealer/inventory') return $route.path === '/dealer/inventory'
  if (targetPath === '/dealer/prospects') return $route.path.startsWith('/dealer/prospects')
  if (targetPath === '/dealer/settings/appearance') return $route.path.startsWith('/dealer/settings')
  if (targetPath === '/billing') return $route.path.startsWith('/billing')
  if (targetPath === '/user') return $route.path.startsWith('/user')
  if (targetPath === '/settings') return $route.path === '/settings'
  return $route.path.startsWith(targetPath)
}

const navItems = computed<NavItem[]>(() => {
  // 1. Concesionario Automotriz (ROLE_DEALER)
  if (isDealer.value) {
    return [
      {
        labelKey: 'nav.dashboard',
        to: '/home',
        icon: 'pi-th-large'
      },
      {
        labelKey: 'nav.dealerInventory',
        to: '/dealer/inventory',
        icon: 'pi-car'
      },
      {
        labelKey: 'nav.dealerPublishVehicle',
        to: '/dealer/inventory/new',
        icon: 'pi-plus-circle'
      },
      {
        labelKey: 'nav.dealerProspects',
        to: '/dealer/prospects',
        icon: 'pi-users'
      },
      {
        labelKey: 'nav.dealerMembership',
        to: '/billing',
        icon: 'pi-id-card'
      },
      {
        labelKey: 'nav.dealerStoreProfile',
        to: '/dealer/settings/appearance',
        icon: 'pi-building'
      },
      {
        labelKey: 'nav.dealerSettings',
        to: '/settings',
        icon: 'pi-cog'
      }
    ]
  }

  // 2. Administrador Global (ROLE_ADMIN)
  if (isAdmin.value) {
    return [
      {
        labelKey: 'nav.adminDashboard',
        to: '/home',
        icon: 'pi-th-large'
      },
      {
        labelKey: 'nav.adminVehicles',
        to: '/vehicles',
        icon: 'pi-car'
      },
      {
        labelKey: 'nav.adminDealerships',
        to: '/concessionaries',
        icon: 'pi-building'
      },
      {
        labelKey: 'nav.adminEntities',
        to: '/concessionaries/entities',
        icon: 'pi-building-columns'
      },
      {
        labelKey: 'nav.adminApplications',
        to: '/reports/applications',
        icon: 'pi-file-check'
      },
      {
        labelKey: 'nav.commercialSimulations',
        to: '/simulations',
        icon: 'pi-calculator'
      },
      {
        labelKey: 'nav.riskScoring',
        to: '/scoring',
        icon: 'pi-shield'
      },
      {
        labelKey: 'nav.reports',
        to: '/reports/depreciation',
        icon: 'pi-chart-line'
      },
      {
        labelKey: 'nav.adminBilling',
        to: '/billing',
        icon: 'pi-id-card'
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
      }
    ]
  }

  // 3. Entidad Financiera / Analista (ROLE_FINANCIAL_INSTITUTION / ROLE_FINANCIAL_ANALYST)
  if (isBank.value) {
    return [
      {
        labelKey: 'nav.dashboard',
        to: '/home',
        icon: 'pi-th-large'
      },
      {
        labelKey: 'nav.bankEntities',
        to: '/concessionaries/entities',
        icon: 'pi-building-columns'
      },
      {
        labelKey: 'nav.bankApplications',
        to: '/reports/applications',
        icon: 'pi-check-square'
      },
      {
        labelKey: 'nav.commercialSimulations',
        to: '/simulations',
        icon: 'pi-calculator'
      },
      {
        labelKey: 'nav.riskScoring',
        to: '/scoring',
        icon: 'pi-shield'
      },
      {
        labelKey: 'nav.reports',
        to: '/reports/depreciation',
        icon: 'pi-chart-line'
      },
      {
        labelKey: 'nav.bankProfile',
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

  // 4. Comprador / Cliente Final (ROLE_USER)
  return [
    {
      labelKey: 'nav.buyerVehicles',
      to: '/vehicles',
      icon: 'pi-car'
    },
    {
      labelKey: 'nav.buyerSimulations',
      to: '/simulations',
      icon: 'pi-calculator'
    },
    {
      labelKey: 'nav.buyerApplications',
      to: '/reports/applications',
      icon: 'pi-file-check'
    },
    {
      labelKey: 'nav.buyerScoring',
      to: '/scoring',
      icon: 'pi-shield'
    },
    {
      labelKey: 'nav.buyerDepreciation',
      to: '/reports/depreciation',
      icon: 'pi-chart-line'
    },
    {
      labelKey: 'nav.buyerConcessionaires',
      to: '/concessionaries',
      icon: 'pi-building'
    },
    {
      labelKey: 'nav.buyerFinancialEntities',
      to: '/concessionaries/entities',
      icon: 'pi-building-columns'
    },
    {
      labelKey: 'nav.buyerAiConsultation',
      to: '/consultation',
      icon: 'pi-sparkles'
    },
    {
      labelKey: 'nav.billing',
      to: '/billing',
      icon: 'pi-id-card'
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
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
