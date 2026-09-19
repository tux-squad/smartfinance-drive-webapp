<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'
import Paginator, { type PageState } from 'primevue/paginator'
import { useCatalogStore } from '../../application/catalog.store'
import { useIamStore } from '@/iam/application/iam.store'
import VehicleSearchFilters from '../components/vehicle-search-filters.vue'
import VehicleCard from '../components/vehicle-card.vue'
import RegisterVehicleDialog from '../components/register-vehicle-dialog.vue'

const { t } = useI18n()
const catalogStore = useCatalogStore()
const iamStore = useIamStore()
const isRegisterModalOpen = ref<boolean>(false)

const isDealerOrAdmin = computed(() => {
  return iamStore.roles.includes('ROLE_DEALER') || iamStore.roles.includes('ROLE_ADMIN')
})

onMounted(() => {
  catalogStore.fetchVehicles()
})

const onPageChange = (event: PageState) => {
  catalogStore.fetchVehicles({ page: event.page, size: event.rows })
}

const onVehicleCreated = () => {
  catalogStore.fetchVehicles({ page: 0 })
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md mb-3 border border-emerald-500/30">
          <i class="pi pi-compass"></i>
          {{ t('catalog.headerBadge') }}
        </div>
        <h1 class="text-3xl font-black tracking-tight sm:text-4xl text-white">
          {{ t('catalog.headerTitle') }}
        </h1>
        <p class="mt-2 text-sm text-emerald-100/80 leading-relaxed">
          {{ t('catalog.headerSubtitle') }}
        </p>
      </div>

      <!-- Header Action: Register Vehicle (Dealer / Admin only) -->
      <div v-if="isDealerOrAdmin" class="relative z-10 w-full md:w-auto">
        <Button
          :label="t('catalog.registerVehicleBtn')"
          icon="pi pi-plus"
          severity="success"
          class="w-full md:w-auto !rounded-2xl !py-3 !px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold shadow-lg shadow-emerald-500/20"
          @click="isRegisterModalOpen = true"
        />
      </div>

      <!-- Header Action: Prompt for Buyers to elevate role -->
      <div v-else class="relative z-10 w-full md:w-auto">
        <router-link
          to="/user"
          class="inline-flex items-center space-x-2 w-full md:w-auto px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-emerald-200 backdrop-blur-md transition-colors"
        >
          <i class="pi pi-shield text-xs"></i>
          <span>{{ t('catalog.dealerAcreditationPrompt') }}</span>
        </router-link>
      </div>
    </div>

    <!-- Filter Component -->
    <VehicleSearchFilters />

    <!-- Results Overview Bar -->
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
        {{ t('catalog.totalResults') }}:
        <span class="font-bold text-gray-900 dark:text-white">{{ catalogStore.totalElements }}</span>
        {{ t('catalog.vehiclesCountLabel') }}
      </p>

      <Button
        :label="t('catalog.registerVehicleBtn')"
        icon="pi pi-plus"
        severity="secondary"
        outlined
        class="!rounded-xl !text-xs sm:hidden"
        @click="isRegisterModalOpen = true"
      />
    </div>

    <!-- Loading Spinner State -->
    <div v-if="catalogStore.isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">{{ t('catalog.loadingText') }}</p>
    </div>

    <!-- Empty Catalog State -->
    <div
      v-else-if="!catalogStore.hasVehicles"
      class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center"
    >
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-4">
        <i class="pi pi-car text-2xl"></i>
      </div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">
        {{ t('catalog.emptyTitle') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
        {{ t('catalog.emptySubtitle') }}
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <Button
          :label="t('catalog.clearFiltersBtn')"
          icon="pi pi-filter-slash"
          severity="secondary"
          outlined
          class="rounded-xl !text-xs"
          @click="catalogStore.resetFilters"
        />
        <Button
          :label="t('catalog.registerVehicleBtn')"
          icon="pi pi-plus"
          severity="success"
          class="rounded-xl !text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          @click="isRegisterModalOpen = true"
        />
      </div>
    </div>

    <!-- Vehicles Grid -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <VehicleCard
        v-for="vehicle in catalogStore.vehicles"
        :key="vehicle.id"
        :vehicle="vehicle"
      />
    </div>

    <!-- Pagination -->
    <div v-if="catalogStore.totalPages > 1" class="flex justify-center pt-4">
      <Paginator
        :rows="catalogStore.pageSize"
        :totalRecords="catalogStore.totalElements"
        :first="catalogStore.currentPage * catalogStore.pageSize"
        class="!bg-transparent"
        @page="onPageChange"
      />
    </div>

    <!-- Register Vehicle Modal (Dealer / Admin only) -->
    <RegisterVehicleDialog
      v-if="isDealerOrAdmin"
      v-model:visible="isRegisterModalOpen"
      @created="onVehicleCreated"
    />
  </div>
</template>
