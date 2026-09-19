<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header matching Mockup Image 5 -->
    <div class="border-b border-gray-100 pb-6 space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
        Bandeja de Entrada
      </h1>
      <p class="text-sm text-gray-500">
        Gestiona tus conversaciones con concesionarias y asesores financieros.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <ProgressSpinner style="width: 50px; height: 50px" :strokeWidth="4" />
      <p class="text-sm text-gray-500 font-medium">Cargando conversaciones...</p>
    </div>

    <!-- 2-Column Chat Interface matching Mockup Image 5 -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[640px]">
      <!-- Left Column: Chats Recientes (approx 4 cols) -->
      <div class="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-5 shadow-xs flex flex-col h-full overflow-hidden space-y-4">
        <h2 class="text-sm font-bold text-gray-950">Chats Recientes</h2>

        <!-- Search input -->
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <i class="pi pi-search text-xs"></i>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar concesionaria o modelo..."
            class="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-2xs"
          />
        </div>

        <!-- Chat List -->
        <div class="flex-1 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-1">
          <div
            v-for="chat in filteredChats"
            :key="chat.id"
            @click="selectChat(chat)"
            :class="[
              'p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3',
              activeChat?.id === chat.id
                ? 'bg-blue-50/80 border border-blue-200 shadow-2xs'
                : 'hover:bg-gray-50'
            ]"
          >
            <!-- Avatar & Details -->
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0">
                {{ chat.dealerName.substring(0, 2).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-gray-900 truncate">
                  {{ chat.dealerName }}
                </div>
                <div class="text-[11px] text-gray-500 truncate">
                  {{ chat.vehicleTitle }}
                </div>
                <div class="text-[10px] text-gray-400">
                  {{ chat.lastActivity }}
                </div>
              </div>
            </div>

            <!-- Unread Badge -->
            <div v-if="chat.unreadCount > 0" class="shrink-0">
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#00a887] text-white text-[10px] font-bold">
                {{ chat.unreadCount }}
              </span>
            </div>
          </div>

          <div v-if="filteredChats.length === 0" class="p-8 text-center text-xs text-gray-400">
            No se encontraron conversaciones con ese término.
          </div>
        </div>
      </div>

      <!-- Right Column: Active Conversation (approx 8 cols) -->
      <div class="lg:col-span-8 bg-white rounded-3xl border border-gray-200 shadow-xs flex flex-col h-full overflow-hidden">
        <template v-if="activeChat">
          <!-- Conversation Header -->
          <div class="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-4 bg-white shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
                {{ activeChat.dealerName.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-bold text-gray-900">{{ activeChat.dealerName }}</h3>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-[#00a887] border border-emerald-200">
                    Concesionaria Oficial
                  </span>
                </div>
                <p class="text-[11px] text-gray-500">
                  {{ activeChat.vehicleTitle }} · {{ activeChat.vehiclePrice }}
                </p>
              </div>
            </div>

            <div>
              <router-link
                v-if="activeChat.vehicleId"
                :to="`/vehicles/${activeChat.vehicleId}`"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <i class="pi pi-external-link text-[10px]"></i>
                <span>Ficha del auto</span>
              </router-link>
            </div>
          </div>

          <!-- Vehicle Mini-Preview Card inside chat matching Mockup Image 5 -->
          <div class="p-4 bg-gray-50/70 border-b border-gray-100 shrink-0">
            <div class="bg-white rounded-2xl border border-gray-200 p-3 flex items-center gap-3 max-w-sm shadow-2xs">
              <div class="w-12 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-blue-900 overflow-hidden shrink-0">
                <i class="pi pi-car text-xl"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-gray-900">{{ activeChat.vehicleTitle }}</div>
                <div class="text-xs font-extrabold text-blue-900">{{ activeChat.vehiclePrice }}</div>
              </div>
            </div>
          </div>

          <!-- Messages Scroll Area -->
          <div ref="messagesContainer" class="flex-1 p-5 overflow-y-auto space-y-3.5 bg-white">
            <div
              v-for="msg in activeChat.messages"
              :key="msg.id"
              :class="['flex flex-col', msg.sender === 'user' ? 'items-end' : 'items-start']"
            >
              <!-- Message Bubble -->
              <div
                :class="[
                  'max-w-lg rounded-2xl px-4 py-3 text-xs leading-relaxed',
                  msg.sender === 'user'
                    ? 'bg-[#1e40af] text-white rounded-tr-xs shadow-2xs'
                    : 'bg-gray-100 text-gray-800 rounded-tl-xs border border-gray-200/60'
                ]"
              >
                {{ msg.text }}
              </div>

              <!-- Timestamp -->
              <span class="text-[10px] text-gray-400 mt-1 px-1">
                {{ msg.time }}
              </span>
            </div>
          </div>

          <!-- Input Bar matching Mockup Image 5 -->
          <div class="p-3.5 bg-gray-50/80 border-t border-gray-100 shrink-0">
            <form @submit.prevent="handleSendMessage" class="flex items-center gap-2">
              <button
                type="button"
                title="Adjuntar archivo"
                class="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors shrink-0 shadow-2xs"
              >
                <i class="pi pi-paperclip text-sm"></i>
              </button>

              <input
                v-model="inputMessage"
                type="text"
                placeholder="Escribe un mensaje aquí..."
                class="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
              />

              <button
                type="submit"
                :disabled="!inputMessage.trim()"
                class="px-5 py-2.5 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] disabled:opacity-50 text-white font-bold text-xs text-center shadow-xs transition-colors shrink-0"
              >
                Enviar
              </button>
            </form>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import { usePartnersStore } from '@/partners/application/partners.store'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { useIamStore } from '@/iam/application/iam.store'
import { useProfilesStore } from '@/profiles/application/profiles.store'
import { useMessagingStore } from '@/shared/application/messaging.store'

const route = useRoute()
const partnersStore = usePartnersStore()
const catalogStore = useCatalogStore()
const iamStore = useIamStore()
const profilesStore = useProfilesStore()
const messagingStore = useMessagingStore()

const isLoading = ref(true)
const searchQuery = ref('')
const inputMessage = ref('')
const messagesContainer = ref<HTMLDivElement | null>(null)

interface ChatMessage {
  id: string
  sender: 'user' | 'dealer'
  text: string
  time: string
}

interface DealerChat {
  id: string
  dealerId: string
  dealerName: string
  vehicleId?: string
  vehicleTitle: string
  vehiclePrice: string
  lastActivity: string
  unreadCount: number
  messages: ChatMessage[]
}

const chats = ref<DealerChat[]>([])
const activeChat = ref<DealerChat | null>(null)

const userFirstName = computed(() => {
  if (profilesStore.currentProfile?.firstName) {
    return profilesStore.currentProfile.firstName
  }
  if (iamStore.username && iamStore.username !== 'Invitado') {
    const raw = iamStore.username.split('@')[0] || ''
    const clean = raw.replace(/[._-]/g, ' ')
    if (clean) return clean.split(' ')[0]
  }
  return 'estimado cliente'
})

onMounted(async () => {
  isLoading.value = true
  const userId = iamStore.currentUser?.id || localStorage.getItem('user_id')

  await Promise.all([
    messagingStore.fetchConversations(),
    partnersStore.fetchFinancialEntities(),
    catalogStore.fetchVehicles(),
    userId ? profilesStore.fetchProfileByUserId(userId) : Promise.resolve()
  ])

  // If real conversations exist from GET /api/v1/conversations
  if (messagingStore.conversations.length > 0) {
    chats.value = messagingStore.conversations.map((conv) => ({
      id: conv.id,
      dealerId: conv.dealerUserId,
      dealerName: conv.dealerName || 'Concesionaria Oficial',
      vehicleId: conv.vehicleId || undefined,
      vehicleTitle: conv.vehicleTitle || 'Vehículo Solicitado',
      vehiclePrice: conv.vehiclePrice || '$20,000 USD',
      lastActivity: conv.lastActivity,
      unreadCount: conv.unreadBuyerCount,
      messages: [
        {
          id: '1',
          sender: 'dealer',
          text: conv.lastMessageContent || 'Hola, ¿en qué podemos ayudarte con este vehículo?',
          time: '10:00 AM'
        }
      ]
    }))
  } else {
    // Build initial threads based on API financial entities and vehicles
    const defaultVehicles = catalogStore.vehicles

    chats.value = partnersStore.financialEntities.map((entity, index) => {
      const matchingVehicle = defaultVehicles[index % defaultVehicles.length]
      const vTitle = matchingVehicle ? `${matchingVehicle.brand} ${matchingVehicle.model} ${matchingVehicle.manufactureYear}` : 'Vehículo Solicitado'
      const vPrice = matchingVehicle ? matchingVehicle.formattedPrice : '$20,000 USD'
      const vId = matchingVehicle ? matchingVehicle.id : undefined

      return {
        id: `chat-${entity.id}`,
        dealerId: entity.id,
        dealerName: entity.name,
        vehicleId: vId,
        vehicleTitle: vTitle,
        vehiclePrice: vPrice,
        lastActivity: index === 0 ? 'Hace 2 min' : 'Hoy',
        unreadCount: index === 0 ? 2 : 0,
        messages: [
          {
            id: '1',
            sender: 'dealer',
            text: `Hola ${userFirstName.value}, bienvenido a ${entity.name}. Vi que estás interesado en el ${vTitle}. ¿En qué puedo ayudarte?`,
            time: '10:02 AM'
          },
          {
            id: '2',
            sender: 'user',
            text: 'Hola, sí me interesa. Quisiera saber si el crédito pre-aprobado cubre la totalidad del enganche.',
            time: '10:04 AM'
          },
          {
            id: '3',
            sender: 'dealer',
            text: '¡Claro! Sí, tu crédito pre-aprobado de SmartFinance Drive cubre hasta el 100% del enganche de 36 mensualidades.',
            time: '10:06 AM'
          }
        ]
      }
    })
  }

  // If query params passed (e.g. from vehicle detail "Agendar Visita")
  const targetVehicleId = route.query.vehicleId as string | undefined
  const targetDealerId = route.query.dealerId as string | undefined

  if (targetDealerId) {
    const found = chats.value.find(c => c.dealerId === targetDealerId)
    if (found) {
      activeChat.value = found
    }
  }

  if (!activeChat.value && chats.value.length > 0) {
    const firstChat = chats.value[0]
    if (firstChat) {
      activeChat.value = firstChat
    }
  }

  isLoading.value = false
  await scrollToBottom()
})

const filteredChats = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return chats.value
  return chats.value.filter(c =>
    c.dealerName.toLowerCase().includes(q) ||
    c.vehicleTitle.toLowerCase().includes(q)
  )
})

const selectChat = async (chat: DealerChat) => {
  activeChat.value = chat
  chat.unreadCount = 0
  await scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleSendMessage = async () => {
  const text = inputMessage.value.trim()
  if (!text || !activeChat.value) return

  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  activeChat.value.messages.push({
    id: String(Date.now()),
    sender: 'user',
    text,
    time: timeStr
  })

  inputMessage.value = ''
  await scrollToBottom()

  // Send to real API
  await messagingStore.sendMessage(text)

  // Dealer automatic friendly answer
  setTimeout(async () => {
    if (!activeChat.value) return
    activeChat.value.messages.push({
      id: String(Date.now() + 1),
      sender: 'dealer',
      text: 'Excelente, hemos registrado tu mensaje. Un asesor comercial se pondrá en contacto contigo de inmediato para coordinar la cita.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    await scrollToBottom()
  }, 1000)
}
</script>

<style scoped>
</style>
