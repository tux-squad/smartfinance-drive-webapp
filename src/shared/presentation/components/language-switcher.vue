<template>
  <div class="inline-flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
    <button
      v-for="lang in availableLocales"
      :key="lang"
      type="button"
      @click="locale = lang"
      class="px-2.5 py-1 text-xs font-bold rounded-md transition-all uppercase"
      :class="[
        locale === lang
          ? 'bg-blue-900 text-white shadow-xs'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
      ]"
    >
      {{ lang }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n()
</script>

<style scoped>
</style>
