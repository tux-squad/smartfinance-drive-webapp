<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import type { Vehicle } from '../../domain/vehicle.entity'

const props = defineProps<{
  vehicle: Vehicle
}>()

const router = useRouter()
const { t } = useI18n()

const imageUrl = computed(() => props.vehicle.imagePath || '')

const isNew = computed(() => props.vehicle.condition === 'NEW')

const estimatedMonthly = computed(() => {
  const price = props.vehicle.priceAmount || 0
  const financed = price * 0.8 // 20% down
  const rate = 0.095 / 12 // 9.5% TEA monthly
  const n = 48
  const pmt = (financed * (rate * Math.pow(1 + rate, n))) / (Math.pow(1 + rate, n) - 1)
  const symbol = props.vehicle.currency === 'PEN' ? 'S/' : '$'
  return `${symbol} ${Math.round(pmt).toLocaleString('en-US')}`
})

const goToDetail = () => {
  router.push({ name: 'vehicle-detail', params: { id: props.vehicle.id } })
}

const goToSimulation = () => {
  router.push({ name: 'simulations', query: { vehicleId: props.vehicle.id } })
}
</script>

<template>
  <div
    class="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
  >
    <!-- Card Header / Image Section -->
    <div class="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="vehicle.displayName"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div v-else class="flex flex-col items-center justify-center text-slate-400 space-y-1">
        <i class="pi pi-car text-5xl"></i>
        <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400">{{ vehicle.brand }}</span>
      </div>
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none"></div>

      <!-- Badges overlay -->
      <div class="absolute top-3 left-3 right-3 flex items-center justify-between">
        <div class="flex gap-1.5">
          <Tag
            :value="isNew ? t('catalog.conditionNew') : t('catalog.conditionUsed')"
            :severity="isNew ? 'success' : 'warn'"
            class="!text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-md"
          />
          <span class="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-mono font-medium text-white shadow-md border border-white/10">
            {{ vehicle.manufactureYear }}
          </span>
        </div>

        <span class="rounded-full bg-emerald-950/80 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
          Cuota ~{{ estimatedMonthly }}/m
        </span>
      </div>

      <!-- Price Overlay at Bottom of Image -->
      <div class="absolute bottom-3 left-4 right-4 flex items-baseline justify-between text-white">
        <span class="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">Precio Contado</span>
        <span class="text-2xl font-black font-mono text-emerald-400 drop-shadow-md">
          {{ vehicle.formattedPrice }}
        </span>
      </div>
    </div>

    <!-- Card Content Section -->
    <div class="flex flex-1 flex-col justify-between p-5 space-y-4">
      <div>
        <!-- Brand & Model -->
        <h3 class="text-base font-bold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
          {{ vehicle.brand }} {{ vehicle.model }}
        </h3>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <i class="pi pi-check-circle text-emerald-500 text-xs"></i>
          <span>Garantía y peritaje oficial verificado</span>
        </p>
      </div>

      <!-- Card Action Buttons -->
      <div class="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          :label="t('catalog.viewDetailBtn')"
          icon="pi pi-eye"
          outlined
          size="small"
          class="flex-1 !rounded-xl !text-xs !py-2.5 font-bold !border-slate-300 dark:!border-slate-700 !text-slate-700 dark:!text-slate-300 hover:!bg-slate-100 dark:hover:!bg-slate-800 active:scale-[0.98] transition-all"
          @click="goToDetail"
        />
        <Button
          :label="t('catalog.simulateLoanBtn')"
          icon="pi pi-calculator"
          size="small"
          class="flex-1 !rounded-xl !text-xs !py-2.5 font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-none shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
          @click="goToSimulation"
        />
      </div>
    </div>
  </div>
</template>

