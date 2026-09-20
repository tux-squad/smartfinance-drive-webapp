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
        <div class="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ t('dashboard.dealer.kpi.leadsTitle') }}</span>
            <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <i class="pi pi-users text-lg"></i>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-gray-950">{{ dealerLeadsCount }}</div>
            <p class="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <i class="pi pi-arrow-up-right text-[10px]"></i>
              <span>{{ t('dashboard.dealer.kpi.leadsGrowth') }}</span>
              <span class="text-gray-400 font-normal">{{ t('dashboard.dealer.kpi.leadsVs') }}</span>
            </p>
          </div>
          <div class="text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            {{ t('dashboard.dealer.kpi.leadsDesc') }}
          </div>
        </div>

        <!-- Card 2: Conversion Rate -->
        <div class="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ t('dashboard.dealer.kpi.conversionTitle') }}</span>
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <i class="pi pi-chart-line text-lg"></i>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-gray-950">{{ dealerConversionRate }}%</div>
            <p class="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <i class="pi pi-check text-[10px]"></i>
              <span>{{ t('dashboard.dealer.kpi.conversionSub') }}</span>
            </p>
          </div>
          <div class="text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            {{ t('dashboard.dealer.kpi.conversionDesc') }}
          </div>
        </div>

        <!-- Card 3: Vehicle Views -->
        <div class="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ t('dashboard.dealer.kpi.viewsTitle') }}</span>
            <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <i class="pi pi-eye text-lg"></i>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-gray-950">{{ dealerViewsCount.toLocaleString() }}</div>
            <p class="text-xs text-purple-600 font-semibold flex items-center gap-1 mt-1">
              <i class="pi pi-car text-[10px]"></i>
              <span>{{ t('dashboard.dealer.kpi.viewsSub') }}</span>
            </p>
          </div>
          <div class="text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            {{ t('dashboard.dealer.kpi.viewsDesc') }}
          </div>
        </div>

        <!-- Card 4: Active Listings -->
        <div class="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ t('dashboard.dealer.kpi.listingsTitle') }}</span>
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <i class="pi pi-car text-lg"></i>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-gray-950">{{ dealerListingsCount }} {{ t('dashboard.dealer.kpi.listingsUnits') }}</div>
            <p class="text-xs text-gray-600 font-medium mt-1">
              <span class="font-bold text-emerald-600">{{ t('dashboard.dealer.kpi.listingsAvailable') }}</span> · {{ t('dashboard.dealer.kpi.listingsReserved') }} · {{ t('dashboard.dealer.kpi.listingsSold') }}
            </p>
          </div>
          <div class="text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            {{ t('dashboard.dealer.kpi.listingsLimit') }}
          </div>
        </div>

        <!-- Card 5: Return on Investment -->
        <div class="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ t('dashboard.dealer.kpi.roiTitle') }}</span>
            <div class="w-10 h-10 rounded-2xl bg-teal-50 text-[#00a887] flex items-center justify-center font-bold">
              <i class="pi pi-dollar text-lg"></i>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-[#00a887]">{{ dealerRoiValue }} ROI</div>
            <p class="text-xs text-[#00a887] font-semibold flex items-center gap-1 mt-1">
              <i class="pi pi-verified text-[10px]"></i>
              <span>{{ t('dashboard.dealer.kpi.roiBadge') }}</span>
            </p>
          </div>
          <div class="text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            {{ t('dashboard.dealer.kpi.roiDesc') }}
          </div>
        </div>

        <!-- Card 6: Financed Volume -->
        <div class="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ t('dashboard.dealer.kpi.volumeTitle') }}</span>
            <div class="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <i class="pi pi-credit-card text-lg"></i>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-gray-950">$ 284,500 USD</div>
            <p class="text-xs text-sky-600 font-semibold flex items-center gap-1 mt-1">
              <i class="pi pi-check-circle text-[10px]"></i>
              <span>{{ t('dashboard.dealer.kpi.volumeSub') }}</span>
            </p>
          </div>
          <div class="text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            {{ t('dashboard.dealer.kpi.volumeDesc') }}
          </div>
        </div>
      </div>

      <!-- Funnel & Inventory Breakdown Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left: Sales Funnel (7 cols) -->
        <div class="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
          <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 class="text-base font-bold text-gray-950">{{ t('dashboard.dealer.funnel.title') }}</h2>
              <p class="text-xs text-gray-500">{{ t('dashboard.dealer.funnel.subtitle') }}</p>
            </div>
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800">
              {{ t('dashboard.dealer.funnel.badge') }}
            </span>
          </div>

          <div class="space-y-4">
            <!-- Stage 1 -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-gray-800">{{ t('dashboard.dealer.funnel.stage1') }}</span>
                <span class="text-blue-900 font-black">{{ t('dashboard.dealer.funnel.stage1Value') }}</span>
              </div>
              <div class="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div class="h-full bg-blue-600 rounded-full w-full"></div>
              </div>
            </div>

            <!-- Stage 2 -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-gray-800">{{ t('dashboard.dealer.funnel.stage2') }}</span>
                <span class="text-blue-900 font-black">{{ t('dashboard.dealer.funnel.stage2Value') }}</span>
              </div>
              <div class="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div class="h-full bg-sky-500 rounded-full w-[62%]"></div>
              </div>
            </div>

            <!-- Stage 3 -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-gray-800">{{ t('dashboard.dealer.funnel.stage3') }}</span>
                <span class="text-blue-900 font-black">{{ t('dashboard.dealer.funnel.stage3Value') }}</span>
              </div>
              <div class="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div class="h-full bg-amber-500 rounded-full w-[35%]"></div>
              </div>
            </div>

            <!-- Stage 4 -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-gray-800">{{ t('dashboard.dealer.funnel.stage4') }}</span>
                <span class="text-emerald-700 font-black">{{ t('dashboard.dealer.funnel.stage4Value') }}</span>
              </div>
              <div class="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div class="h-full bg-[#00a887] rounded-full w-[18%]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Top Vehicles Consulted (5 cols) -->
        <div class="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
          <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 class="text-base font-bold text-gray-950">{{ t('dashboard.dealer.topVehicles.title') }}</h2>
              <p class="text-xs text-gray-500">{{ t('dashboard.dealer.topVehicles.subtitle') }}</p>
            </div>
            <router-link to="/dealer/inventory" class="text-xs font-bold text-blue-600 hover:text-blue-800">
              {{ t('dashboard.dealer.topVehicles.viewAll') }}
            </router-link>
          </div>

          <div class="space-y-4 divide-y divide-gray-100">
            <div class="flex items-center gap-4 pt-3 first:pt-0">
              <div class="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                <i class="pi pi-car text-xl text-blue-900"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xs font-bold text-gray-900 truncate">Toyota Corolla Cross (2023)</h3>
                <p class="text-[11px] text-gray-500 font-medium">$ 26,900 USD · 540 vistas</p>
              </div>
              <span class="text-xs font-extrabold text-emerald-600 shrink-0">14 leads</span>
            </div>

            <div class="flex items-center gap-4 pt-3">
              <div class="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                <i class="pi pi-car text-xl text-blue-900"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xs font-bold text-gray-900 truncate">Honda CR-V (2024)</h3>
                <p class="text-[11px] text-gray-500 font-medium">$ 34,500 USD · 410 vistas</p>
              </div>
              <span class="text-xs font-extrabold text-emerald-600 shrink-0">9 leads</span>
            </div>

            <div class="flex items-center gap-4 pt-3">
              <div class="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                <i class="pi pi-car text-xl text-blue-900"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xs font-bold text-gray-900 truncate">Mazda CX-5 (2023)</h3>
                <p class="text-[11px] text-gray-500 font-medium">$ 29,800 USD · 320 vistas</p>
              </div>
              <span class="text-xs font-extrabold text-emerald-600 shrink-0">8 leads</span>
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
      <div class="bg-gradient-to-r from-blue-900 via-sky-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div class="max-w-3xl space-y-4">
          <span class="inline-block px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-semibold tracking-wider rounded-full border border-sky-400/30">
            {{ t('home.tag') }}
          </span>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">
            {{ t('home.welcomeTitle') }}
          </h1>
          <p class="text-gray-200 text-sm md:text-base leading-relaxed">
            {{ t('home.welcomeDescription') }}
          </p>
        </div>
      </div>

      <!-- Buyer Financial KPIs Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-gray-500">
            <span>{{ t('dashboard.buyer.scoreTitle') }}</span>
            <i class="pi pi-shield text-indigo-600"></i>
          </div>
          <div class="text-2xl font-extrabold text-gray-950">745 pts</div>
          <span class="inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            {{ t('dashboard.buyer.scoreLevel') }}
          </span>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-gray-500">
            <span>{{ t('dashboard.buyer.capacityTitle') }}</span>
            <i class="pi pi-dollar text-emerald-600"></i>
          </div>
          <div class="text-2xl font-extrabold text-gray-950">$ 35,000 USD</div>
          <span class="inline-block text-[11px] font-medium text-gray-500">
            {{ t('dashboard.buyer.capacitySub') }}
          </span>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-gray-500">
            <span>{{ t('dashboard.buyer.simulationsTitle') }}</span>
            <i class="pi pi-calculator text-blue-600"></i>
          </div>
          <div class="text-2xl font-extrabold text-gray-950">{{ t('dashboard.buyer.simulationsCount') }}</div>
          <router-link to="/simulations" class="inline-block text-[11px] font-bold text-blue-600 hover:underline">
            {{ t('dashboard.buyer.simulationsLink') }}
          </router-link>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-gray-500">
            <span>{{ t('dashboard.buyer.applicationsTitle') }}</span>
            <i class="pi pi-check-circle text-teal-600"></i>
          </div>
          <div class="text-2xl font-extrabold text-gray-950">{{ t('dashboard.buyer.applicationsStatus') }}</div>
          <router-link to="/applications" class="inline-block text-[11px] font-bold text-teal-600 hover:underline">
            {{ t('dashboard.buyer.applicationsLink') }}
          </router-link>
        </div>
      </div>

      <!-- Quick Action Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <div class="w-12 h-12 bg-blue-100 text-blue-900 rounded-xl flex items-center justify-center text-xl">
            <i class="pi pi-car"></i>
          </div>
          <h3 class="font-bold text-gray-900 text-lg">{{ t('home.catalogTitle') }}</h3>
          <p class="text-gray-600 text-sm">{{ t('home.catalogDesc') }}</p>
          <router-link to="/vehicles" class="inline-flex items-center text-sm font-semibold text-blue-900 hover:text-blue-700">
            {{ t('home.catalogBtn') }} <i class="pi pi-arrow-right ml-1.5 text-xs"></i>
          </router-link>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <div class="w-12 h-12 bg-emerald-100 text-emerald-900 rounded-xl flex items-center justify-center text-xl">
            <i class="pi pi-calculator"></i>
          </div>
          <h3 class="font-bold text-gray-900 text-lg">{{ t('home.simulationsTitle') }}</h3>
          <p class="text-gray-600 text-sm">{{ t('home.simulationsDesc') }}</p>
          <router-link to="/simulations/new" class="inline-flex items-center text-sm font-semibold text-emerald-900 hover:text-emerald-700">
            {{ t('home.simulationsBtn') }} <i class="pi pi-arrow-right ml-1.5 text-xs"></i>
          </router-link>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <div class="w-12 h-12 bg-purple-100 text-purple-900 rounded-xl flex items-center justify-center text-xl">
            <i class="pi pi-sparkles"></i>
          </div>
          <h3 class="font-bold text-gray-900 text-lg">{{ t('dashboard.buyer.aiTitle') }}</h3>
          <p class="text-gray-600 text-sm">{{ t('dashboard.buyer.aiDesc') }}</p>
          <router-link to="/consultation" class="inline-flex items-center text-sm font-semibold text-purple-900 hover:text-purple-700">
            {{ t('dashboard.buyer.aiBtn') }} <i class="pi pi-arrow-right ml-1.5 text-xs"></i>
          </router-link>
        </div>
      </div>
    </template>

    <!-- ======================================================== -->
    <!-- 3. FINANCIAL INSTITUTION (ROL BANCO)                     -->
    <!-- ======================================================== -->
    <template v-else-if="isBank">
      <div class="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <div class="space-y-2">
          <span class="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
            {{ t('dashboard.bank.badge') }}
          </span>
          <h1 class="text-3xl font-extrabold">{{ t('dashboard.bank.title') }}</h1>
          <p class="text-emerald-100/80 text-sm">{{ t('dashboard.bank.subtitle') }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span class="text-xs font-bold text-gray-500">{{ t('dashboard.bank.receivedTitle') }}</span>
          <div class="text-3xl font-black text-gray-950">124</div>
          <span class="text-xs text-emerald-600 font-semibold">{{ t('dashboard.bank.receivedGrowth') }}</span>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span class="text-xs font-bold text-gray-500">{{ t('dashboard.bank.approvedTitle') }}</span>
          <div class="text-3xl font-black text-emerald-600">86</div>
          <span class="text-xs text-gray-500 font-medium">{{ t('dashboard.bank.approvalRate') }}</span>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span class="text-xs font-bold text-gray-500">{{ t('dashboard.bank.rateTitle') }}</span>
          <div class="text-3xl font-black text-gray-950">9.85%</div>
          <span class="text-xs text-gray-500 font-medium">{{ t('dashboard.bank.rateSub') }}</span>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span class="text-xs font-bold text-gray-500">{{ t('dashboard.bank.portfolioTitle') }}</span>
          <div class="text-3xl font-black text-blue-900">$ 1.85M</div>
          <span class="text-xs text-blue-600 font-medium">{{ t('dashboard.bank.portfolioSub') }}</span>
        </div>
      </div>
    </template>

    <!-- ======================================================== -->
    <!-- 4. ADMINISTRATOR (ROL ADMIN)                             -->
    <!-- ======================================================== -->
    <template v-else>
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-8 text-white shadow-xl space-y-2">
        <span class="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-400/30">
          {{ t('dashboard.admin.badge') }}
        </span>
        <h1 class="text-3xl font-extrabold">{{ t('dashboard.admin.title') }}</h1>
        <p class="text-gray-300 text-sm">{{ t('dashboard.admin.subtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span class="text-xs font-bold text-gray-500">{{ t('dashboard.admin.dealersTitle') }}</span>
          <div class="text-3xl font-black text-gray-950">28</div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span class="text-xs font-bold text-gray-500">{{ t('dashboard.admin.banksTitle') }}</span>
          <div class="text-3xl font-black text-gray-950">6</div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span class="text-xs font-bold text-gray-500">{{ t('dashboard.admin.vehiclesTitle') }}</span>
          <div class="text-3xl font-black text-gray-950">142</div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span class="text-xs font-bold text-gray-500">{{ t('dashboard.admin.usersTitle') }}</span>
          <div class="text-3xl font-black text-gray-950">1,840</div>
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

const { t } = useI18n()
const iamStore = useIamStore()
const billingStore = useBillingStore()
const catalogStore = useCatalogStore()

const isDealer = computed(() => iamStore.roles.includes('ROLE_DEALER'))
const isBank = computed(() => iamStore.roles.includes('ROLE_FINANCIAL_INSTITUTION'))
const isAdmin = computed(() => iamStore.roles.includes('ROLE_ADMIN'))

// Dealer Metrics with hardcoded fallback if API returns empty
const dealerLeadsCount = computed(() => billingStore.dealerMetrics?.totalLeadsGenerated || 45)
const dealerConversionRate = computed(() => billingStore.dealerMetrics?.conversionRate || 18.2)
const dealerViewsCount = computed(() => billingStore.dealerMetrics?.totalVehicleViews || 1850)
const dealerListingsCount = computed(() => billingStore.dealerMetrics?.activeListingsCount || 12)
const dealerRoiValue = computed(() => billingStore.dealerMetrics?.membershipRoi || '5.4x')

onMounted(async () => {
  if (isDealer.value) {
    await Promise.all([
      billingStore.fetchBillingData(),
      catalogStore.fetchVehicles()
    ])
  }
})
</script>

<style scoped>
</style>

