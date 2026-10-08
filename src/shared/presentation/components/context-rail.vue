<template>
  <div>
    <!-- Backdrop on smaller screens when context rail is open -->
    <div
      v-if="layoutStore.isContextRailOpen"
      class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 xl:hidden"
      @click="layoutStore.toggleContextRail"
    />

    <!-- Multi-Column Right Rail Panel -->
    <aside
      class="fixed xl:sticky top-3 bottom-3 right-3 z-30 my-3 mr-3 w-80 rounded-3xl bg-surface-0/95 dark:bg-surface-900/95 border border-surface-200/80 dark:border-surface-800 backdrop-blur-xl shadow-xl flex flex-col justify-between transition-all duration-300 ease-in-out select-none overflow-hidden"
      :class="[
        layoutStore.isContextRailOpen ? 'translate-x-0' : 'translate-x-full xl:hidden'
      ]"
      style="height: calc(100vh - 1.5rem);"
    >
      <!-- Header of Context Rail -->
      <div class="p-5 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold shadow-xs">
            <i class="pi pi-compass" />
          </div>
          <div>
            <h3 class="text-xs font-bold text-surface-900 dark:text-surface-0 uppercase tracking-wider">
              Acciones Rápidas
            </h3>
            <p class="text-[11px] text-surface-500 dark:text-surface-400 font-medium">
              Multi-Column Panel
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="layoutStore.toggleContextRail"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          v-tooltip.left="'Cerrar panel'"
        >
          <i class="pi pi-times text-xs" />
        </button>
      </div>

      <!-- Content Scrollable Body -->
      <div class="flex-1 p-5 space-y-5 overflow-y-auto custom-rail-scrollbar">
        <!-- Financial Tools Shortcuts -->
        <div class="space-y-2.5">
          <span class="text-[11px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
            Herramientas Directas
          </span>

          <div class="space-y-2">
            <router-link
              to="/simulations"
              class="flex items-center p-3 rounded-2xl border border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/40 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all group"
            >
              <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm mr-3 group-hover:scale-105 transition-transform">
                <i class="pi pi-calculator" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-surface-900 dark:text-surface-0 truncate">
                  Simulación de Crédito
                </div>
                <div class="text-[10px] text-surface-500 dark:text-surface-400 truncate">
                  Cálculo de cuotas y cronogramas
                </div>
              </div>
              <i class="pi pi-chevron-right text-[10px] text-surface-400 group-hover:translate-x-0.5 transition-transform" />
            </router-link>

            <router-link
              to="/scoring"
              class="flex items-center p-3 rounded-2xl border border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/40 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all group"
            >
              <div class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm mr-3 group-hover:scale-105 transition-transform">
                <i class="pi pi-shield" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-surface-900 dark:text-surface-0 truncate">
                  Scoring de Riesgo
                </div>
                <div class="text-[10px] text-surface-500 dark:text-surface-400 truncate">
                  Evaluación crediticia de 300 a 850
                </div>
              </div>
              <i class="pi pi-chevron-right text-[10px] text-surface-400 group-hover:translate-x-0.5 transition-transform" />
            </router-link>

            <router-link
              to="/consultation"
              class="flex items-center p-3 rounded-2xl border border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/40 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all group"
            >
              <div class="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center text-sm mr-3 group-hover:scale-105 transition-transform">
                <i class="pi pi-sparkles" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-surface-900 dark:text-surface-0 truncate">
                  Asesor Financiero IA
                </div>
                <div class="text-[10px] text-surface-500 dark:text-surface-400 truncate">
                  Consultas y recomendaciones
                </div>
              </div>
              <i class="pi pi-chevron-right text-[10px] text-surface-400 group-hover:translate-x-0.5 transition-transform" />
            </router-link>
          </div>
        </div>

        <!-- Reference Financial Benchmarks Card -->
        <div class="rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/70 dark:bg-surface-800/30 p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-surface-800 dark:text-surface-100 flex items-center gap-1.5">
              <i class="pi pi-chart-bar text-blue-500" />
              Tasas Referenciales
            </span>
            <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              SBS / Mercado
            </span>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex justify-between items-center py-1 border-b border-surface-100 dark:border-surface-800">
              <span class="text-surface-500 dark:text-surface-400">TCEA Promedio Soles:</span>
              <span class="font-bold text-surface-900 dark:text-surface-0 font-mono">14.85%</span>
            </div>
            <div class="flex justify-between items-center py-1 border-b border-surface-100 dark:border-surface-800">
              <span class="text-surface-500 dark:text-surface-400">TCEA Promedio Dólares:</span>
              <span class="font-bold text-surface-900 dark:text-surface-0 font-mono">10.20%</span>
            </div>
            <div class="flex justify-between items-center py-1">
              <span class="text-surface-500 dark:text-surface-400">Cuota Inicial Sugerida:</span>
              <span class="font-bold text-surface-900 dark:text-surface-0 font-mono">20%</span>
            </div>
          </div>
        </div>

        <!-- System Status Indicator -->
        <div class="rounded-2xl border border-surface-200 dark:border-surface-800 p-3.5 flex items-center space-x-3 bg-surface-0 dark:bg-surface-900">
          <div class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate">
              Servicios Conectados
            </div>
            <div class="text-[10px] text-surface-400 truncate">
              Scoring API & Catálogo Online
            </div>
          </div>
        </div>
      </div>

      <!-- Footer of Context Rail -->
      <div class="p-4 border-t border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/30">
        <router-link
          to="/settings"
          class="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-xl bg-surface-200/70 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-200 text-xs font-semibold transition-colors"
        >
          <i class="pi pi-sliders-h text-xs" />
          <span>Preferencias de Layout</span>
        </router-link>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/shared/application/layout.store'

const layoutStore = useLayoutStore()
</script>

<style scoped>
.custom-rail-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-rail-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(150, 150, 150, 0.2);
  border-radius: 4px;
}
</style>
