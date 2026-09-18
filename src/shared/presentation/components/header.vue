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

        <!-- Dynamic User / Auth Section -->
        <div class="pl-4 border-l border-gray-200">
          <AuthenticationSection />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './language-switcher.vue'
import AuthenticationSection from '@/iam/presentation/components/authentication-section.vue'

const { t } = useI18n()
</script>

<style scoped>
</style>
