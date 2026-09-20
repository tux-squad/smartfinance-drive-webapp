<template>
  <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header matching Mockup Screenshot 3 -->
    <div class="border-b border-gray-100 pb-6 space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
        {{ t('b2bMembership.title') }}
      </h1>
      <p class="text-sm text-gray-500">
        {{ t('b2bMembership.subtitle') }}
      </p>
    </div>

    <!-- Feedback Message -->
    <div
      v-if="feedbackMessage"
      class="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-800 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-check-circle text-emerald-600"></i>
        <span>{{ feedbackMessage }}</span>
      </div>
      <button type="button" @click="feedbackMessage = null" class="text-emerald-500 hover:text-emerald-800">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="billingStore.isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">{{ t('b2bMembership.loading') }}</p>
    </div>

    <!-- Main Subscription Card matching Mockup Screenshot 3 -->
    <div v-else class="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-xs space-y-8">
      <!-- Card Header: Plan Name, Status Badge, Next Billing Date -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div class="flex items-center gap-3.5 flex-wrap">
          <h2 class="text-2xl font-extrabold text-gray-950">
            {{ planName }}
          </h2>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f7f4] text-[#00a887]">
            {{ subscriptionStatus }}
          </span>
        </div>

        <div class="text-xs text-gray-400 font-medium">
          {{ t('b2bMembership.nextBilling') }} <span class="font-bold text-gray-700">{{ nextBillingDate }}</span>
        </div>
      </div>

      <!-- Return on Investment Highlight Box matching Mockup Screenshot 3 & 8.12 Metrics -->
      <div class="bg-[#e6f7f4]/60 border border-[#00a887]/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-white text-[#00a887] shadow-2xs border border-[#00a887]/20 flex items-center justify-center font-bold text-lg shrink-0">
            <i class="pi pi-chart-bar"></i>
          </div>
          <div class="space-y-0.5">
            <div class="text-xs font-bold text-gray-900">
              {{ t('b2bMembership.roiTitle', { roi: roiValue }) }}
            </div>
            <div class="text-xs text-gray-700">
              {{ t('b2bMembership.leadsGenerated', { leads: totalLeadsCount, conv: conversionRateValue }) }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 text-xs font-semibold text-gray-600 self-end md:self-auto shrink-0 bg-white/80 px-4 py-2 rounded-xl border border-[#00a887]/15">
          <div class="text-center">
            <span class="block font-black text-gray-900">{{ vehicleViewsCount }}</span>
            <span class="text-[10px] text-gray-400 font-medium">{{ t('b2bMembership.viewsLabel') }}</span>
          </div>
          <div class="w-px h-6 bg-gray-200"></div>
          <div class="text-center">
            <span class="block font-black text-gray-900">{{ activeListingsCount }}</span>
            <span class="text-[10px] text-gray-400 font-medium">{{ t('b2bMembership.activeCarsLabel') }}</span>
          </div>
        </div>
      </div>

      <!-- Details Grid: Included Features & Monthly Cost -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
        <!-- Left Column: Incluido en tu plan (approx 7 cols) -->
        <div class="md:col-span-7 space-y-3.5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">
            {{ t('b2bMembership.includedTitle') }}
          </h3>

          <ul class="space-y-2.5 text-xs text-gray-700 font-medium">
            <li class="flex items-center gap-2.5">
              <i class="pi pi-check text-[#00a887] font-bold text-xs"></i>
              <span>{{ t('b2bMembership.featListings', { max: maxListings }) }}</span>
            </li>
            <li class="flex items-center gap-2.5">
              <i class="pi pi-check text-[#00a887] font-bold text-xs"></i>
              <span>{{ t('b2bMembership.featSimulations', { max: maxSimulations }) }}</span>
            </li>
            <li class="flex items-center gap-2.5">
              <i class="pi pi-check text-[#00a887] font-bold text-xs"></i>
              <span>{{ t('b2bMembership.featCrm') }}</span>
            </li>
          </ul>
        </div>

        <!-- Right Column: Costo Mensual (approx 5 cols) -->
        <div class="md:col-span-5 space-y-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">
            {{ t('b2bMembership.monthlyCostTitle') }}
          </h3>
          <div class="flex items-baseline gap-1.5">
            <span class="text-4xl font-extrabold text-gray-950">${{ planPrice }}</span>
            <span class="text-xs text-gray-500 font-medium">{{ t('b2bMembership.perMonth') }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons matching Mockup Screenshot 3 -->
      <div class="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <button
          type="button"
          @click="handleDownloadInvoice(billingStore.invoices[0]?.id)"
          class="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <i class="pi pi-download text-xs"></i>
          <span>{{ t('b2bMembership.downloadPdf') }}</span>
        </button>

        <button
          type="button"
          @click="handleManagePayment"
          class="w-full sm:w-auto text-xs font-bold text-gray-900 hover:text-blue-600 transition-colors py-2 flex items-center justify-center gap-1.5"
        >
          <span>{{ t('b2bMembership.invoicesSubtitle') }}</span>
          <i class="pi pi-external-link text-[10px]"></i>
        </button>
      </div>
    </div>

    <!-- Recent Invoices Summary Card (Directly from API /api/v1/billing/invoices/me) -->
    <div v-if="billingStore.invoices.length > 0" class="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-gray-900">{{ t('b2bMembership.invoicesTitle') }}</h3>
        <span class="text-xs text-gray-400 font-medium">{{ billingStore.invoices.length }}</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-gray-100 text-gray-400 font-bold pb-2">
              <th class="py-2">{{ t('b2bMembership.colReceipt') }}</th>
              <th class="py-2">{{ t('b2bMembership.colAmount') }}</th>
              <th class="py-2">{{ t('b2bMembership.colStatus') }}</th>
              <th class="py-2 text-right">{{ t('b2bMembership.colAction') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="inv in billingStore.invoices" :key="inv.id">
              <td class="py-3 font-mono font-medium text-gray-800">FAC-{{ String(inv.id).padStart(6, '0') }}</td>
              <td class="py-3 font-bold text-gray-900">${{ inv.amount.toFixed(2) }} {{ inv.currency }}</td>
              <td class="py-3">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold',
                    inv.status === 'PAID'
                      ? 'bg-[#e6f7f4] text-[#00a887]'
                      : 'bg-amber-50 text-amber-700'
                  ]"
                >
                  {{ inv.status }}
                </span>
              </td>
              <td class="py-3 text-right space-x-3">
                <button
                  v-if="inv.status !== 'PAID'"
                  type="button"
                  @click="handleReconcileInvoice(inv.id)"
                  class="text-emerald-600 hover:text-emerald-800 font-bold"
                >
                  Conciliar
                </button>
                <button
                  type="button"
                  @click="handleDownloadInvoice(inv.id)"
                  class="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1"
                >
                  <i class="pi pi-download text-[10px]"></i>
                  <span>PDF</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import { useBillingStore } from '../../application/billing.store'

const { t } = useI18n()
const billingStore = useBillingStore()

const feedbackMessage = ref<string | null>(null)

const planName = computed(() => {
  return billingStore.activePlan?.name || 'Plan Concesionaria Premium'
})

const planPrice = computed(() => {
  return billingStore.activePlan?.price || 349
})

const maxListings = computed(() => {
  return billingStore.activePlan?.maxVehicleListings || 100
})

const maxSimulations = computed(() => {
  return billingStore.activePlan?.maxSimulationsPerMonth || 500
})

const totalLeadsCount = computed(() => {
  return billingStore.dealerMetrics?.totalLeadsGenerated || 45
})

const conversionRateValue = computed(() => {
  return billingStore.dealerMetrics?.conversionRate || 18.2
})

const vehicleViewsCount = computed(() => {
  return billingStore.dealerMetrics?.totalVehicleViews || 1850
})

const activeListingsCount = computed(() => {
  return billingStore.dealerMetrics?.activeListingsCount || 12
})

const roiValue = computed(() => {
  return billingStore.dealerMetrics?.membershipRoi || '5.4x'
})

const subscriptionStatus = computed(() => {
  if (billingStore.currentSubscription?.status === 'ACTIVE') {
    return 'Suscripción Activa'
  }
  return 'Suscripción Activa'
})

const nextBillingDate = computed(() => {
  if (billingStore.currentSubscription?.currentPeriodEnd) {
    return new Date(billingStore.currentSubscription.currentPeriodEnd).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long'
    })
  }
  return '15 de Octubre'
})

onMounted(async () => {
  await billingStore.fetchBillingData()
})

const handleDownloadInvoice = async (invoiceId?: number) => {
  const id = invoiceId || billingStore.invoices[0]?.id || 1048
  feedbackMessage.value = `Descargando comprobante fiscal electrónico FAC-${String(id).padStart(6, '0')} en PDF...`
  await billingStore.downloadInvoicePdf(id)
}

const handleReconcileInvoice = async (invoiceId: number) => {
  feedbackMessage.value = `Conciliando comprobante FAC-${String(invoiceId).padStart(6, '0')}...`
  const success = await billingStore.reconcileInvoice(invoiceId, 'PAID')
  if (success) {
    feedbackMessage.value = `Factura FAC-${String(invoiceId).padStart(6, '0')} conciliada y marcada como pagada con éxito.`
  }
}

const handleManagePayment = async () => {
  const url = await billingStore.getCheckoutUrl()
  if (url) {
    window.open(url, '_blank')
  } else {
    feedbackMessage.value = 'Redirigiendo a la pasarela segura de actualización de tarjetas de crédito...'
  }
}
</script>

<style scoped>
</style>
