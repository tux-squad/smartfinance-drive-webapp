<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

    <!-- ======================================================== -->
    <!-- 1. DEALER DASHBOARD (ROL CONCESIONARIA)                  -->
    <!-- ======================================================== -->
    <template v-if="isDealer">
      <!-- Header Banner Concesionaria -->
      <div class="bg-gradient-to-r from-[#0a1936] via-blue-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eb8f47]/20 border border-[#eb8f47]/40 text-[#eb8f47] text-xs font-bold">
              <i class="pi pi-building"></i>
              <span>{{ t('dashboard.dealer.badge') }}</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {{ t('dashboard.dealer.title') }}
            </h1>
            <p class="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
              {{ t('dashboard.dealer.subtitle') }}
            </p>
          </div>

          <!-- Direct CTA -->
          <div class="flex items-center gap-3 shrink-0">
            <router-link
              to="/dealer/inventory/new"
              class="px-5 py-3 rounded-2xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <i class="pi pi-plus"></i>
              <span>{{ t('dashboard.dealer.publishBtn') }}</span>
            </router-link>
            <router-link
              to="/dealer/prospects"
              class="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <i class="pi pi-users"></i>
              <span>{{ t('dashboard.dealer.prospectsBtn') }}</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 6 Main Metric Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Card 1: Leads -->
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-4 hover:shadow-md hover:border-primary/40 dark:hover:border-primary/40 transition-all">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{{ t('dashboard.dealer.kpi.leadsTitle') }}</span>
            <div class="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <i class="pi pi-users text-lg"></i>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-surface-900 dark:text-surface-0 font-mono">{{ dealerLeadsCount }}</div>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <i class="pi pi-arrow-up-right text-[10px]"></i>
              <span>{{ t('dashboard.dealer.kpi.leadsGrowth') }}</span>
              <span class="text-surface-400 font-normal">{{ t('dashboard.dealer.kpi.leadsVs') }}</span>
            </p>
          </div>
          <div class="text-[11px] text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-100 dark:border-surface-800">
            {{ t('dashboard.dealer.kpi.leadsDesc') }}
          </div>
        </div>

        <!-- Card 2: Conversion Rate -->
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-4 hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{{ t('dashboard.dealer.kpi.conversionTitle') }}</span>
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <i class="pi pi-chart-line text-lg"></i>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-surface-900 dark:text-surface-0 font-mono">{{ dealerConversionRate }}%</div>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <i class="pi pi-check text-[10px]"></i>
              <span>{{ t('dashboard.dealer.kpi.conversionSub') }}</span>
            </p>
          </div>
          <div class="text-[11px] text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-100 dark:border-surface-800">
            {{ t('dashboard.dealer.kpi.conversionDesc') }}
          </div>
        </div>

        <!-- Card 3: Vehicle Views -->
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-4 hover:shadow-md hover:border-purple-500/40 dark:hover:border-purple-500/40 transition-all">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{{ t('dashboard.dealer.kpi.viewsTitle') }}</span>
            <div class="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <i class="pi pi-eye text-lg"></i>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-surface-900 dark:text-surface-0 font-mono">{{ dealerViewsCount.toLocaleString() }}</div>
            <p class="text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 mt-1">
              <i class="pi pi-car text-[10px]"></i>
              <span>{{ t('dashboard.dealer.kpi.viewsSub') }}</span>
            </p>
          </div>
          <div class="text-[11px] text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-100 dark:border-surface-800">
            {{ t('dashboard.dealer.kpi.viewsDesc') }}
          </div>
        </div>

        <!-- Card 4: Active Listings -->
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-4 hover:shadow-md hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{{ t('dashboard.dealer.kpi.listingsTitle') }}</span>
            <div class="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <i class="pi pi-car text-lg"></i>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-surface-900 dark:text-surface-0 font-mono">{{ dealerListingsCount }} {{ t('dashboard.dealer.kpi.listingsUnits') }}</div>
            <p class="text-xs text-surface-600 dark:text-surface-300 font-medium mt-1">
              <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ t('dashboard.dealer.kpi.listingsAvailable') }}</span> · {{ t('dashboard.dealer.kpi.listingsReserved') }} · {{ t('dashboard.dealer.kpi.listingsSold') }}
            </p>
          </div>
          <div class="text-[11px] text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-100 dark:border-surface-800">
            {{ t('dashboard.dealer.kpi.listingsLimit') }}
          </div>
        </div>

        <!-- Card 5: Return on Investment -->
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-4 hover:shadow-md hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{{ t('dashboard.dealer.kpi.roiTitle') }}</span>
            <div class="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#00a887] flex items-center justify-center font-bold">
              <i class="pi pi-dollar text-lg"></i>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-[#00a887] font-mono">{{ dealerRoiValue }} ROI</div>
            <p class="text-xs text-[#00a887] font-semibold flex items-center gap-1 mt-1">
              <i class="pi pi-verified text-[10px]"></i>
              <span>{{ t('dashboard.dealer.kpi.roiBadge') }}</span>
            </p>
          </div>
          <div class="text-[11px] text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-100 dark:border-surface-800">
            {{ t('dashboard.dealer.kpi.roiDesc') }}
          </div>
        </div>

        <!-- Card 6: Financed Volume -->
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-4 hover:shadow-md hover:border-sky-500/40 dark:hover:border-sky-500/40 transition-all">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{{ t('dashboard.dealer.kpi.volumeTitle') }}</span>
            <div class="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <i class="pi pi-credit-card text-lg"></i>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-surface-900 dark:text-surface-0 font-mono">$ 284,500 USD</div>
            <p class="text-xs text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 mt-1">
              <i class="pi pi-check-circle text-[10px]"></i>
              <span>{{ t('dashboard.dealer.kpi.volumeSub') }}</span>
            </p>
          </div>
          <div class="text-[11px] text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-100 dark:border-surface-800">
            {{ t('dashboard.dealer.kpi.volumeDesc') }}
          </div>
        </div>
      </div>

      <!-- Funnel & Inventory Breakdown Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left: Sales Funnel (7 cols) -->
        <div class="lg:col-span-7 bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-7 shadow-xs space-y-6">
          <div class="flex items-center justify-between border-b border-surface-100 dark:border-surface-800 pb-4">
            <div>
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-0">{{ t('dashboard.dealer.funnel.title') }}</h2>
              <p class="text-xs text-surface-500 dark:text-surface-400">{{ t('dashboard.dealer.funnel.subtitle') }}</p>
            </div>
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
              {{ t('dashboard.dealer.funnel.badge') }}
            </span>
          </div>

          <div class="space-y-4">
            <!-- Stage 1 -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-surface-800 dark:text-surface-200">{{ t('dashboard.dealer.funnel.stage1') }}</span>
                <span class="text-primary font-black font-mono">{{ funnelNew }}</span>
              </div>
              <div class="h-3 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                <div class="h-full bg-blue-600 rounded-full w-full"></div>
              </div>
            </div>

            <!-- Stage 2 -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-surface-800 dark:text-surface-200">{{ t('dashboard.dealer.funnel.stage2') }}</span>
                <span class="text-primary font-black font-mono">{{ funnelContacted }}</span>
              </div>
              <div class="h-3 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                <div class="h-full bg-sky-500 rounded-full" :style="{ width: funnelPercentage(funnelContacted) }"></div>
              </div>
            </div>

            <!-- Stage 3 -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-surface-800 dark:text-surface-200">{{ t('dashboard.dealer.funnel.stage3') }}</span>
                <span class="text-primary font-black font-mono">{{ funnelQualified }}</span>
              </div>
              <div class="h-3 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                <div class="h-full bg-amber-500 rounded-full" :style="{ width: funnelPercentage(funnelQualified) }"></div>
              </div>
            </div>

            <!-- Stage 4 -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-surface-800 dark:text-surface-200">{{ t('dashboard.dealer.funnel.stage4') }}</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-black font-mono">{{ funnelClosedWon }}</span>
              </div>
              <div class="h-3 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                <div class="h-full bg-[#00a887] rounded-full" :style="{ width: funnelPercentage(funnelClosedWon) }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Top Vehicles Consulted (5 cols) -->
        <div class="lg:col-span-5 bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-7 shadow-xs space-y-6">
          <div class="flex items-center justify-between border-b border-surface-100 dark:border-surface-800 pb-4">
            <div>
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-0">{{ t('dashboard.dealer.topVehicles.title') }}</h2>
              <p class="text-xs text-surface-500 dark:text-surface-400">{{ t('dashboard.dealer.topVehicles.subtitle') }}</p>
            </div>
            <router-link to="/dealer/inventory" class="text-xs font-bold text-primary hover:underline">
              {{ t('dashboard.dealer.topVehicles.viewAll') }}
            </router-link>
          </div>

          <div class="space-y-4 divide-y divide-surface-100 dark:divide-surface-800">
            <div class="flex items-center gap-4 pt-3 first:pt-0">
              <div class="w-12 h-12 rounded-2xl bg-surface-100 dark:bg-surface-800 overflow-hidden shrink-0 flex items-center justify-center text-primary">
                <i class="pi pi-car text-xl"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xs font-bold text-surface-900 dark:text-surface-0 truncate">Toyota Corolla Cross (2023)</h3>
                <p class="text-[11px] text-surface-500 dark:text-surface-400 font-medium">$ 26,900 USD · 540 vistas</p>
              </div>
              <span class="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0 font-mono">14 leads</span>
            </div>

            <div class="flex items-center gap-4 pt-3">
              <div class="w-12 h-12 rounded-2xl bg-surface-100 dark:bg-surface-800 overflow-hidden shrink-0 flex items-center justify-center text-primary">
                <i class="pi pi-car text-xl"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xs font-bold text-surface-900 dark:text-surface-0 truncate">Honda CR-V (2024)</h3>
                <p class="text-[11px] text-surface-500 dark:text-surface-400 font-medium">$ 34,500 USD · 410 vistas</p>
              </div>
              <span class="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0 font-mono">9 leads</span>
            </div>

            <div class="flex items-center gap-4 pt-3">
              <div class="w-12 h-12 rounded-2xl bg-surface-100 dark:bg-surface-800 overflow-hidden shrink-0 flex items-center justify-center text-primary">
                <i class="pi pi-car text-xl"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xs font-bold text-surface-900 dark:text-surface-0 truncate">Mazda CX-5 (2023)</h3>
                <p class="text-[11px] text-surface-500 dark:text-surface-400 font-medium">$ 29,800 USD · 320 vistas</p>
              </div>
              <span class="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0 font-mono">8 leads</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ======================================================== -->

    <!-- 2. BUYER DASHBOARD (ROL COMPRADOR / DEFAULT)             -->
    <!-- ======================================================== -->
    <template v-else-if="!isBank && !isAdmin">
      <!-- Welcome Header -->
      <div class="bg-gradient-to-r from-blue-900 via-sky-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="max-w-3xl space-y-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-semibold tracking-wider rounded-full border border-sky-400/30 backdrop-blur-md">
              <i class="pi pi-sparkles text-[10px]"></i>
              {{ t('home.tag') }}
            </span>
            <h1 class="text-3xl md:text-4xl font-black tracking-tight text-white">
              {{ t('home.welcomeTitle') }}
            </h1>
            <p class="text-blue-100/80 text-xs md:text-sm leading-relaxed max-w-2xl">
              {{ t('home.welcomeDescription') }}
            </p>
          </div>
          <div class="hidden md:flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 p-4 border border-white/20 backdrop-blur-md shadow-2xl shrink-0">
            <img src="/logo-white.svg" alt="SmartFinance Logo" class="w-full h-full object-contain drop-shadow" />
          </div>
        </div>
      </div>

      <!-- Buyer Financial KPIs Grid (Bento Style) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- KPI 1: Credit Score with Visual Meter -->
        <div class="bg-surface-0 dark:bg-surface-900 p-5 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xs hover:border-primary/40 dark:hover:border-primary/40 hover:-translate-y-0.5 transition-all space-y-3">
          <div class="flex items-center justify-between text-xs font-bold text-surface-500 dark:text-surface-400">
            <span>{{ t('dashboard.buyer.scoreTitle') }}</span>
            <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <i class="pi pi-shield text-xs"></i>
            </div>
          </div>
          <div>
            <div class="text-2xl font-black text-surface-900 dark:text-surface-0 font-mono">{{ buyerScore }}</div>
            <!-- Progress bar -->
            <div class="w-full bg-surface-100 dark:bg-surface-800 h-2 rounded-full mt-2 overflow-hidden">
              <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style="width: 82%"></div>
            </div>
          </div>
          <div class="flex items-center justify-between pt-1">
            <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              <i class="pi pi-check text-[9px]"></i>
              {{ buyerScoreLevel }}
            </span>
            <span class="text-[10px] text-surface-400 font-mono">300 - 850</span>
          </div>
        </div>

        <!-- KPI 2: Capacity -->
        <div class="bg-surface-0 dark:bg-surface-900 p-5 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xs hover:border-primary/40 dark:hover:border-primary/40 hover:-translate-y-0.5 transition-all space-y-3">
          <div class="flex items-center justify-between text-xs font-bold text-surface-500 dark:text-surface-400">
            <span>{{ t('dashboard.buyer.capacityTitle') }}</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <i class="pi pi-dollar text-xs"></i>
            </div>
          </div>
          <div>
            <div class="text-2xl font-black text-surface-900 dark:text-surface-0 font-mono">{{ buyerCapacity }}</div>
            <p class="text-[11px] text-surface-500 dark:text-surface-400 mt-1">
              {{ t('dashboard.buyer.capacitySub') }}
            </p>
          </div>
          <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <i class="pi pi-verified text-[10px]"></i>
            <span>Evaluación responsable</span>
          </div>
        </div>

        <!-- KPI 3: Simulations -->
        <div class="bg-surface-0 dark:bg-surface-900 p-5 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xs hover:border-primary/40 dark:hover:border-primary/40 hover:-translate-y-0.5 transition-all space-y-3">
          <div class="flex items-center justify-between text-xs font-bold text-surface-500 dark:text-surface-400">
            <span>{{ t('dashboard.buyer.simulationsTitle') }}</span>
            <div class="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <i class="pi pi-calculator text-xs"></i>
            </div>
          </div>
          <div>
            <div class="text-2xl font-black text-surface-900 dark:text-surface-0 font-mono">{{ buyerSimulationsCount }}</div>
            <p class="text-[11px] text-surface-500 dark:text-surface-400 mt-1">
              Cotizaciones generadas
            </p>
          </div>
          <router-link to="/simulations" class="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
            <span>{{ t('dashboard.buyer.simulationsLink') }}</span>
            <i class="pi pi-arrow-right text-[9px]"></i>
          </router-link>
        </div>

        <!-- KPI 4: Applications -->
        <div class="bg-surface-0 dark:bg-surface-900 p-5 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xs hover:border-primary/40 dark:hover:border-primary/40 hover:-translate-y-0.5 transition-all space-y-3">
          <div class="flex items-center justify-between text-xs font-bold text-surface-500 dark:text-surface-400">
            <span>{{ t('dashboard.buyer.applicationsTitle') }}</span>
            <div class="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <i class="pi pi-check-circle text-xs"></i>
            </div>
          </div>
          <div>
            <div class="text-2xl font-black text-surface-900 dark:text-surface-0">{{ buyerApplicationsStatus }}</div>
            <p class="text-[11px] text-surface-500 dark:text-surface-400 mt-1">
              Estado de solicitudes
            </p>
          </div>
          <router-link to="/reports/applications" class="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline">
            <span>{{ t('dashboard.buyer.applicationsLink') }}</span>
            <i class="pi pi-arrow-right text-[9px]"></i>
          </router-link>
        </div>
      </div>

      <!-- Quick Action Bento Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xs hover:shadow-md hover:border-primary/40 dark:hover:border-primary/40 transition-all space-y-4">
          <div class="w-12 h-12 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-xl shadow-xs">
            <i class="pi pi-car"></i>
          </div>
          <div>
            <h3 class="font-bold text-surface-900 dark:text-surface-0 text-base">{{ t('home.catalogTitle') }}</h3>
            <p class="text-surface-500 dark:text-surface-400 text-xs mt-1 leading-relaxed">{{ t('home.catalogDesc') }}</p>
          </div>
          <router-link to="/vehicles" class="inline-flex items-center text-xs font-bold text-primary hover:underline gap-1.5 pt-1">
            <span>{{ t('home.catalogBtn') }}</span>
            <i class="pi pi-arrow-right text-[10px]"></i>
          </router-link>
        </div>

        <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xs hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all space-y-4">
          <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-xl shadow-xs">
            <i class="pi pi-calculator"></i>
          </div>
          <div>
            <h3 class="font-bold text-surface-900 dark:text-surface-0 text-base">{{ t('home.simulationsTitle') }}</h3>
            <p class="text-surface-500 dark:text-surface-400 text-xs mt-1 leading-relaxed">{{ t('home.simulationsDesc') }}</p>
          </div>
          <router-link to="/simulations/new" class="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline gap-1.5 pt-1">
            <span>{{ t('home.simulationsBtn') }}</span>
            <i class="pi pi-arrow-right text-[10px]"></i>
          </router-link>
        </div>

        <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xs hover:shadow-md hover:border-purple-500/40 dark:hover:border-purple-500/40 transition-all space-y-4">
          <div class="w-12 h-12 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center text-xl shadow-xs">
            <i class="pi pi-sparkles"></i>
          </div>
          <div>
            <h3 class="font-bold text-surface-900 dark:text-surface-0 text-base">{{ t('dashboard.buyer.aiTitle') }}</h3>
            <p class="text-surface-500 dark:text-surface-400 text-xs mt-1 leading-relaxed">{{ t('dashboard.buyer.aiDesc') }}</p>
          </div>
          <router-link to="/consultation" class="inline-flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline gap-1.5 pt-1">
            <span>{{ t('dashboard.buyer.aiBtn') }}</span>
            <i class="pi pi-arrow-right text-[10px]"></i>
          </router-link>
        </div>
      </div>
    </template>

    <!-- ======================================================== -->
    <!-- 3. FINANCIAL INSTITUTION (ROL BANCO)                     -->
    <!-- ======================================================== -->
    <template v-else-if="isBank">
      <div class="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
          <i class="pi pi-building-columns text-[10px]"></i>
          {{ t('dashboard.bank.badge') }}
        </span>
        <h1 class="text-3xl font-black">{{ bankEntityName }}</h1>
        <p class="text-emerald-100/80 text-xs sm:text-sm">{{ t('dashboard.bank.subtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-1 hover:shadow-md transition-shadow">
          <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{{ t('dashboard.bank.receivedTitle') }}</span>
          <div class="text-3xl font-black text-surface-900 dark:text-surface-0 font-mono">{{ bankReceivedCount }}</div>
          <span class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{{ bankUnderReviewCount }} en evaluación</span>
        </div>
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-1 hover:shadow-md transition-shadow">
          <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{{ t('dashboard.bank.approvedTitle') }}</span>
          <div class="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{{ bankApprovedCount }}</div>
          <span class="text-xs text-surface-500 dark:text-surface-400 font-medium">Tasa: {{ bankApprovalRate }}</span>
        </div>
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-1 hover:shadow-md transition-shadow">
          <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{{ t('dashboard.bank.rateTitle') }}</span>
          <div class="text-3xl font-black text-surface-900 dark:text-surface-0 font-mono">{{ bankAvgRate }}</div>
          <span class="text-xs text-surface-500 dark:text-surface-400 font-medium">{{ bankBenchmarksCount }} benchmarks activos</span>
        </div>
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-1 hover:shadow-md transition-shadow">
          <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Volumen Desembolsado</span>
          <div class="text-2xl font-black text-primary font-mono">{{ bankDisbursedVolume }}</div>
          <span class="text-xs text-primary font-medium">{{ bankDisbursedCount }} créditos liquidados</span>
        </div>
      </div>
    </template>

    <!-- ======================================================== -->
    <!-- 4. ADMINISTRATOR (ROL ADMIN)                             -->
    <!-- ======================================================== -->
    <template v-else>
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-400/30">
          <i class="pi pi-lock text-[10px]"></i>
          {{ t('dashboard.admin.badge') }}
        </span>
        <h1 class="text-3xl font-black">{{ t('dashboard.admin.title') }}</h1>
        <p class="text-indigo-100/80 text-xs sm:text-sm">{{ t('dashboard.admin.subtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-1 hover:shadow-md transition-shadow">
          <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{{ t('dashboard.admin.dealersTitle') }}</span>
          <div class="text-3xl font-black text-surface-900 dark:text-surface-0 font-mono">{{ adminDealersCount }}</div>
          <span class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{{ adminActiveDealersCount }} concesionarios activos</span>
        </div>
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-1 hover:shadow-md transition-shadow">
          <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{{ t('dashboard.admin.banksTitle') }}</span>
          <div class="text-3xl font-black text-surface-900 dark:text-surface-0 font-mono">{{ adminBanksCount }}</div>
          <span class="text-xs text-surface-500 dark:text-surface-400">Entidades financieras aliadas</span>
        </div>
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-1 hover:shadow-md transition-shadow">
          <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{{ t('dashboard.admin.vehiclesTitle') }}</span>
          <div class="text-3xl font-black text-surface-900 dark:text-surface-0 font-mono">{{ adminVehiclesCount }}</div>
          <span class="text-xs text-surface-500 dark:text-surface-400">Vehículos en catálogo</span>
        </div>
        <div class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs space-y-1 hover:shadow-md transition-shadow">
          <span class="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Ingresos Recurrentes (MRR)</span>
          <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{{ adminMrrUsd }}</div>
          <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Planes B2B activos</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '@/iam/application/iam.store'
import { useBillingStore } from '@/billing/application/billing.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { useScoringStore } from '@/scoring/application/scoring.store'
import { useFinancingStore } from '@/financing/application/financing.store'
import { usePartnersStore } from '@/partners/application/partners.store'
import { useAnalyticsStore } from '@/analytics/application/analytics.store'

const { t } = useI18n()
const iamStore = useIamStore()
const billingStore = useBillingStore()
const catalogStore = useCatalogStore()
const scoringStore = useScoringStore()
const financingStore = useFinancingStore()
const partnersStore = usePartnersStore()
const analyticsStore = useAnalyticsStore()

const isDealer = computed(() => iamStore.roles.includes('ROLE_DEALER'))
const isBank = computed(() => iamStore.roles.includes('ROLE_FINANCIAL_INSTITUTION'))
const isAdmin = computed(() => iamStore.roles.includes('ROLE_ADMIN'))

// Dealer Metrics directly from real analytics store (GET /api/v1/analytics/dealer)
const dealerLeadsCount = computed(() => analyticsStore.dealerAnalytics?.crm.totalLeads ?? billingStore.dealerMetrics?.totalLeadsGenerated ?? 0)
const dealerConversionRate = computed(() => analyticsStore.dealerAnalytics?.crm.conversionRate ?? billingStore.dealerMetrics?.conversionRate ?? 0)
const dealerViewsCount = computed(() => billingStore.dealerMetrics?.totalVehicleViews ?? 0)
const dealerListingsCount = computed(() => analyticsStore.dealerAnalytics?.inventory.totalVehicles ?? catalogStore.vehicles.length)
const dealerRoiValue = computed(() => billingStore.dealerMetrics?.membershipRoi || '0.0x')

// Dealer Funnel Stages
const funnelNew = computed(() => analyticsStore.dealerAnalytics?.crm.newLeads ?? 12)
const funnelContacted = computed(() => analyticsStore.dealerAnalytics?.crm.contactedLeads ?? 10)
const funnelQualified = computed(() => analyticsStore.dealerAnalytics?.crm.qualifiedLeads ?? 8)
const funnelClosedWon = computed(() => analyticsStore.dealerAnalytics?.crm.closedWonLeads ?? 3)

const funnelPercentage = (val: number) => {
  const total = dealerLeadsCount.value || 1
  return `${Math.min(100, Math.max(10, Math.round((val / total) * 100)))}%`
}

// Buyer Metrics from real stores
const buyerScore = computed(() => scoringStore.currentScore ? `${scoringStore.currentScore.score} pts` : 'Sin evaluar')
const buyerScoreLevel = computed(() => scoringStore.currentScore?.riskTierLabel || 'Sin registro')
const buyerCapacity = computed(() => scoringStore.currentScore ? scoringStore.currentScore.formattedMaxLoan : 'Pendiente')
const buyerSimulationsCount = computed(() => financingStore.simulations.length)
const buyerApplicationsStatus = computed(() => `${financingStore.creditApplications.length} activas`)

// Bank Analytics Metrics (GET /api/v1/analytics/financial-institution)
const bankEntityName = computed(() => analyticsStore.financialInstitutionAnalytics?.financialEntityName || 'Portal de Entidad Financiera')
const bankReceivedCount = computed(() => analyticsStore.financialInstitutionAnalytics?.totalApplicationsReceived ?? financingStore.simulations.length)
const bankUnderReviewCount = computed(() => analyticsStore.financialInstitutionAnalytics?.underReviewApplications ?? 0)
const bankApprovedCount = computed(() => analyticsStore.financialInstitutionAnalytics?.approvedApplications ?? 0)
const bankDisbursedCount = computed(() => analyticsStore.financialInstitutionAnalytics?.disbursedApplications ?? 0)
const bankApprovalRate = computed(() => analyticsStore.financialInstitutionAnalytics?.formattedApprovalRate ?? '0.0%')
const bankAvgRate = computed(() => analyticsStore.financialInstitutionAnalytics ? analyticsStore.financialInstitutionAnalytics.formattedAverageTea : '-')
const bankBenchmarksCount = computed(() => analyticsStore.financialInstitutionAnalytics?.activeRateBenchmarksCount ?? 0)
const bankDisbursedVolume = computed(() => analyticsStore.financialInstitutionAnalytics?.formattedDisbursedVolumePen ?? 'S/ 0.00')

// Admin Analytics Metrics (GET /api/v1/analytics/admin)
const adminDealersCount = computed(() => analyticsStore.adminAnalytics?.totalDealerships ?? partnersStore.dealerships.length)
const adminActiveDealersCount = computed(() => analyticsStore.adminAnalytics?.activeDealerships ?? 0)
const adminBanksCount = computed(() => analyticsStore.adminAnalytics?.totalFinancialEntities ?? partnersStore.financialEntities.length)
const adminVehiclesCount = computed(() => analyticsStore.adminAnalytics?.totalVehiclesListed ?? catalogStore.vehicles.length)
const adminUsersCount = computed(() => analyticsStore.adminAnalytics?.totalRegisteredUsers ?? 0)
const adminSubscriptionsCount = computed(() => analyticsStore.adminAnalytics?.totalActiveSubscriptions ?? 0)
const adminMrrUsd = computed(() => analyticsStore.adminAnalytics?.formattedMrrUsd ?? '$ 0.00')

onMounted(async () => {
  if (!iamStore.isAuthenticated) {
    await catalogStore.fetchVehicles()
    return
  }

  if (isDealer.value) {
    await Promise.all([
      analyticsStore.fetchDealerAnalytics(),
      billingStore.fetchBillingData(),
      catalogStore.fetchVehicles()
    ])
  } else if (isBank.value) {
    await Promise.all([
      analyticsStore.fetchFinancialInstitutionAnalytics(),
      partnersStore.fetchFinancialEntities(),
      financingStore.fetchSimulations()
    ])
  } else if (isAdmin.value) {
    await Promise.all([
      analyticsStore.fetchAdminAnalytics(),
      partnersStore.fetchDealerships(),
      partnersStore.fetchFinancialEntities(),
      catalogStore.fetchVehicles()
    ])
  } else {
    await Promise.all([
      scoringStore.fetchCreditScores(),
      financingStore.fetchSimulations(),
      catalogStore.fetchVehicles()
    ])
  }
})
</script>

<style scoped>
</style>

