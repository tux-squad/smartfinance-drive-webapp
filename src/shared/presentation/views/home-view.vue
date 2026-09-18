<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="bg-gradient-to-r from-blue-900 via-sky-900 to-indigo-900 rounded-2xl p-8 text-white shadow-xl">
      <div class="max-w-3xl space-y-4">
        <span class="inline-block px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-semibold tracking-wider rounded-full border border-sky-400/30">
          {{ t('home.tag') }}
        </span>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">
          {{ t('home.welcomeTitle') }}
        </h1>
        <p class="text-gray-200 text-sm md:text-base leading-relaxed">
          {{ t('home.welcomeDescription') }}
        </p>
      </div>
    </div>

    <!-- Quick Action Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow space-y-3">
        <div class="w-12 h-12 bg-blue-100 text-blue-900 rounded-xl flex items-center justify-center text-xl">
          <i class="pi pi-car"></i>
        </div>
        <h3 class="font-bold text-gray-900 text-lg">{{ t('home.catalogTitle') }}</h3>
        <p class="text-gray-600 text-sm">{{ t('home.catalogDesc') }}</p>
        <router-link to="/vehicles" class="inline-flex items-center text-sm font-semibold text-blue-900 hover:text-blue-700">
          {{ t('home.catalogBtn') }} <i class="pi pi-arrow-right ml-1.5 text-xs"></i>
        </router-link>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow space-y-3">
        <div class="w-12 h-12 bg-emerald-100 text-emerald-900 rounded-xl flex items-center justify-center text-xl">
          <i class="pi pi-calculator"></i>
        </div>
        <h3 class="font-bold text-gray-900 text-lg">{{ t('home.simulationsTitle') }}</h3>
        <p class="text-gray-600 text-sm">{{ t('home.simulationsDesc') }}</p>
        <router-link to="/simulations" class="inline-flex items-center text-sm font-semibold text-emerald-900 hover:text-emerald-700">
          {{ t('home.simulationsBtn') }} <i class="pi pi-arrow-right ml-1.5 text-xs"></i>
        </router-link>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow space-y-3">
        <div class="w-12 h-12 bg-indigo-100 text-indigo-900 rounded-xl flex items-center justify-center text-xl">
          <i class="pi pi-shield"></i>
        </div>
        <h3 class="font-bold text-gray-900 text-lg">{{ t('home.scoringTitle') }}</h3>
        <p class="text-gray-600 text-sm">{{ t('home.scoringDesc') }}</p>
        <router-link to="/scoring" class="inline-flex items-center text-sm font-semibold text-indigo-900 hover:text-indigo-700">
          {{ t('home.scoringBtn') }} <i class="pi pi-arrow-right ml-1.5 text-xs"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
</style>
