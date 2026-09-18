<template>
  <div class="flex items-center space-x-3">
    <!-- Authenticated State -->
    <template v-if="iamStore.isAuthenticated">
      <div class="flex items-center space-x-3">
        <div class="text-right hidden sm:block">
          <p class="font-semibold text-gray-800 text-sm leading-tight">{{ iamStore.username }}</p>
          <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900">
            {{ primaryRole }}
          </span>
        </div>
        <div class="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-xs uppercase">
          {{ userInitials }}
        </div>
        <button
          type="button"
          @click="handleSignOut"
          class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          :title="t('iam.signOut')"
        >
          <i class="pi pi-sign-out text-base"></i>
        </button>
      </div>
    </template>

    <!-- Guest State -->
    <template v-else>
      <router-link
        to="/iam/sign-in"
        class="px-3.5 py-1.5 text-xs font-semibold text-blue-900 border border-blue-900/30 hover:bg-blue-50 rounded-lg transition-colors"
      >
        {{ t('iam.signInBtn') }}
      </router-link>
      <router-link
        to="/iam/sign-up"
        class="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
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
