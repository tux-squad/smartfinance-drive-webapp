<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { FinancialEntity } from '../../domain/financial-entity.entity'

const props = defineProps<{
  visible: boolean
  entity: FinancialEntity | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const router = useRouter()
const { t } = useI18n()

const showDialog = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const benchmarks = computed(() => props.entity?.rateBenchmarks || [])

const goToSimulation = () => {
  if (props.entity) {
    showDialog.value = false
    router.push({ name: 'simulations', query: { financialEntityId: props.entity.id } })
  }
}
</script>

<template>
  <Dialog
    v-model:visible="showDialog"
    modal
    :header="entity?.name || t('partners.dialogHeaderFallback')"
    :style="{ width: '90vw', maxWidth: '650px' }"
    class="!rounded-3xl"
  >
    <div class="space-y-6 pt-2">
      <!-- Modal Header Subtitle -->
      <div class="flex items-center justify-between rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 p-4 border border-emerald-100 dark:border-emerald-900/30">
        <div>
          <span class="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">
            {{ t('partners.entityRucLabel') }}: <span class="font-mono">{{ entity?.ruc || 'N/A' }}</span>
          </span>
          <p class="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
            {{ t('partners.dialogSubtitle') }}
          </p>
        </div>
        <i class="pi pi-shield-check text-2xl text-emerald-600"></i>
      </div>

      <!-- Empty Benchmarks Notice -->
      <div v-if="benchmarks.length === 0" class="py-8 text-center text-sm text-gray-500">
        {{ t('partners.noBenchmarksText') }}
      </div>

      <!-- Benchmarks Data Table -->
      <DataTable
        v-else
        :value="benchmarks"
        stripedRows
        responsiveLayout="scroll"
        class="!text-sm"
      >
        <Column field="loanTermMonths" :header="t('partners.tableColTerm')">
          <template #body="{ data }">
            <span class="font-bold text-gray-900 dark:text-white">
              {{ data.loanTermMonths }} {{ t('partners.monthsLabel') }}
            </span>
          </template>
        </Column>

        <Column field="annualEffectiveRate" :header="t('partners.tableColTea')">
          <template #body="{ data }">
            <span class="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {{ data.formattedTea }}
            </span>
          </template>
        </Column>

        <Column field="monthlyCreditLifeInsuranceRate" :header="t('partners.tableColInsurance')">
          <template #body="{ data }">
            <span class="text-xs font-mono text-gray-700 dark:text-gray-300">
              {{ data.formattedInsuranceRate }}
            </span>
          </template>
        </Column>
      </DataTable>

      <!-- Modal Footer CTA -->
      <div class="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          :label="t('partners.closeDialogBtn')"
          severity="secondary"
          text
          class="!rounded-xl !text-xs"
          @click="showDialog = false"
        />
        <Button
          :label="t('partners.simulateWithEntityBtn')"
          icon="pi pi-calculator"
          severity="success"
          class="!rounded-xl !text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20"
          @click="goToSimulation"
        />
      </div>
    </div>
  </Dialog>
</template>
