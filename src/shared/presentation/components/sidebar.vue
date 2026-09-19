<template>
  <aside class="w-64 bg-blue-950 border-r border-blue-900 p-4 min-h-screen flex flex-col justify-between text-white shrink-0">
    <div>
      <!-- Brand Logo -->
      <router-link to="/home" class="flex items-center space-x-3 mb-8 mt-4 px-2">
        <i class="pi pi-car text-blue-950 bg-gray-200 rounded-lg p-2.5 text-xl"></i>
        <div>
          <div class="text-xl font-bold leading-tight tracking-wide">SmartFinance</div>
          <div class="text-sky-400 text-xs font-semibold tracking-wider uppercase">Drive Platform</div>
        </div>
      </router-link>

      <!-- Navigation Items -->
      <nav class="space-y-1.5">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="[
            $route.path.startsWith(item.to)
              ? 'bg-sky-600 text-white shadow-xs font-semibold'
              : 'text-gray-300 hover:bg-blue-900/60 hover:text-white'
          ]"
        >
          <i :class="['pi', item.icon, 'text-lg']"></i>
          <span>{{ t(item.labelKey) }}</span>
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
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const $route = useRoute()
const { t } = useI18n()

interface NavItem {
  labelKey: string
  to: string
  icon: string
}

const navItems: NavItem[] = [
  { labelKey: 'nav.vehicles', to: '/vehicles', icon: 'pi-car' },
  { labelKey: 'nav.concessionaries', to: '/concessionaries', icon: 'pi-building' },
  { labelKey: 'nav.simulations', to: '/simulations', icon: 'pi-calculator' },
  { labelKey: 'nav.scoring', to: '/scoring', icon: 'pi-shield' },
  { labelKey: 'nav.reports', to: '/reports/depreciation', icon: 'pi-chart-line' },
  { labelKey: 'nav.user', to: '/user', icon: 'pi-user' },
  { labelKey: 'nav.billing', to: '/billing', icon: 'pi-credit-card' },
]
</script>

<style scoped>
</style>
