<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import { usePartnersStore } from '../../application/partners.store'

const { t } = useI18n()
const partnersStore = usePartnersStore()

const rucInput = ref<string>('')

const handleSearch = () => {
  if (rucInput.value) {
    partnersStore.lookupSunatRuc(rucInput.value)
  }
}

const handleClear = () => {
  rucInput.value = ''
  partnersStore.clearSunatResult()
}
</script>

<template>
  <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
    <!-- Header Title -->
    <div class="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        <i class="pi pi-building-columns text-lg"></i>
      </div>
      <div>
        <h3 class="text-base font-bold text-gray-900 dark:text-white">
          {{ t('partners.sunatTitle') }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('partners.sunatSubtitle') }}
        </p>
      </div>
    </div>

    <!-- Search Form Input -->
    <form @submit.prevent="handleSearch" class="flex flex-col sm:flex-row gap-3 items-stretch">
      <div class="relative flex-1">
        <InputText
          v-model="rucInput"
          :placeholder="t('partners.rucPlaceholder')"
          maxlength="11"
          class="w-full !rounded-xl !text-sm font-mono tracking-wider pr-10"
        />
        <i v-if="rucInput" class="pi pi-times absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer" @click="handleClear"></i>
      </div>

      <Button
        type="submit"
        :label="t('partners.searchRucBtn')"
        icon="pi pi-search"
        :loading="partnersStore.isSunatLoading"
        severity="info"
        class="!rounded-xl px-6 !text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/20"
      />
    </form>

    <!-- Error Message Alert -->
    <Message v-if="partnersStore.sunatError" severity="error" class="!rounded-xl !text-xs">
      {{ partnersStore.sunatError }}
    </Message>

    <!-- SUNAT Validation Result Card -->
    <div
      v-if="partnersStore.hasSunatResult && partnersStore.sunatResult"
      class="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 p-5 border border-blue-100 dark:from-gray-800/80 dark:to-gray-900 dark:border-gray-700 space-y-4"
    >
      <div class="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700 pb-3">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {{ t('partners.sunatResultHeader') }}
        </span>
        <span class="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 rounded-full">
          RUC: {{ partnersStore.sunatResult.ruc }}
        </span>
      </div>

      <!-- Business Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Business Name -->
        <div class="md:col-span-2">
          <span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">{{ t('partners.businessNameLabel') }}</span>
          <span class="text-base font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
            {{ partnersStore.sunatResult.businessName }}
          </span>
        </div>

        <!-- Status Badge Card -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400 block">{{ t('catalog.statusLabel') || 'Estado Contribuyente' }}</span>
            <span class="text-sm font-bold text-gray-900 dark:text-white">
              {{ partnersStore.sunatResult.status }}
            </span>
          </div>
          <Tag
            :value="partnersStore.sunatResult.isActive ? t('partners.statusActive') : t('partners.statusInactive')"
            :severity="partnersStore.sunatResult.isActive ? 'success' : 'danger'"
            class="!text-xs font-bold"
          />
        </div>

        <!-- Domicile Condition Badge Card -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400 block">{{ t('partners.conditionLabel') }}</span>
            <span class="text-sm font-bold text-gray-900 dark:text-white">
              {{ partnersStore.sunatResult.condition }}
            </span>
          </div>
          <Tag
            :value="partnersStore.sunatResult.isHabido ? t('partners.conditionHabido') : t('partners.conditionNoHabido')"
            :severity="partnersStore.sunatResult.isHabido ? 'success' : 'warn'"
            class="!text-xs font-bold"
          />
        </div>
      </div>

      <!-- Compliance Summary Notice -->
      <div
        :class="[
          'rounded-xl p-3 text-xs font-medium flex items-center gap-2',
          partnersStore.sunatResult.isValidTaxpayer
            ? 'bg-emerald-100/80 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            : 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
        ]"
      >
        <i :class="[partnersStore.sunatResult.isValidTaxpayer ? 'pi pi-check-circle text-emerald-600' : 'pi pi-exclamation-triangle text-amber-600', 'text-base']"></i>
        <span>
          {{ partnersStore.sunatResult.isValidTaxpayer ? t('partners.taxpayerEligibleNotice') : t('partners.taxpayerIneligibleNotice') }}
        </span>
      </div>
    </div>
  </div>
</template>
