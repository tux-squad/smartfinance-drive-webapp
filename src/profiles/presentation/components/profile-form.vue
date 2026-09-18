<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- Alert Error -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700 flex items-start space-x-2">
      <i class="pi pi-exclamation-circle text-red-500 text-base mt-0.5"></i>
      <span>{{ error }}</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- First Name -->
      <div>
        <label for="firstName" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          {{ t('profiles.firstName') }}
        </label>
        <input
          id="firstName"
          v-model="form.firstName"
          type="text"
          required
          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
          :placeholder="t('profiles.firstNamePlaceholder')"
        />
      </div>

      <!-- Last Name -->
      <div>
        <label for="lastName" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          {{ t('profiles.lastName') }}
        </label>
        <input
          id="lastName"
          v-model="form.lastName"
          type="text"
          required
          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
          :placeholder="t('profiles.lastNamePlaceholder')"
        />
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          {{ t('profiles.email') }}
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
          :placeholder="t('profiles.emailPlaceholder')"
        />
      </div>

      <!-- DNI -->
      <div>
        <label for="dni" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          {{ t('profiles.dni') }} (RENIEC)
        </label>
        <input
          id="dni"
          v-model="form.dni"
          type="text"
          required
          maxlength="8"
          minlength="8"
          pattern="[0-9]{8}"
          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all font-mono"
          placeholder="72819203"
        />
      </div>

      <!-- Phone Number -->
      <div>
        <label for="phoneNumber" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          {{ t('profiles.phoneNumber') }}
        </label>
        <input
          id="phoneNumber"
          v-model="form.phoneNumber"
          type="tel"
          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
          placeholder="+51987654321"
        />
      </div>

      <!-- Currency & Monthly Income -->
      <div>
        <label for="monthlyIncome" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          {{ t('profiles.monthlyIncome') }}
        </label>
        <div class="flex space-x-2">
          <select
            v-model="form.currency"
            class="px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all font-bold"
          >
            <option value="PEN">PEN (S/)</option>
            <option value="USD">USD ($)</option>
          </select>
          <input
            id="monthlyIncome"
            v-model.number="form.monthlyIncomeAmount"
            type="number"
            step="0.01"
            min="0"
            required
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all font-mono"
            placeholder="4500.00"
          />
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100">
      <button
        v-if="isEditing"
        type="button"
        @click="$emit('cancel')"
        class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-all"
      >
        {{ t('profiles.cancelBtn') }}
      </button>

      <button
        type="submit"
        :disabled="isLoading"
        class="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
      >
        <i v-if="isLoading" class="pi pi-spin pi-spinner text-sm"></i>
        <span>{{ isLoading ? t('profiles.saving') : (isEditing ? t('profiles.updateBtn') : t('profiles.createBtn')) }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Profile } from '../../domain/profile.entity'

const { t } = useI18n()

export interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  dni: string
  phoneNumber: string
  monthlyIncomeAmount: number
  currency: string
}

const props = defineProps<{
  initialProfile?: Profile | null
  isEditing?: boolean
  isLoading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'submit', form: ProfileFormData): void
  (e: 'cancel'): void
}>()

const form = reactive<ProfileFormData>({
  firstName: props.initialProfile?.firstName || '',
  lastName: props.initialProfile?.lastName || '',
  email: props.initialProfile?.email || '',
  dni: props.initialProfile?.dni || '',
  phoneNumber: props.initialProfile?.phoneNumber || '',
  monthlyIncomeAmount: props.initialProfile?.monthlyIncomeAmount || 4500,
  currency: props.initialProfile?.currency || 'PEN'
})

watch(
  () => props.initialProfile,
  (newProfile) => {
    if (newProfile) {
      form.firstName = newProfile.firstName
      form.lastName = newProfile.lastName
      form.email = newProfile.email
      form.dni = newProfile.dni
      form.phoneNumber = newProfile.phoneNumber
      form.monthlyIncomeAmount = newProfile.monthlyIncomeAmount
      form.currency = newProfile.currency
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>

<style scoped>
</style>
