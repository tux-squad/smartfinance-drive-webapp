<template>
  <header class="bg-white border-b border-gray-200 shadow-xs">
    <div class="flex justify-between items-center px-8 py-4">
      <div class="flex items-center space-x-2 text-sm">
        <span class="text-gray-500 font-medium">{{ currentPanelTitle }}</span>
        <span class="text-gray-400">/</span>
        <span class="text-blue-950 font-bold">{{ currentSectionSubtitle }}</span>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '@/iam/application/iam.store'
import LanguageSwitcher from './language-switcher.vue'
import AuthenticationSection from '@/iam/presentation/components/authentication-section.vue'

const { t } = useI18n()
const iamStore = useIamStore()

const currentPanelTitle = computed(() => {
  const roles = iamStore.roles
  if (roles.includes('ROLE_ADMIN')) return t('header.adminPanel')
  if (roles.includes('ROLE_DEALER')) return t('header.dealerPanel')
  if (roles.includes('ROLE_FINANCIAL_INSTITUTION')) return t('header.bankPanel')
  return t('header.buyerPanel')
})

const currentSectionSubtitle = computed(() => {
  const roles = iamStore.roles
  if (roles.includes('ROLE_ADMIN')) return t('header.adminSubtitle')
  if (roles.includes('ROLE_DEALER')) return t('header.dealerSubtitle')
  if (roles.includes('ROLE_FINANCIAL_INSTITUTION')) return t('header.bankSubtitle')
  return t('header.buyerSubtitle')
})
</script>

<style scoped>
</style>
