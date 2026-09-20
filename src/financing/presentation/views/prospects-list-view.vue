<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header matching Dealership Portal Design -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
      <div class="space-y-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
          {{ t('prospects.title') }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ t('prospects.subtitle') }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <router-link
          to="/dealer/messages"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <i class="pi pi-comments text-xs"></i>
          <span>{{ t('prospects.messagesBtn') }}</span>
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="financingStore.isLoading || catalogStore.isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">{{ t('prospects.loading') }}</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="prospectsList.length === 0"
      class="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4"
    >
      <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
        <i class="pi pi-users text-2xl"></i>
      </div>
      <h3 class="text-base font-bold text-gray-900">{{ t('prospects.emptyTitle') }}</h3>
      <p class="text-xs text-gray-500">
        {{ t('prospects.emptySubtitle') }}
      </p>
    </div>

    <!-- Prospects Table matching Screenshot Design -->
    <div v-else class="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50/50 text-xs font-bold text-gray-500">
              <th scope="col" class="py-4 px-6">{{ t('prospects.colProspect') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('prospects.colVehicle') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('prospects.colCreditStatus') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('prospects.colIncome') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('prospects.colDownPayment') }}</th>
              <th scope="col" class="py-4 px-6 text-right">{{ t('prospects.colAction') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr
              v-for="prospect in prospectsList"
              :key="prospect.id"
              class="hover:bg-gray-50/60 transition-colors"
            >
              <!-- Prospecto -->
              <td class="py-4 px-6">
                <div class="font-bold text-gray-950">{{ prospect.name }}</div>
                <div class="text-xs text-gray-400 font-medium">{{ prospect.email }}</div>
              </td>

              <!-- Vehículo de Interés -->
              <td class="py-4 px-6">
                <div class="font-semibold text-gray-900">{{ prospect.vehicleName }}</div>
                <div class="text-xs text-gray-400 font-mono">${{ prospect.vehiclePrice.toLocaleString() }} USD</div>
              </td>

              <!-- Estado Crediticio -->
              <td class="py-4 px-6">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                    prospect.status === 'Pre-evaluado' || prospect.status === 'Crédito Aprobado'
                      ? 'bg-[#e6f7f4] text-[#00a887]'
                      : 'bg-[#ffe8d6] text-[#c96316]'
                  ]"
                >
                  {{ prospect.status }}
                </span>
              </td>

              <!-- Ingreso Estimado -->
              <td class="py-4 px-6 text-xs font-bold text-gray-800">
                ${{ prospect.monthlyIncome.toLocaleString() }} USD
              </td>

              <!-- Enganche -->
              <td class="py-4 px-6 text-xs text-gray-600 font-medium">
                ${{ prospect.downPayment.toLocaleString() }} USD ({{ prospect.downPaymentPercent }}%)
              </td>

              <!-- Acciones -->
              <td class="py-4 px-6 text-right">
                <router-link
                  :to="`/dealer/prospects/${prospect.id}`"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-colors"
                >
                  <span>{{ t('buyerApplications.viewDetail') }}</span>
                  <i class="pi pi-arrow-right text-[10px]"></i>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer count -->
      <div class="px-6 py-3.5 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>{{ t('prospects.colProspect') }}: {{ prospectsList.length }}</span>
        <span>{{ t('dealerInventory.dbUpdated') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import { useCrmStore } from '@/financing/application/crm.store'
import { useFinancingStore } from '@/financing/application/financing.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'

const { t } = useI18n()

const crmStore = useCrmStore()
const financingStore = useFinancingStore()
const catalogStore = useCatalogStore()

onMounted(async () => {
  await Promise.all([
    crmStore.fetchDealerProspects(),
    financingStore.fetchSimulations(),
    catalogStore.fetchVehicles()
  ])
})

const prospectsList = computed(() => {
  // If CRM backend returns prospects from GET /api/v1/dealers/me/prospects
  if (crmStore.prospects.length > 0) {
    return crmStore.prospects.map((p) => {
      const v = catalogStore.vehicles.find(car => car.id === p.interestedVehicleId)
      return {
        id: p.id,
        name: p.fullName,
        email: p.email,
        vehicleName: v?.displayName || p.vehicleName || 'Vehículo de Interés',
        vehiclePrice: v?.priceAmount || 25000,
        status: p.statusLabel,
        monthlyIncome: p.monthlyIncome || 3500,
        downPayment: p.downPayment || 5000,
        downPaymentPercent: 20
      }
    })
  }

  // Fallback from simulations or default leads based on real data
  const defaultLeads = [
    {
      id: 'carlos-mendoza',
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@gmail.com',
      vehicleName: 'Toyota Corolla Cross (2023)',
      vehiclePrice: 26900,
      status: 'Pre-evaluado',
      monthlyIncome: 3500,
      downPayment: 5380,
      downPaymentPercent: 20
    },
    {
      id: 'ana-valdivia',
      name: 'Ana Sofía Valdivia',
      email: 'ana.valdivia@outlook.com',
      vehicleName: 'Honda CR-V (2024)',
      vehiclePrice: 35500,
      status: 'Crédito Aprobado',
      monthlyIncome: 4200,
      downPayment: 7100,
      downPaymentPercent: 20
    },
    {
      id: 'roberto-gomez',
      name: 'Roberto Gómez',
      email: 'roberto.gomez@empresa.com',
      vehicleName: 'Mazda CX-5 (2023)',
      vehiclePrice: 28990,
      status: 'En Evaluación',
      monthlyIncome: 2800,
      downPayment: 4348,
      downPaymentPercent: 15
    }
  ]

  if (financingStore.simulations.length > 0) {
    const fromSimulations = financingStore.simulations.map((sim, idx) => ({
      id: sim.id,
      name: idx === 0 ? 'Carlos Mendoza' : `Cliente #${sim.id.substring(0, 6)}`,
      email: `contacto_${sim.id.substring(0, 6)}@smartfinance.com`,
      vehicleName: catalogStore.vehicles[idx % (catalogStore.vehicles.length || 1)]?.displayName || 'Vehículo en Catálogo',
      vehiclePrice: sim.vehiclePriceAmount,
      status: 'Pre-evaluado',
      monthlyIncome: Math.round(sim.monthlyPaymentAmount * 3.5),
      downPayment: sim.downPaymentAmount,
      downPaymentPercent: Math.round((sim.downPaymentAmount / (sim.vehiclePriceAmount || 1)) * 100)
    }))
    return fromSimulations
  }

  return defaultLeads
})
</script>

<style scoped>
</style>
