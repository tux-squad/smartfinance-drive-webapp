<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="rounded-3xl bg-gradient-to-r from-[#09152e] via-blue-950 to-indigo-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md mb-3 border border-blue-500/30">
          <i :class="isBankOnly ? 'pi pi-building-columns' : 'pi pi-file-check'"></i>
          {{ isBankOnly ? 'Bandeja de Dictamen y Evaluación Bancaria' : 'Mis Trámites y Evaluaciones' }}
        </div>
        <h1 class="text-3xl font-black tracking-tight sm:text-4xl text-white">
          {{ isBankOnly ? 'Evaluación de Créditos Vehiculares' : 'Reporte de Solicitudes y Citas' }}
        </h1>
        <p class="mt-2 text-sm text-blue-100/80 leading-relaxed">
          {{ isBankOnly
            ? 'Bandeja de entrada oficial para evaluar, dictaminar y gestionar solicitudes de crédito automotriz asignadas a tu entidad.'
            : 'Revisa el estado de tus solicitudes de crédito vehicular y gestiona tus pruebas de manejo programadas.'
          }}
        </p>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- VIEW A: BANK FINANCIAL INSTITUTION EVALUATION VIEW (ROLE_FINANCIAL_INSTITUTION) -->
    <!-- ========================================================================= -->
    <div v-if="isBankOnly" class="space-y-8">
      <!-- Bank Analytics Cards (4.10) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span class="text-xs text-slate-500 font-medium block">Total Solicitudes Recibidas</span>
          <span class="text-2xl font-black text-slate-900 dark:text-white">{{ bankAnalytics?.totalApplicationsReceived ?? bankApplications.length }}</span>
          <span class="text-[11px] text-blue-600 dark:text-blue-400 font-bold block">En tiempo real</span>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span class="text-xs text-slate-500 font-medium block">En Evaluación / Pendientes</span>
          <span class="text-2xl font-black text-amber-600 dark:text-amber-400">
            {{ bankUnderReviewCount }}
          </span>
          <span class="text-[11px] text-slate-400 font-medium block">Requieren dictamen</span>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span class="text-xs text-slate-500 font-medium block">Pre-Aprobadas / Desembolsadas</span>
          <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {{ bankApprovedCount }}
          </span>
          <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
            {{ bankAnalytics?.formattedApprovalRate ?? 'Aprobación activa' }}
          </span>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span class="text-xs text-slate-500 font-medium block">Volumen Colocado</span>
          <span class="text-2xl font-black text-slate-900 dark:text-white">{{ bankAnalytics?.formattedDisbursedVolumePen ?? 'S/ 0.00' }}</span>
          <span class="text-[11px] text-slate-400 font-medium block">Tasa Promedio: {{ bankAnalytics?.formattedAverageTea ?? '14.50%' }}</span>
        </div>
      </div>

      <!-- Bank Applications Inbox -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="pi pi-inbox text-blue-600"></i>
              Bandeja de Solicitudes Recibidas
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              Lista de expedientes crediticios enviados por compradores para evaluación y resolución.
            </p>
          </div>

          <!-- Status Filter Badges -->
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="statusTab in bankStatusTabs"
              :key="statusTab.value"
              type="button"
              @click="bankSelectedStatus = statusTab.value"
              class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              :class="bankSelectedStatus === statusTab.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'"
            >
              {{ statusTab.label }}
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div class="relative w-full sm:w-80">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <i class="pi pi-search text-xs"></i>
            </span>
            <input
              v-model="bankSearchFilter"
              type="text"
              placeholder="Buscar por cliente, vehículo o expediente..."
              class="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div class="text-xs text-slate-400 font-medium">
            Mostrando <span class="font-bold text-slate-700 dark:text-slate-300">{{ filteredBankApplications.length }}</span> expediente(s)
          </div>
        </div>

        <!-- Feedback Messages -->
        <Message v-if="dialogSuccess" severity="success" class="!rounded-2xl !text-xs" @close="dialogSuccess = null">
          {{ dialogSuccess }}
        </Message>
        <Message v-if="searchError" severity="error" class="!rounded-2xl !text-xs" @close="searchError = null">
          {{ searchError }}
        </Message>

        <!-- Empty State -->
        <div
          v-if="filteredBankApplications.length === 0"
          class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-12 text-center"
        >
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 mb-4">
            <i class="pi pi-inbox text-2xl"></i>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            No hay solicitudes en esta categoría
          </h3>
          <p class="mt-1 text-xs text-slate-500 max-w-md">
            Las nuevas solicitudes de financiamiento automotriz que los compradores elijan con tu entidad aparecerán aquí automáticamente.
          </p>
        </div>

        <!-- Bank Applications Table -->
        <div v-else class="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <th scope="col" class="py-3.5 px-5">Expediente</th>
                  <th scope="col" class="py-3.5 px-5">Solicitante</th>
                  <th scope="col" class="py-3.5 px-5">Vehículo</th>
                  <th scope="col" class="py-3.5 px-5">Monto Solicitado</th>
                  <th scope="col" class="py-3.5 px-5">Fecha</th>
                  <th scope="col" class="py-3.5 px-5 text-center">Estado</th>
                  <th scope="col" class="py-3.5 px-5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                <tr
                  v-for="app in filteredBankApplications"
                  :key="app.id"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <!-- Expediente -->
                  <td class="py-4 px-5">
                    <div class="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      #{{ app.id.substring(0, 8) }}
                    </div>
                  </td>

                  <!-- Solicitante -->
                  <td class="py-4 px-5">
                    <div>
                      <span class="font-bold text-slate-900 dark:text-white block text-xs">
                        {{ app.applicantName }}
                      </span>
                      <span class="text-[11px] text-slate-500 block">
                        Ingreso: {{ app.formattedMonthlyIncome }} ({{ app.employmentStatus || 'Dependiente' }})
                      </span>
                    </div>
                  </td>

                  <!-- Vehículo -->
                  <td class="py-4 px-5">
                    <span class="font-semibold text-slate-800 dark:text-slate-200 text-xs block">
                      {{ app.vehicleName }}
                    </span>
                  </td>

                  <!-- Monto Solicitado -->
                  <td class="py-4 px-5 text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {{ app.formattedRequestedAmount }}
                  </td>

                  <!-- Fecha -->
                  <td class="py-4 px-5 text-xs text-slate-500 font-medium">
                    {{ app.formattedDate }}
                  </td>

                  <!-- Estado -->
                  <td class="py-4 px-5 text-center">
                    <span
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border"
                      :class="getStatusBadgeClass(app.status)"
                    >
                      <span class="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                      {{ app.statusLabel }}
                    </span>
                  </td>

                  <!-- Acciones -->
                  <td class="py-4 px-5 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <Button
                        icon="pi pi-check-square"
                        label="Dictaminar"
                        size="small"
                        class="!rounded-xl !text-xs font-bold !bg-blue-600 !border-blue-600 text-white px-3 py-1.5 shadow-sm"
                        @click="openDictamenModal(app)"
                      />
                      <Button
                        icon="pi pi-eye"
                        size="small"
                        outlined
                        severity="secondary"
                        class="!rounded-xl !text-xs"
                        @click="handleViewDetail(app.id)"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- VIEW B: BUYER & ADMIN VIEW (ROLE_USER & ROLE_ADMIN) WITH TABS -->
    <!-- ========================================================================= -->
    <div v-else class="space-y-6">
      <!-- Tabs Switcher: Solicitudes de Crédito vs Pruebas de Manejo -->
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          @click="activeTab = 'applications'"
          class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all"
          :class="activeTab === 'applications'
            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <i class="pi pi-file-check"></i>
          <span>Solicitudes de Crédito ({{ filteredApplications.length }})</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'test-drives'"
          class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all"
          :class="activeTab === 'test-drives'
            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <i class="pi pi-car"></i>
          <span>Mis Pruebas de Manejo ({{ crmStore.testDrives.length }})</span>
        </button>
      </div>

      <!-- TAB 1: SOLICITUDES DE CRÉDITO -->
      <div v-if="activeTab === 'applications'" class="space-y-6">
        <!-- Search / Filter Bar -->
        <div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div class="relative w-full sm:w-80">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <i class="pi pi-search text-xs"></i>
            </span>
            <input
              v-model="searchFilter"
              type="text"
              placeholder="Buscar por vehículo, entidad o ID..."
              class="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto">
            <select
              v-model="statusFilter"
              class="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm cursor-pointer"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Evaluación">En Evaluación</option>
              <option value="Pre-Aprobado">Pre-Aprobado</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
              <option value="Desembolsado">Desembolsado</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="financingStore.isLoading && !selectedApp" class="flex flex-col items-center justify-center py-16 gap-3">
          <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
          <p class="text-sm text-slate-500 font-medium">Cargando solicitudes de financiamiento...</p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredApplications.length === 0"
          class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center"
        >
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4">
            <i class="pi pi-file text-2xl"></i>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            No tienes solicitudes registradas
          </h3>
          <p class="mt-1 text-xs text-slate-500 max-w-md">
            Aún no has enviado ninguna solicitud o simulación de crédito vehicular. Puedes comenzar seleccionando un vehículo en el catálogo.
          </p>
          <div class="mt-5">
            <router-link
              to="/vehicles"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 text-white font-semibold text-xs shadow-md transition-all hover:opacity-90"
            >
              <i class="pi pi-car text-xs"></i>
              <span>Explorar Vehículos</span>
            </router-link>
          </div>
        </div>

        <!-- Applications Table from Backend API -->
        <div v-else class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <th scope="col" class="py-4 px-6">Vehículo</th>
                  <th scope="col" class="py-4 px-6">Entidad Financiera</th>
                  <th scope="col" class="py-4 px-6">Monto Solicitado</th>
                  <th scope="col" class="py-4 px-6">Fecha</th>
                  <th scope="col" class="py-4 px-6 text-center">Estado de Crédito</th>
                  <th scope="col" class="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                <tr
                  v-for="item in filteredApplications"
                  :key="item.id"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <!-- Vehículo -->
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                        <i class="pi pi-car text-sm"></i>
                      </div>
                      <div>
                        <span class="font-bold text-slate-900 dark:text-white block leading-tight">{{ item.vehicle }}</span>
                        <span class="text-xs text-slate-400 font-mono">Ref: #{{ item.id.substring(0, 8) }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Concesionaria / Entidad -->
                  <td class="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">
                    <div class="flex items-center gap-1.5">
                      <i class="pi pi-building-columns text-xs text-slate-400"></i>
                      <span>{{ item.concessionaire }}</span>
                    </div>
                  </td>

                  <!-- Monto -->
                  <td class="py-4 px-6 text-xs font-semibold text-slate-900 dark:text-white">
                    {{ item.formattedAmount }}
                  </td>

                  <!-- Fecha -->
                  <td class="py-4 px-6 text-xs text-slate-500 font-medium">
                    {{ item.date }}
                  </td>

                  <!-- Estado de Crédito -->
                  <td class="py-4 px-6 text-center">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide border"
                      :class="getStatusBadgeClass(item.rawStatus)"
                    >
                      <span class="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                      {{ item.status }}
                    </span>
                  </td>

                  <!-- Acciones -->
                  <td class="py-4 px-6 text-right">
                    <Button
                      icon="pi pi-eye"
                      label="Detalle"
                      size="small"
                      outlined
                      severity="secondary"
                      class="!rounded-xl !text-xs"
                      @click="handleViewDetail(item.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 2: MIS PRUEBAS DE MANEJO -->
      <div v-else-if="activeTab === 'test-drives'" class="space-y-6">
        <!-- Loading -->
        <div v-if="crmStore.isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
          <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
          <p class="text-sm text-slate-500 font-medium">Cargando pruebas de manejo...</p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="crmStore.testDrives.length === 0"
          class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center"
        >
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-4">
            <i class="pi pi-calendar text-2xl"></i>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            No tienes citas de Test Drive agendadas
          </h3>
          <p class="mt-1 text-xs text-slate-500 max-w-md">
            Puedes agendar una prueba de manejo directamente desde la ficha de cualquier vehículo en el catálogo.
          </p>
          <div class="mt-5">
            <router-link
              to="/vehicles"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-md transition-all"
            >
              <i class="pi pi-car text-xs"></i>
              <span>Ver Catálogo de Vehículos</span>
            </router-link>
          </div>
        </div>

        <!-- Test Drives List -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="td in crmStore.testDrives"
            :key="td.id"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-blue-500/40 transition-all"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <i class="pi pi-car text-xl"></i>
                </div>
                <div>
                  <h4 class="text-sm font-black text-slate-900 dark:text-white">Prueba de Manejo Programada</h4>
                  <p class="text-xs text-slate-500 font-mono">Ref: #{{ td.id.substring(0, 8) }}</p>
                </div>
              </div>

              <span
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                :class="td.status === 'SCHEDULED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-700 border-slate-200'"
              >
                {{ td.status }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
              <div>
                <span class="text-slate-400 block text-[11px]">Fecha y Hora:</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ td.formattedDateTime }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Vehículo ID:</span>
                <span class="font-mono text-slate-700 dark:text-slate-300 truncate block">{{ td.vehicleId?.substring(0, 8) }}...</span>
              </div>
            </div>

            <p v-if="td.notes" class="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-xl">
              <span class="font-bold text-slate-700 dark:text-slate-300">Notas: </span>{{ td.notes }}
            </p>

            <div class="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                v-if="td.status !== 'CANCELLED' && td.status !== 'COMPLETED'"
                label="Cancelar Cita"
                icon="pi pi-times"
                size="small"
                severity="danger"
                text
                class="!rounded-xl !text-xs font-bold"
                @click="handleCancelTestDrive(td.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dictamen Bancario Dialog (Modal for Financial Institution) -->
    <Dialog
      v-model:visible="showDictamenDialog"
      modal
      header="Dictamen y Evaluación de Crédito Vehicular"
      :style="{ width: '90vw', maxWidth: '600px' }"
      class="!rounded-3xl"
    >
      <div v-if="dictamenApp" class="space-y-6 pt-2">
        <!-- Application Summary Card -->
        <div class="rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-4 space-y-3 text-xs">
          <div class="flex items-center justify-between border-b border-blue-100/80 dark:border-blue-900/40 pb-2">
            <span class="font-bold text-slate-700 dark:text-slate-300">Expediente #{{ dictamenApp.id.substring(0, 8) }}</span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full font-bold border" :class="getStatusBadgeClass(dictamenApp.status)">
              {{ dictamenApp.statusLabel }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <span class="text-slate-400 block text-[11px]">Solicitante:</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">{{ dictamenApp.applicantName }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Monto Solicitado:</span>
              <span class="font-black text-emerald-600 dark:text-emerald-400">{{ dictamenApp.formattedRequestedAmount }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Vehículo:</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ dictamenApp.vehicleName }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Ingreso Declarado:</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ dictamenApp.formattedMonthlyIncome }}</span>
            </div>
          </div>
        </div>

        <!-- Evaluation Form -->
        <form @submit.prevent="submitDictamen" class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Resolución / Estado Crediticio</label>
            <select
              v-model="evalStatus"
              class="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="PRE_APPROVED">PRE_APPROVED (Pre-Aprobado)</option>
              <option value="IN_REVIEW">IN_REVIEW (En Evaluación de Riesgos)</option>
              <option value="DISBURSED">DISBURSED (Crédito Desembolsado)</option>
              <option value="REJECTED">REJECTED (Rechazado)</option>
              <option value="PENDING">PENDING (Pendiente de Documentos)</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Observaciones del Analista Bancario</label>
            <textarea
              v-model="evalNotes"
              rows="3"
              placeholder="Ejemplo: Cumple con el ratio cuota-ingreso. Aprobado para desembolso inmediato."
              class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              label="Cancelar"
              severity="secondary"
              text
              class="!rounded-xl !text-xs font-bold"
              @click="showDictamenDialog = false"
            />
            <Button
              type="submit"
              label="Guardar Dictamen Bancario"
              icon="pi pi-check"
              :loading="isUpdatingStatus"
              class="!rounded-2xl !text-xs font-bold !bg-emerald-600 !border-emerald-600 text-white px-6 py-2.5 shadow-md shadow-emerald-600/20"
            />
          </div>
        </form>
      </div>
    </Dialog>

    <!-- Application Detail Dialog (For Buyer / Admin view) -->
    <Dialog
      v-model:visible="showDetailDialog"
      modal
      :header="`Solicitud de Crédito #${selectedApp?.id.substring(0, 8)}`"
      :style="{ width: '90vw', maxWidth: '650px' }"
      class="!rounded-3xl"
    >
      <div v-if="selectedApp" class="space-y-6 pt-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-xs">
          <div>
            <span class="text-slate-500 font-medium block">Vehículo Solicitado</span>
            <span class="font-bold text-slate-900 dark:text-white text-sm">{{ selectedAppVehicle }}</span>
          </div>

          <div>
            <span class="text-slate-500 font-medium block">Entidad Financiera Aliada</span>
            <span class="font-bold text-slate-900 dark:text-white text-sm">{{ selectedAppEntity }}</span>
          </div>

          <div>
            <span class="text-slate-500 font-medium block">Monto Solicitado</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{{ selectedApp.formattedRequestedAmount }}</span>
          </div>

          <div>
            <span class="text-slate-500 font-medium block">Ingreso Mensual Declarado</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedApp.formattedMonthlyIncome }}</span>
          </div>

          <div>
            <span class="text-slate-500 font-medium block">Situación Laboral</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedApp.employmentStatus || 'No especificada' }}</span>
          </div>

          <div>
            <span class="text-slate-500 font-medium block">Estado Actual</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border mt-0.5" :class="getStatusBadgeClass(selectedApp.status)">
              {{ selectedApp.statusLabel }}
            </span>
          </div>
        </div>

        <div v-if="selectedApp.notes" class="rounded-2xl bg-slate-100 dark:bg-slate-800/40 p-4 text-xs">
          <span class="font-bold text-slate-700 dark:text-slate-300 block mb-1">Notas del Solicitante:</span>
          <p class="text-slate-600 dark:text-slate-400">{{ selectedApp.notes }}</p>
        </div>

        <div class="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button
            label="Cerrar"
            severity="secondary"
            text
            class="!rounded-xl !text-xs font-bold"
            @click="showDetailDialog = false"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useFinancingStore } from '@/financing/application/financing.store'
import { usePartnersStore } from '@/partners/application/partners.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { useIamStore } from '@/iam/application/iam.store'
import { useCrmStore } from '@/financing/application/crm.store'
import { useAnalyticsStore } from '@/analytics/application/analytics.store'
import type { CreditApplication } from '@/financing/domain/credit-application.entity'

const financingStore = useFinancingStore()
const partnersStore = usePartnersStore()
const catalogStore = useCatalogStore()
const iamStore = useIamStore()
const crmStore = useCrmStore()
const analyticsStore = useAnalyticsStore()

const activeTab = ref<'applications' | 'test-drives'>('applications')
const searchFilter = ref<string>('')
const statusFilter = ref<string>('')

// Bank state
const isBankOnly = computed(() => iamStore.roles.includes('ROLE_FINANCIAL_INSTITUTION') && !iamStore.roles.includes('ROLE_ADMIN'))
const bankAnalytics = computed(() => analyticsStore.financialInstitutionAnalytics)
const bankSearchFilter = ref('')
const bankSelectedStatus = ref('ALL')

const bankStatusTabs = [
  { label: 'Todas', value: 'ALL' },
  { label: 'Pendientes', value: 'PENDING' },
  { label: 'En Evaluación', value: 'IN_REVIEW' },
  { label: 'Pre-Aprobadas', value: 'PRE_APPROVED' },
  { label: 'Desembolsadas', value: 'DISBURSED' },
  { label: 'Rechazadas', value: 'REJECTED' }
]

// Dictamen modal state
const showDictamenDialog = ref(false)
const dictamenApp = ref<any | null>(null)
const evalStatus = ref<'PENDING' | 'IN_REVIEW' | 'PRE_APPROVED' | 'REJECTED' | 'DISBURSED'>('PRE_APPROVED')
const evalNotes = ref('')
const isUpdatingStatus = ref(false)
const dialogSuccess = ref<string | null>(null)
const searchError = ref<string | null>(null)

// Detail modal state
const showDetailDialog = ref(false)
const selectedApp = ref<CreditApplication | null>(null)

interface ApplicationRow {
  id: string
  vehicle: string
  concessionaire: string
  formattedAmount: string
  date: string
  status: string
  rawStatus: string
}

onMounted(async () => {
  await Promise.allSettled([
    financingStore.fetchMyCreditApplications(),
    partnersStore.fetchFinancialEntities(),
    catalogStore.fetchVehicles()
  ])

  if (isBankOnly.value) {
    await analyticsStore.fetchFinancialInstitutionAnalytics()
  } else {
    await crmStore.fetchMyTestDrives()
  }
})

// Bank applications mapping
const bankApplications = computed(() => {
  const storeApps = financingStore.creditApplications

  return storeApps.map(app => {
    const vehicle = catalogStore.vehicles.find(v => v.id === app.vehicleId)
    return {
      id: app.id,
      applicantName: `Cliente #${app.userId}`,
      vehicleName: vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.manufactureYear})` : (app.vehicleTitle || 'Crédito Vehicular'),
      formattedRequestedAmount: app.formattedRequestedAmount,
      formattedMonthlyIncome: app.formattedMonthlyIncome,
      employmentStatus: app.employmentStatus || 'Dependiente',
      formattedDate: app.formattedDate,
      status: app.status,
      statusLabel: app.statusLabel,
      rawApp: app
    }
  })
})

const filteredBankApplications = computed(() => {
  return bankApplications.value.filter(app => {
    const q = bankSearchFilter.value.toLowerCase().trim()
    const matchesSearch = !q ||
      app.applicantName.toLowerCase().includes(q) ||
      app.vehicleName.toLowerCase().includes(q) ||
      app.id.toLowerCase().includes(q)

    const matchesStatus = bankSelectedStatus.value === 'ALL' || app.status === bankSelectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const bankUnderReviewCount = computed(() => {
  return bankApplications.value.filter(a => a.status === 'PENDING' || a.status === 'IN_REVIEW').length
})

const bankApprovedCount = computed(() => {
  return bankApplications.value.filter(a => a.status === 'PRE_APPROVED' || a.status === 'DISBURSED' || a.status === 'APPROVED').length
})

const openDictamenModal = (app: any) => {
  dictamenApp.value = app
  evalStatus.value = ['PENDING', 'IN_REVIEW', 'PRE_APPROVED', 'REJECTED', 'DISBURSED'].includes(app.status)
    ? (app.status as any)
    : 'PRE_APPROVED'
  evalNotes.value = ''
  dialogSuccess.value = null
  showDictamenDialog.value = true
}

const submitDictamen = async () => {
  if (!dictamenApp.value) return
  isUpdatingStatus.value = true
  dialogSuccess.value = null
  searchError.value = null

  try {
    const ok = await financingStore.updateCreditApplicationStatus(dictamenApp.value.id, {
      status: evalStatus.value,
      notes: evalNotes.value
    })

    // Update local state item if in mock/cached list
    dictamenApp.value.status = evalStatus.value
    dictamenApp.value.statusLabel = getStatusLabelText(evalStatus.value)

    dialogSuccess.value = `Dictamen emitido exitosamente: expediente #${dictamenApp.value.id.substring(0, 8)} actualizado a ${evalStatus.value}.`
    showDictamenDialog.value = false

    // Refresh analytics
    await analyticsStore.fetchFinancialInstitutionAnalytics()
  } catch (err: any) {
    searchError.value = err.message || 'Error al emitir dictamen bancario.'
  } finally {
    isUpdatingStatus.value = false
  }
}

const getStatusLabelText = (status: string) => {
  switch (status) {
    case 'PENDING': return 'Pendiente'
    case 'IN_REVIEW': return 'En Evaluación'
    case 'PRE_APPROVED': return 'Pre-Aprobado'
    case 'APPROVED': return 'Aprobado'
    case 'DISBURSED': return 'Desembolsado'
    case 'REJECTED': return 'Rechazado'
    default: return status
  }
}

const handleCancelTestDrive = async (id: string) => {
  await crmStore.cancelTestDrive(id)
}

const applications = computed<ApplicationRow[]>(() => {
  if (financingStore.creditApplications.length > 0) {
    return financingStore.creditApplications.map((app) => {
      const entity = partnersStore.financialEntities.find(e => e.id === app.financialEntityId)
      const vehicle = catalogStore.vehicles.find(v => v.id === app.vehicleId)
      const entityName = entity ? entity.name : (app.financialEntityName || 'Entidad Financiera Aliada')
      const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.manufactureYear})` : (app.vehicleTitle || 'Crédito Vehicular Solicitado')

      return {
        id: app.id,
        vehicle: vehicleName,
        concessionaire: entityName,
        formattedAmount: app.formattedRequestedAmount,
        date: app.formattedDate,
        status: app.statusLabel,
        rawStatus: app.status
      }
    })
  }

  return []
})

const filteredApplications = computed(() => {
  return applications.value.filter(app => {
    const q = searchFilter.value.toLowerCase().trim()
    const matchesQuery = !q ||
      app.vehicle.toLowerCase().includes(q) ||
      app.concessionaire.toLowerCase().includes(q) ||
      app.id.toLowerCase().includes(q)
    const matchesStatus = !statusFilter.value || app.status === statusFilter.value
    return matchesQuery && matchesStatus
  })
})

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'PRE_APPROVED':
    case 'Pre-Aprobado':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/50'
    case 'APPROVED':
    case 'DISBURSED':
    case 'Aprobado':
    case 'Desembolsado':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/50'
    case 'IN_REVIEW':
    case 'En Evaluación':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/50'
    case 'REJECTED':
    case 'Rechazado':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/50'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  }
}

const selectedAppVehicle = computed(() => {
  if (!selectedApp.value) return 'Vehículo'
  const vehicle = catalogStore.vehicles.find(v => v.id === selectedApp.value?.vehicleId)
  return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.manufactureYear})` : (selectedApp.value.vehicleTitle || 'Crédito Vehicular')
})

const selectedAppEntity = computed(() => {
  if (!selectedApp.value) return 'Entidad'
  const entity = partnersStore.financialEntities.find(e => e.id === selectedApp.value?.financialEntityId)
  return entity ? entity.name : (selectedApp.value.financialEntityName || 'Entidad Financiera Aliada')
})

const handleViewDetail = async (id: string) => {
  dialogSuccess.value = null
  const app = financingStore.creditApplications.find(a => a.id === id)
  if (app) {
    selectedApp.value = app
  }
  showDetailDialog.value = true

  await financingStore.fetchCreditApplicationById(id)
  if (financingStore.currentApplication) {
    selectedApp.value = financingStore.currentApplication
  }
}
</script>
