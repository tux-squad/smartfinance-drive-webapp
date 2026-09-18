<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- View Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">
          {{ t('profiles.viewTitle') }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ t('profiles.viewSubtitle') }}
        </p>
      </div>

      <button
        v-if="profilesStore.hasProfile && !isEditing"
        @click="isEditing = true"
        class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors self-start md:self-auto"
      >
        <i class="pi pi-user-edit"></i>
        <span>{{ t('profiles.editProfileBtn') }}</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="profilesStore.isLoading && !profilesStore.hasProfile" class="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-3">
      <i class="pi pi-spin pi-spinner text-3xl text-blue-900"></i>
      <p class="text-sm text-gray-500 font-medium">{{ t('profiles.loading') }}</p>
    </div>

    <!-- Error Alert -->
    <div v-else-if="profilesStore.error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700 flex items-start space-x-2">
      <i class="pi pi-exclamation-circle text-red-500 text-base mt-0.5"></i>
      <span>{{ profilesStore.error }}</span>
    </div>

    <!-- Edit / Create Form View -->
    <div v-else-if="isEditing || !profilesStore.hasProfile" class="bg-white p-8 rounded-2xl border border-gray-200 shadow-md space-y-6">
      <div class="border-b border-gray-100 pb-4">
        <h2 class="text-lg font-bold text-gray-900">
          {{ profilesStore.hasProfile ? t('profiles.editProfileFormTitle') : t('profiles.createProfileFormTitle') }}
        </h2>
        <p class="text-xs text-gray-500">
          {{ t('profiles.formDescription') }}
        </p>
      </div>

      <ProfileForm
        :initial-profile="profilesStore.currentProfile"
        :is-editing="profilesStore.hasProfile"
        :is-loading="profilesStore.isLoading"
        :error="profilesStore.error"
        @submit="handleSubmitForm"
        @cancel="isEditing = false"
      />
    </div>

    <!-- Profile Display View -->
    <div v-else class="space-y-6">
      <!-- Profile Header Summary Card -->
      <div class="bg-gradient-to-r from-blue-950 via-sky-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div class="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-2xl font-extrabold shadow-inner shrink-0">
          {{ initials }}
        </div>
        <div class="space-y-1 text-center sm:text-left">
          <h2 class="text-2xl font-bold tracking-tight">
            {{ profilesStore.currentProfile?.fullName }}
          </h2>
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
            <span class="px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/30">
              DNI: {{ profilesStore.currentProfile?.dni }}
            </span>
            <span class="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30">
              Perfil Verificado
            </span>
          </div>
        </div>
      </div>

      <!-- Detail Info Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Personal Information -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div class="flex items-center space-x-2 text-blue-900 font-bold border-b border-gray-100 pb-3">
            <i class="pi pi-id-card text-lg"></i>
            <span>{{ t('profiles.personalInfoSection') }}</span>
          </div>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-500">{{ t('profiles.firstName') }}:</dt>
              <dd class="font-semibold text-gray-900">{{ profilesStore.currentProfile?.firstName }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">{{ t('profiles.lastName') }}:</dt>
              <dd class="font-semibold text-gray-900">{{ profilesStore.currentProfile?.lastName }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">{{ t('profiles.dni') }}:</dt>
              <dd class="font-mono font-semibold text-gray-900">{{ profilesStore.currentProfile?.dni }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">{{ t('profiles.email') }}:</dt>
              <dd class="font-semibold text-gray-900">{{ profilesStore.currentProfile?.email }}</dd>
            </div>
          </dl>
        </div>

        <!-- Financial & Contact Information -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div class="flex items-center space-x-2 text-blue-900 font-bold border-b border-gray-100 pb-3">
            <i class="pi pi-wallet text-lg"></i>
            <span>{{ t('profiles.financialInfoSection') }}</span>
          </div>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-500">{{ t('profiles.phoneNumber') }}:</dt>
              <dd class="font-semibold text-gray-900">{{ profilesStore.currentProfile?.phoneNumber || 'No especificado' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">{{ t('profiles.monthlyIncome') }}:</dt>
              <dd class="font-mono font-extrabold text-emerald-700 text-base">
                {{ formattedIncome }}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Moneda Declarada:</dt>
              <dd class="font-bold text-gray-900">{{ profilesStore.currentProfile?.currency }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '@/iam/application/iam.store'
import { useProfilesStore } from '../../application/profiles.store'
import { CreateProfileCommand } from '../../domain/create-profile.command'
import { UpdateProfileCommand } from '../../domain/update-profile.command'
import ProfileForm from '../components/profile-form.vue'

const { t } = useI18n()
const iamStore = useIamStore()
const profilesStore = useProfilesStore()

const isEditing = ref(false)

const initials = computed(() => {
  const p = profilesStore.currentProfile
  if (!p) return 'U'
  return `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase()
})

const formattedIncome = computed(() => {
  const p = profilesStore.currentProfile
  if (!p) return '-'
  const symbol = p.currency === 'USD' ? '$' : 'S/'
  return `${symbol} ${p.monthlyIncomeAmount.toFixed(2)}`
})

onMounted(async () => {
  const userId = iamStore.currentUser?.id || localStorage.getItem('user_id')
  if (userId) {
    await profilesStore.fetchProfileByUserId(userId)
  }
})

const handleSubmitForm = async (formData: any) => {
  if (profilesStore.hasProfile && profilesStore.currentProfile) {
    const command = new UpdateProfileCommand({
      profileId: profilesStore.currentProfile.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      dni: formData.dni,
      phoneNumber: formData.phoneNumber,
      monthlyIncomeAmount: formData.monthlyIncomeAmount,
      currency: formData.currency
    })
    const success = await profilesStore.updateProfile(command)
    if (success) {
      isEditing.value = false
    }
  } else {
    const command = new CreateProfileCommand({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      dni: formData.dni,
      phoneNumber: formData.phoneNumber,
      monthlyIncomeAmount: formData.monthlyIncomeAmount,
      currency: formData.currency
    })
    const success = await profilesStore.createProfile(command)
    if (success) {
      isEditing.value = false
    }
  }
}
</script>

<style scoped>
</style>
