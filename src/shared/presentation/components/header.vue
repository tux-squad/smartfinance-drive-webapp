<template>
  <header class="bg-white border-b border-gray-200 shadow-xs">
    <div class="flex justify-between items-center px-8 py-4">
      <div class="flex items-center space-x-2 text-sm">
        <span class="text-gray-500 font-medium">{{ t('header.buyerPanel') }}</span>
        <span class="text-gray-400">/</span>
        <span class="text-blue-950 font-bold">{{ t('header.alliesPortal') }}</span>
      </div>

      <div class="flex items-center space-x-6">
        <!-- Language Switcher -->
        <LanguageSwitcher />

        <div class="flex items-center space-x-3.5 pl-4 border-l border-gray-200">
          <div class="text-right">
            <p class="font-semibold text-gray-800 text-sm leading-tight">Carlos Mendoza</p>
            <p class="text-xs text-gray-500">{{ t('header.userRole') }}</p>
          </div>
          <div class="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            CM
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './language-switcher.vue'

const { t } = useI18n()
</script>

<style scoped>
</style>
