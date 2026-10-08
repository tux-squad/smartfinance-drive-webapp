<template>
  <div class="inline-flex items-center bg-surface-100 dark:bg-surface-800 rounded-lg p-1 border border-surface-200 dark:border-surface-700">
    <button
      v-for="lang in availableLocales"
      :key="lang"
      type="button"
      @click="selectLocale(lang)"
      class="px-2.5 py-1 text-xs font-bold rounded-md transition-all uppercase"
      :class="[
        locale === lang
          ? 'bg-primary text-primary-contrast shadow-xs'
          : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-200/60 dark:hover:bg-surface-700/60'
      ]"
    >
      {{ lang }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n()

const selectLocale = (lang: string) => {
  locale.value = lang
  localStorage.setItem('user_locale', lang)
}
</script>

<style scoped>
</style>
