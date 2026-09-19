<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Gestión de Asesores de Ventas (Concesionaria)"
    :style="{ width: '90vw', maxWidth: '650px' }"
    class="rounded-3xl overflow-hidden"
  >
    <div class="space-y-6 pt-2">
      <!-- Top banner & Add Agent Form Toggle -->
      <div class="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 class="text-sm font-bold text-gray-900">Equipo Comercial</h3>
          <p class="text-xs text-gray-500">Asigna prospectos y gestiona la cartera de ventas de tu sucursal.</p>
        </div>
        <Button
          :label="showAddForm ? 'Cerrar Formulario' : '+ Nuevo Asesor'"
          size="small"
          :severity="showAddForm ? 'secondary' : 'warn'"
          class="!rounded-xl !text-xs font-semibold"
          @click="showAddForm = !showAddForm"
        />
      </div>

      <!-- Add New Agent Form -->
      <div v-if="showAddForm" class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
        <h4 class="text-xs font-bold text-amber-900">Registrar Nuevo Asesor de Ventas</h4>
        <form @submit.prevent="handleCreateAgent" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            v-model="newAgent.fullName"
            type="text"
            required
            placeholder="Nombre completo"
            class="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            v-model="newAgent.email"
            type="email"
            required
            placeholder="Correo corporativo"
            class="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            v-model="newAgent.phone"
            type="tel"
            required
            placeholder="Teléfono móvil"
            class="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div class="sm:col-span-3 flex justify-end gap-2 pt-1">
            <Button
              type="submit"
              label="Guardar Asesor"
              size="small"
              :loading="iamStore.isLoading"
              class="!rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] text-white font-bold !text-xs"
            />
          </div>
        </form>
      </div>

      <!-- Agents List -->
      <div v-if="iamStore.salesAgents.length === 0" class="text-center py-8 text-xs text-gray-500 space-y-2">
        <i class="pi pi-users text-2xl text-gray-300"></i>
        <p>No tienes asesores de ventas registrados aún en tu concesionaria.</p>
      </div>

      <div v-else class="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1 space-y-2">
        <div
          v-for="agent in iamStore.salesAgents"
          :key="agent.id"
          class="pt-2 flex items-center justify-between gap-3 text-xs"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
              {{ agent.initials }}
            </div>
            <div class="min-w-0 truncate">
              <div class="font-bold text-gray-900 truncate">{{ agent.fullName }}</div>
              <div class="text-[11px] text-gray-500 truncate">{{ agent.email }} · {{ agent.phone }}</div>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
              {{ agent.assignedLeadsCount }} prospectos
            </span>
            <Button
              icon="pi pi-arrow-right-arrow-left"
              text
              severity="secondary"
              size="small"
              title="Reasignar prospectos a otro asesor"
              class="!text-xs"
              @click="openReassign(agent.id)"
            />
          </div>
        </div>
      </div>

      <!-- Reassign Leads Sub-Dialog / Inline Selector -->
      <div v-if="reassigningAgentId" class="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2 text-xs">
        <div class="font-bold text-blue-900">Reasignar prospectos a otro asesor:</div>
        <div class="flex gap-2">
          <select
            v-model="targetAgentId"
            class="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900"
          >
            <option value="">Selecciona el nuevo asesor destino...</option>
            <option
              v-for="other in iamStore.salesAgents.filter(a => a.id !== reassigningAgentId)"
              :key="other.id"
              :value="other.id"
            >
              {{ other.fullName }} ({{ other.email }})
            </option>
          </select>
          <Button
            label="Confirmar"
            size="small"
            :disabled="!targetAgentId"
            class="!rounded-xl bg-blue-600 text-white font-bold !text-xs"
            @click="handleReassignConfirm"
          />
          <Button
            label="Cancelar"
            text
            size="small"
            severity="secondary"
            class="!text-xs"
            @click="reassigningAgentId = null"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { useIamStore } from '../../application/iam.store'

const visible = defineModel<boolean>('visible', { default: false })
const iamStore = useIamStore()

const showAddForm = ref(false)
const reassigningAgentId = ref<string | null>(null)
const targetAgentId = ref<string>('')

const newAgent = reactive({
  fullName: '',
  email: '',
  phone: ''
})

onMounted(async () => {
  await iamStore.fetchSalesAgents()
})

const handleCreateAgent = async () => {
  const success = await iamStore.createSalesAgent({
    fullName: newAgent.fullName,
    email: newAgent.email,
    phone: newAgent.phone
  })
  if (success) {
    newAgent.fullName = ''
    newAgent.email = ''
    newAgent.phone = ''
    showAddForm.value = false
  }
}

const openReassign = (agentId: string) => {
  reassigningAgentId.value = agentId
  targetAgentId.value = ''
}

const handleReassignConfirm = async () => {
  if (!reassigningAgentId.value || !targetAgentId.value) return
  await iamStore.reassignSalesAgentLeads(reassigningAgentId.value, targetAgentId.value)
  reassigningAgentId.value = null
  targetAgentId.value = ''
}
</script>
