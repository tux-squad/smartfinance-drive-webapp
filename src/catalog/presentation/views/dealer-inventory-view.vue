<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header matching Mockup Screenshot 1 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
      <div class="space-y-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
          {{ t('dealerInventory.title') }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ t('dealerInventory.subtitle') }}
        </p>
      </div>

      <!-- Action Button: + Añadir Vehículo -->
      <div>
        <router-link
          to="/dealer/inventory/new"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-bold text-xs shadow-xs transition-colors"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>{{ t('dealerInventory.addBtn') }}</span>
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingInventory || catalogStore.isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">{{ t('dealerInventory.loading') }}</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="dealerVehicles.length === 0"
      class="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4"
    >
      <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
        <i class="pi pi-car text-2xl"></i>
      </div>
      <h3 class="text-base font-bold text-gray-900">{{ t('dealerInventory.emptyTitle') }}</h3>
      <p class="text-xs text-gray-500">
        {{ t('dealerInventory.emptySubtitle') }}
      </p>
      <div>
        <router-link
          to="/dealer/inventory/new"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eb8f47] text-white font-semibold text-xs transition-colors"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>{{ t('dealerInventory.emptyBtn') }}</span>
        </router-link>
      </div>
    </div>

    <!-- Feedback Notification -->
    <div
      v-if="feedbackMessage"
      class="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-check-circle text-emerald-600"></i>
        <span>{{ feedbackMessage }}</span>
      </div>
      <button type="button" @click="feedbackMessage = null" class="text-emerald-500 hover:text-emerald-800">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <div
      v-if="feedbackError"
      class="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 rounded-2xl text-xs text-rose-800 dark:text-rose-300 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-exclamation-triangle text-rose-600"></i>
        <span>{{ feedbackError }}</span>
      </div>
      <button type="button" @click="feedbackError = null" class="text-rose-500 hover:text-rose-800">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <!-- View Mode Switcher and Actions Header -->
    <div class="flex items-center justify-between gap-4 pt-2">
      <div class="flex items-center gap-1.5 p-1 bg-surface-100 dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700">
        <button
          type="button"
          @click="viewMode = 'cards'"
          class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
          :class="viewMode === 'cards'
            ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-xs'
            : 'text-surface-500 hover:text-surface-900 dark:hover:text-white'"
        >
          <i class="pi pi-th-large text-xs"></i>
          <span>Tarjetas</span>
        </button>
        <button
          type="button"
          @click="viewMode = 'table'"
          class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
          :class="viewMode === 'table'
            ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-xs'
            : 'text-surface-500 hover:text-surface-900 dark:hover:text-white'"
        >
          <i class="pi pi-list text-xs"></i>
          <span>Tabla</span>
        </button>
      </div>

      <span class="text-xs text-surface-500 font-medium">
        {{ dealerVehicles.length }} {{ dealerVehicles.length === 1 ? 'vehículo registrado' : 'vehículos registrados' }}
      </span>
    </div>

    <!-- VIEW 1: CARDS GRID (Predeterminada) -->
    <div v-if="viewMode === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="car in dealerVehicles"
        :key="car.id"
        class="group flex flex-col justify-between overflow-hidden rounded-3xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 shadow-xs hover:shadow-md hover:border-primary/40 dark:hover:border-primary/40 transition-all"
      >
        <!-- Card Cover Image -->
        <div class="relative h-48 w-full overflow-hidden bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
          <img
            :src="car.imagePath || defaultVehicleFallback"
            :alt="car.displayName"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            @error="onCardImageError($event)"
          />
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

          <!-- Top Badges -->
          <div class="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div class="flex gap-1.5">
              <span
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-md backdrop-blur-md border"
                :class="car.condition === 'NEW'
                  ? 'bg-emerald-500/80 text-white border-emerald-400/40'
                  : 'bg-amber-500/80 text-white border-amber-400/40'"
              >
                {{ car.condition === 'NEW' ? 'Nuevo (0 km)' : 'Seminuevo' }}
              </span>
              <span class="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-mono font-medium text-white shadow-md border border-white/10">
                {{ car.manufactureYear }}
              </span>
            </div>

            <!-- Inline Status Dropdown -->
            <select
              :value="car.status || 'ACTIVE'"
              @change="handleStatusChange(car, ($event.target as HTMLSelectElement).value)"
              class="text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-md backdrop-blur-md"
              :class="[
                car.status === 'SOLD'
                  ? 'bg-slate-900/90 text-slate-300 border-slate-700'
                  : car.status === 'RESERVED'
                    ? 'bg-amber-900/90 text-amber-200 border-amber-600'
                    : 'bg-emerald-900/90 text-emerald-200 border-emerald-500'
              ]"
            >
              <option value="ACTIVE">Activo</option>
              <option value="RESERVED">Reservado</option>
              <option value="SOLD">Vendido</option>
            </select>
          </div>

          <!-- Quick Image Upload button on hover -->
          <button
            type="button"
            @click.stop="triggerDirectCardUpload(car.id)"
            :disabled="isUploadingCardImage[car.id]"
            title="Cambiar foto de portada en Cloudinary"
            class="absolute top-12 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/75 hover:bg-black/90 text-white text-[10px] font-bold backdrop-blur-md shadow-lg border border-white/20"
          >
            <i :class="isUploadingCardImage[car.id] ? 'pi pi-spin pi-spinner' : 'pi pi-camera'" class="text-[11px]"></i>
            <span>{{ isUploadingCardImage[car.id] ? 'Subiendo...' : 'Cambiar Foto' }}</span>
          </button>

          <!-- Bottom Price inside Cover -->
          <div class="absolute bottom-3 left-4 right-4 flex items-baseline justify-between text-white">
            <span class="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">Precio de Lista</span>
            <span class="text-2xl font-black font-mono text-emerald-400 drop-shadow-md">
              {{ car.formattedPrice }}
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-base font-bold text-surface-900 dark:text-surface-0 group-hover:text-primary transition-colors truncate">
              {{ car.brand }} {{ car.model }}
            </h3>
            <p class="text-xs text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1.5">
              <i class="pi pi-shield text-emerald-500 text-xs"></i>
              <span>Vehículo verificado en concesionario</span>
            </p>
          </div>

          <!-- Card Actions Row -->
          <div class="grid grid-cols-3 gap-2 pt-3 border-t border-surface-100 dark:border-surface-800">
            <router-link
              :to="`/vehicles/${car.id}`"
              class="inline-flex items-center justify-center gap-1 py-2 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 text-xs font-semibold transition-colors"
            >
              <i class="pi pi-eye text-xs"></i>
              <span>Ficha</span>
            </router-link>

            <button
              type="button"
              @click="openEditDialog(car)"
              class="inline-flex items-center justify-center gap-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors"
            >
              <i class="pi pi-pencil text-xs"></i>
              <span>Editar</span>
            </button>

            <button
              type="button"
              @click="openDeleteDialog(car)"
              class="inline-flex items-center justify-center gap-1 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-colors"
            >
              <i class="pi pi-trash text-xs"></i>
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2: INVENTORY TABLE -->
    <div v-else class="bg-surface-0 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-950 text-xs font-bold text-surface-500 dark:text-surface-400">
              <th scope="col" class="py-4 px-6 w-24">{{ t('dealerInventory.colImage') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('dealerInventory.colVehicle') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('dealerInventory.colCondition') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('dealerInventory.colDays') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('dealerInventory.colPrice') }}</th>
              <th scope="col" class="py-4 px-6">{{ t('dealerInventory.colStatus') }}</th>
              <th scope="col" class="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-800 text-sm">
            <tr
              v-for="(car, idx) in dealerVehicles"
              :key="car.id"
              class="hover:bg-surface-50/60 dark:hover:bg-surface-800/40 transition-colors"
            >
              <!-- Imagen Thumbnail -->
              <td class="py-4 px-6">
                <div class="w-16 h-12 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    :src="car.imagePath || defaultVehicleFallback"
                    :alt="car.displayName"
                    class="w-full h-full object-cover"
                    @error="onCardImageError($event)"
                  />
                </div>
              </td>

              <!-- Vehículo (Marca/Modelo) -->
              <td class="py-4 px-6">
                <div class="font-bold text-surface-900 dark:text-surface-0 leading-tight">
                  {{ car.brand }} {{ car.model }}
                </div>
                <div class="text-xs text-surface-400 font-medium">
                  {{ car.manufactureYear }}
                </div>
              </td>

              <!-- Condición -->
              <td class="py-4 px-6">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                    car.condition === 'NEW'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  ]"
                >
                  {{ car.condition === 'NEW' ? t('dealerInventory.conditionNew') : t('dealerInventory.conditionUsed') }}
                </span>
              </td>

              <!-- Días Publicado -->
              <td class="py-4 px-6 text-xs text-surface-600 dark:text-surface-400 font-medium">
                {{ getDaysPublished(idx) }}
              </td>

              <!-- Precio -->
              <td class="py-4 px-6 font-extrabold text-surface-900 dark:text-surface-0 font-mono">
                {{ car.formattedPrice }}
              </td>

              <!-- Estado -->
              <td class="py-4 px-6">
                <select
                  :value="car.status || 'ACTIVE'"
                  @change="handleStatusChange(car, ($event.target as HTMLSelectElement).value)"
                  class="text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  :class="[
                    car.status === 'SOLD'
                      ? 'bg-surface-100 text-surface-700 border-surface-200 dark:bg-surface-800 dark:text-surface-300'
                      : car.status === 'RESERVED'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
                  ]"
                >
                  <option value="ACTIVE">{{ t('dealerInventory.statusActive') }}</option>
                  <option value="RESERVED">{{ t('dealerInventory.statusReserved') }}</option>
                  <option value="SOLD">{{ t('dealerInventory.statusSold') }}</option>
                </select>
              </td>

              <!-- Acciones (Editar 3.2 / Eliminar 3.4) -->
              <td class="py-4 px-6 text-right whitespace-nowrap space-x-2">
                <router-link
                  :to="`/vehicles/${car.id}`"
                  class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 text-surface-700 text-xs font-semibold transition-colors"
                  title="Ver ficha"
                >
                  <i class="pi pi-eye text-xs"></i>
                </router-link>
                <button
                  type="button"
                  @click="openEditDialog(car)"
                  class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                  title="Editar vehículo"
                >
                  <i class="pi pi-pencil text-xs"></i>
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  @click="openDeleteDialog(car)"
                  class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors"
                  title="Eliminar vehículo"
                >
                  <i class="pi pi-trash text-xs"></i>
                  <span>Eliminar</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer count -->
      <div class="px-6 py-3.5 bg-surface-50/60 dark:bg-surface-950 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between text-xs text-surface-500">
        <span>{{ t('dealerInventory.showingFooter', { count: dealerVehicles.length }) }}</span>
        <span>{{ t('dealerInventory.dbUpdated') }}</span>
      </div>
    </div>

    <!-- Modal Editar Vehículo (3.2 updateVehicle) -->
    <Dialog
      v-model:visible="isEditOpen"
      modal
      header="Editar Especificaciones de Vehículo"
      :style="{ width: '520px', maxWidth: '95vw' }"
      :dismissableMask="true"
    >
      <form @submit.prevent="handleSaveEdit" class="space-y-4 pt-2">
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Marca</label>
          <InputText v-model="editForm.brand" class="w-full text-xs" required />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Modelo</label>
          <InputText v-model="editForm.model" class="w-full text-xs" required />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Año</label>
            <InputNumber v-model="editForm.manufactureYear" class="w-full text-xs" :useGrouping="false" :min="1990" :max="2030" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Condición</label>
            <Select
              v-model="editForm.condition"
              :options="[{ label: 'Nuevo (0 km)', value: 'NEW' }, { label: 'Seminuevo', value: 'USED' }]"
              optionLabel="label"
              optionValue="value"
              class="w-full text-xs"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Precio</label>
            <InputNumber v-model="editForm.priceAmount" class="w-full text-xs" :min="0" mode="currency" currency="USD" locale="en-US" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Moneda</label>
            <Select
              v-model="editForm.currency"
              :options="[{ label: 'USD ($)', value: 'USD' }, { label: 'PEN (S/)', value: 'PEN' }]"
              optionLabel="label"
              optionValue="value"
              class="w-full text-xs"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Kilometraje (km)</label>
            <InputNumber v-model="editForm.mileage" class="w-full text-xs" :min="0" :useGrouping="false" placeholder="0" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Transmisión</label>
            <Select
              v-model="editForm.transmission"
              :options="[{ label: 'Automática', value: 'AUTOMATIC' }, { label: 'Manual/Mecánica', value: 'MANUAL' }, { label: 'CVT', value: 'CVT' }]"
              optionLabel="label"
              optionValue="value"
              class="w-full text-xs"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Motor</label>
            <InputText v-model="editForm.engine" placeholder="Ej. 2.0L, 2.5L Hybrid" class="w-full text-xs" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Tracción</label>
            <Select
              v-model="editForm.traction"
              :options="[{ label: 'Delantera (FWD)', value: 'FWD' }, { label: 'Integral (AWD)', value: 'AWD' }, { label: 'Trasera (RWD)', value: 'RWD' }, { label: '4x4 (4WD)', value: '4WD' }]"
              optionLabel="label"
              optionValue="value"
              class="w-full text-xs"
            />
          </div>
        </div>
        <div v-if="partnersStore.financialEntities.length > 0">
          <label class="block text-xs font-bold text-gray-700 dark:text-surface-300 mb-1">Entidad Financiera Aliada (Obligatorio)</label>
          <Select
            v-model="editForm.financialEntityId"
            :options="partnersStore.financialEntities"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccionar banco o financiera"
            class="w-full text-xs"
            required
          />
        </div>

        <!-- Optional Image Replacement -->
        <div class="pt-2 border-t border-gray-100 dark:border-surface-800">
          <label class="block text-xs font-bold text-gray-700 dark:text-surface-300 mb-1">
            Actualizar Foto de Portada (Cloudinary)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            @change="handleEditFileChange"
            class="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-surface-800 dark:file:text-primary cursor-pointer"
          />
          <p v-if="editSelectedFile" class="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <i class="pi pi-check text-[10px]"></i>
            <span>Archivo listo para subir: {{ editSelectedFile.name }}</span>
          </p>
        </div>

        <div class="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-surface-800">
          <Button label="Cancelar" text severity="secondary" @click="isEditOpen = false" class="!text-xs" />
          <Button type="submit" label="Guardar Cambios" icon="pi pi-check" :loading="isSaving" class="!text-xs !bg-[#eb8f47] !border-[#eb8f47]" />
        </div>
      </form>
    </Dialog>

    <!-- Hidden file input for direct card photo upload -->
    <input
      type="file"
      ref="directFileInputRef"
      class="hidden"
      accept="image/jpeg,image/png,image/webp,image/gif"
      @change="handleDirectFileChange"
    />

    <!-- Modal Confirmar Eliminación (3.4 deleteVehicle) -->
    <Dialog
      v-model:visible="isDeleteOpen"
      modal
      header="Confirmar Eliminación"
      :style="{ width: '440px', maxWidth: '95vw' }"
      :dismissableMask="true"
    >
      <div class="space-y-4 pt-2">
        <p class="text-xs text-gray-600 leading-relaxed">
          ¿Estás seguro de que deseas eliminar permanentemente el vehículo
          <strong class="text-gray-900">{{ vehicleToDelete?.brand }} {{ vehicleToDelete?.model }} ({{ vehicleToDelete?.manufactureYear }})</strong>
          del catálogo de tu concesionaria? Esta acción eliminará el anuncio de forma definitiva.
        </p>
        <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <Button label="Cancelar" text severity="secondary" @click="isDeleteOpen = false" class="!text-xs" />
          <Button label="Eliminar Definitivamente" icon="pi pi-trash" severity="danger" :loading="isDeleting" @click="handleConfirmDelete" class="!text-xs" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { UploadVehicleImageCommand } from '@/catalog/domain/upload-vehicle-image.command'
import type { Vehicle } from '@/catalog/domain/vehicle.entity'
import { useIamStore } from '@/iam/application/iam.store'
import { usePartnersStore } from '@/partners/application/partners.store'

const { t } = useI18n()

const catalogStore = useCatalogStore()
const iamStore = useIamStore()
const partnersStore = usePartnersStore()
const userSpecificVehicles = ref<Vehicle[]>([])
const isLoadingInventory = ref(true)
const viewMode = ref<'cards' | 'table'>('cards')
const defaultVehicleFallback = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'

// Direct file upload state
const directFileInputRef = ref<HTMLInputElement | null>(null)
const activeUploadVehicleId = ref<string | null>(null)
const isUploadingCardImage = ref<Record<string, boolean>>({})

const triggerDirectCardUpload = (vehicleId: string) => {
  activeUploadVehicleId.value = vehicleId
  if (directFileInputRef.value) {
    directFileInputRef.value.value = ''
    directFileInputRef.value.click()
  }
}

const handleDirectFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  const vehicleId = activeUploadVehicleId.value
  if (!file || !vehicleId) return

  isUploadingCardImage.value[vehicleId] = true
  feedbackMessage.value = null
  feedbackError.value = null

  try {
    const command = new UploadVehicleImageCommand(vehicleId, file)
    const success = await catalogStore.uploadVehicleImage(command)
    if (success) {
      feedbackMessage.value = 'Foto de portada actualizada exitosamente en Cloudinary.'
      await loadInventory()
    } else {
      feedbackError.value = catalogStore.error || 'Error al subir la imagen al servidor.'
    }
  } catch (err: any) {
    feedbackError.value = err.response?.data?.message || err.message || 'Error al subir la imagen.'
  } finally {
    isUploadingCardImage.value[vehicleId] = false
    activeUploadVehicleId.value = null
  }
}

const onCardImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (!target.src.includes('unsplash.com')) {
    target.src = defaultVehicleFallback
  }
}

const feedbackMessage = ref<string | null>(null)
const feedbackError = ref<string | null>(null)

// Edit Dialog state
const isEditOpen = ref(false)
const isSaving = ref(false)
const vehicleToEdit = ref<Vehicle | null>(null)
const editSelectedFile = ref<File | null>(null)
const editForm = reactive({
  financialEntityId: '',
  brand: '',
  model: '',
  manufactureYear: 2024,
  condition: 'NEW',
  priceAmount: 0,
  currency: 'USD',
  mileage: 0,
  transmission: 'AUTOMATIC',
  engine: '',
  traction: 'FWD'
})

const handleEditFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    editSelectedFile.value = target.files[0]
  } else {
    editSelectedFile.value = null
  }
}

// Delete Dialog state
const isDeleteOpen = ref(false)
const isDeleting = ref(false)
const vehicleToDelete = ref<Vehicle | null>(null)

const loadInventory = async () => {
  isLoadingInventory.value = true
  feedbackError.value = null
  try {
    const list = await catalogStore.fetchVehiclesByUserId()
    userSpecificVehicles.value = list || []
  } catch (err: any) {
    userSpecificVehicles.value = []
    if (err.response?.status === 403) {
      feedbackError.value = 'Tu sesión no tiene permisos vigentes de concesionario o el token ha expirado. Por favor, inicia sesión nuevamente.'
    }
  } finally {
    isLoadingInventory.value = false
  }
}

onMounted(async () => {
  await loadInventory()
})

const dealerVehicles = computed(() => {
  return userSpecificVehicles.value
})

const getDaysPublished = (_index: number): string => {
  return 'Reciente'
}

const handleStatusChange = async (car: Vehicle, newStatus: string) => {
  feedbackMessage.value = null
  feedbackError.value = null
  const ok = await catalogStore.updateVehicleStatus(car.id, newStatus)
  if (ok) {
    feedbackMessage.value = `Estado de ${car.brand} ${car.model} actualizado a ${newStatus}.`
    await loadInventory()
  } else {
    feedbackError.value = catalogStore.error || 'No se pudo actualizar el estado del vehículo.'
  }
}

const openEditDialog = async (car: Vehicle) => {
  vehicleToEdit.value = car
  editSelectedFile.value = null
  if (partnersStore.financialEntities.length === 0) {
    await partnersStore.fetchFinancialEntities()
  }
  editForm.financialEntityId = car.financialEntityId || partnersStore.financialEntities[0]?.id || ''
  editForm.brand = car.brand
  editForm.model = car.model
  editForm.manufactureYear = car.manufactureYear
  editForm.condition = car.condition || 'NEW'
  editForm.priceAmount = car.priceAmount
  editForm.currency = car.currency || 'USD'
  editForm.mileage = car.mileage || 0
  editForm.transmission = car.transmission || 'AUTOMATIC'
  editForm.engine = car.engine || ''
  editForm.traction = car.traction || 'FWD'
  isEditOpen.value = true
}

const handleSaveEdit = async () => {
  if (!vehicleToEdit.value) return
  const entityIdToUse = editForm.financialEntityId || vehicleToEdit.value.financialEntityId || partnersStore.financialEntities[0]?.id
  if (!entityIdToUse) {
    feedbackError.value = 'Debe seleccionar una entidad financiera aliada para el vehículo.'
    return
  }
  isSaving.value = true
  feedbackMessage.value = null
  feedbackError.value = null
  try {
    const updated = await catalogStore.updateVehicle(vehicleToEdit.value.id, {
      financialEntityId: entityIdToUse,
      brand: editForm.brand,
      model: editForm.model,
      manufactureYear: editForm.manufactureYear,
      condition: editForm.condition,
      priceAmount: editForm.priceAmount,
      currency: editForm.currency,
      mileage: editForm.mileage,
      transmission: editForm.transmission,
      engine: editForm.engine.trim() || undefined,
      traction: editForm.traction
    })
    if (updated) {
      if (editSelectedFile.value && vehicleToEdit.value) {
        const uploadCmd = new UploadVehicleImageCommand(vehicleToEdit.value.id, editSelectedFile.value)
        await catalogStore.uploadVehicleImage(uploadCmd)
      }
      feedbackMessage.value = `Vehículo ${updated.brand} ${updated.model} actualizado exitosamente.`
      isEditOpen.value = false
      await loadInventory()
    } else {
      feedbackError.value = catalogStore.error || 'No se pudo actualizar el vehículo.'
    }
  } finally {
    isSaving.value = false
  }
}

const openDeleteDialog = (car: Vehicle) => {
  vehicleToDelete.value = car
  isDeleteOpen.value = true
}

const handleConfirmDelete = async () => {
  if (!vehicleToDelete.value) return
  isDeleting.value = true
  feedbackMessage.value = null
  feedbackError.value = null
  try {
    const success = await catalogStore.deleteVehicle(vehicleToDelete.value.id)
    if (success) {
      feedbackMessage.value = `Vehículo ${vehicleToDelete.value.brand} ${vehicleToDelete.value.model} eliminado del catálogo.`
      isDeleteOpen.value = false
      await loadInventory()
    } else {
      feedbackError.value = catalogStore.error || 'No se pudo eliminar el vehículo.'
      isDeleteOpen.value = false
    }
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
</style>
