<template>
  <div class="flex items-center space-x-2">
    <!-- Authenticated State: Clean Sign Out Button -->
    <template v-if="iamStore.isAuthenticated">
      <button
        type="button"
        @click="handleSignOut"
        class="w-9 h-9 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-200 dark:hover:border-red-900 flex items-center justify-center transition-all shadow-xs"
        :title="t('iam.signOut')"
        v-tooltip.bottom="t('iam.signOut')"
      >
        <i class="pi pi-sign-out text-sm"></i>
      </button>
    </template>

    <!-- Guest State: Login / Register Actions -->
    <template v-else>
      <router-link
        to="/iam/sign-in"
        class="px-3.5 py-1.5 text-xs font-semibold text-primary border border-primary/30 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-xl transition-colors"
      >
        {{ t('iam.signInBtn') }}
      </router-link>
      <router-link
        to="/iam/sign-up"
        class="px-3.5 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-600 rounded-xl shadow-xs transition-colors"
      >
        {{ t('iam.signUpBtn') }}
      </router-link>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../application/iam.store'

const { t } = useI18n()
const router = useRouter()
const iamStore = useIamStore()

const userInitials = computed(() => {
  const name = iamStore.username || 'U'
  return name.substring(0, 2)
})

const primaryRole = computed(() => {
  const roles = iamStore.roles
  if (roles.includes('ROLE_ADMIN')) return 'Admin'
  if (roles.includes('ROLE_DEALER')) return 'Concesionario'
  if (roles.includes('ROLE_FINANCIAL_INSTITUTION')) return 'Banco/Entidad'
  return 'Comprador'
})

const handleSignOut = async () => {
  await iamStore.signOut()
  router.push('/iam/sign-in')
}
</script>

<style scoped>
</style>
