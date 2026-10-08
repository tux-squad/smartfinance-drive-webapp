<template>
  <div class="inline-flex items-center bg-gray-100 dark:bg-white/10 rounded-lg p-1 border border-gray-200 dark:border-white/15">
    <button
      v-for="lang in availableLocales"
      :key="lang"
      type="button"
      @click="selectLocale(lang)"
      class="px-2.5 py-1 text-xs font-bold rounded-md transition-all uppercase"
      :class="[
        locale === lang
          ? 'bg-blue-600 text-white shadow-xs'
          : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-white/10'
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
