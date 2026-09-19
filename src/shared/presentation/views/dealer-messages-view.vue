<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header matching Mockup Screenshot 4 -->
    <div class="border-b border-gray-100 pb-6 space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-950">
        Bandeja de Entrada
      </h1>
      <p class="text-sm text-gray-500">
        Responde consultas de clientes y coordina aprobaciones crediticias en tiempo real.
      </p>
    </div>

    <!-- 2 Columns Inbox Container matching Mockup Screenshot 4 -->
    <div class="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
      <!-- Left Column: Chats Recientes (approx 4-5 cols) -->
      <div class="lg:col-span-5 border-r border-gray-200 flex flex-col">
        <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 class="text-sm font-bold text-gray-900">Chats Recientes</h2>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {{ conversations.length }} activos
          </span>
        </div>

        <!-- Chat List -->
        <div class="divide-y divide-gray-100 overflow-y-auto flex-1 max-h-[580px]">
          <button
            v-for="chat in conversations"
            :key="chat.id"
            type="button"
            @click="selectChat(chat)"
            :class="[
              'w-full text-left p-5 transition-all flex items-start gap-4 hover:bg-gray-50/80',
              activeChat.id === chat.id
                ? 'bg-blue-50/30 border-l-4 border-[#eb8f47]'
                : 'border-l-4 border-transparent'
            ]"
          >
            <!-- Avatar -->
            <div class="relative shrink-0">
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-900 to-[#0a1936] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {{ chat.name.charAt(0) }}
              </div>
              <span
                v-if="chat.isOnline"
                class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"
              ></span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0 space-y-1">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-extrabold text-gray-950 truncate">{{ chat.name }}</span>
                <span class="text-[11px] text-gray-400 font-medium shrink-0">{{ chat.lastTime }}</span>
              </div>

              <!-- Badge -->
              <div class="pt-0.5">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold',
                    chat.statusBadge === 'Crédito Aprobado'
                      ? 'bg-[#e6f7f4] text-[#00a887]'
                      : 'bg-[#ffe8d6] text-[#c96316]'
                  ]"
                >
                  {{ chat.statusBadge }}
                </span>
              </div>

              <!-- Message preview -->
              <p class="text-xs text-gray-500 truncate pt-1">
                {{ chat.lastMessage }}
              </p>
            </div>
          </button>
        </div>
      </div>

      <!-- Right Column: Conversación Activa (approx 7-8 cols) -->
      <div class="lg:col-span-7 flex flex-col bg-white">
        <!-- Active Chat Header matching Mockup -->
        <div class="p-5 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/30">
          <div class="flex items-center gap-3.5 min-w-0">
            <div class="relative shrink-0">
              <div class="w-10 h-10 rounded-2xl bg-[#0a1936] text-white flex items-center justify-center font-bold text-sm">
                {{ activeChat.name.charAt(0) }}
              </div>
              <span
                v-if="activeChat.isOnline"
                class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"
              ></span>
            </div>
            <div class="min-w-0">
              <div class="text-sm font-bold text-gray-950 truncate">
                {{ activeChat.name }}
              </div>
              <div class="text-xs text-gray-500 truncate">
                <span v-if="activeChat.isOnline" class="text-emerald-600 font-semibold">En línea</span>
                <span v-else class="text-gray-400">Desconectado</span>
                • Interesado en {{ activeChat.vehicleOfInterest }}
              </div>
            </div>
          </div>

          <!-- Action: Ver Perfil Crediticio -->
          <router-link
            :to="`/dealer/prospects/${activeChat.id}`"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shrink-0 shadow-2xs"
          >
            <i class="pi pi-id-card text-xs text-blue-600"></i>
            <span>Ver Perfil Crediticio</span>
          </router-link>
        </div>

        <!-- Messages Body -->
        <div ref="chatContainerRef" class="flex-1 p-6 space-y-4 overflow-y-auto max-h-[460px] bg-slate-50/40">
          <!-- Date Separator matching Mockup -->
          <div class="flex items-center justify-center my-2">
            <span class="px-3 py-1 rounded-full bg-gray-100 text-[11px] font-bold text-gray-500">
              Hoy
            </span>
          </div>

          <!-- Messages -->
          <div
            v-for="(msg, idx) in activeChat.messages"
            :key="idx"
            :class="[
              'flex flex-col',
              msg.sender === 'dealer' ? 'items-end' : 'items-start'
            ]"
          >
            <!-- Bubble -->
            <div
              :class="[
                'max-w-lg rounded-2xl p-4 text-xs shadow-2xs leading-relaxed',
                msg.sender === 'dealer'
                  ? 'bg-[#0a1936] text-white rounded-br-none'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
              ]"
            >
              {{ msg.text }}
            </div>

            <!-- Timestamp -->
            <span class="text-[10px] text-gray-400 mt-1 px-1 font-medium">
              {{ msg.time }}
            </span>
          </div>
        </div>

        <!-- Chat Input Bar matching Mockup Screenshot 4 -->
        <div class="p-4 border-t border-gray-200 bg-white">
          <form @submit.prevent="handleSendMessage" class="flex items-center gap-3">
            <!-- Attachment button -->
            <button
              type="button"
              class="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Adjuntar documento o cotización"
            >
              <i class="pi pi-paperclip text-lg"></i>
            </button>

            <!-- Message Input -->
            <input
              v-model="inputMessage"
              type="text"
              :placeholder="`Escribe un mensaje para ${activeChat.name}...`"
              class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
            />

            <!-- Orange Send Button matching Mockup -->
            <button
              type="submit"
              :disabled="!inputMessage.trim()"
              class="px-5 py-3 rounded-xl bg-[#eb8f47] hover:bg-[#d97c36] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Enviar</span>
              <i class="pi pi-send text-xs"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue'
import { useCatalogStore } from '@/catalog/application/catalog.store'
import { useFinancingStore } from '@/financing/application/financing.store'
import { useMessagingStore } from '@/shared/application/messaging.store'

const catalogStore = useCatalogStore()
const financingStore = useFinancingStore()
const messagingStore = useMessagingStore()

const inputMessage = ref('')
const chatContainerRef = ref<HTMLElement | null>(null)

interface ChatMessage {
  sender: 'buyer' | 'dealer'
  text: string
  time: string
}

interface ChatConversation {
  id: string
  name: string
  isOnline: boolean
  vehicleOfInterest: string
  statusBadge: string
  lastTime: string
  lastMessage: string
  messages: ChatMessage[]
}

const conversations = reactive<ChatConversation[]>([
  {
    id: 'carlos-mendoza',
    name: 'Carlos Mendoza',
    isOnline: true,
    vehicleOfInterest: 'Toyota Corolla Cross 2023',
    statusBadge: 'Crédito Aprobado',
    lastTime: '10:42 AM',
    lastMessage: 'Excelente. Hoy a las 4:30 PM me queda perfecto. ¿Qué documentos debo llevar?',
    messages: [
      {
        sender: 'buyer',
        text: 'Buenos días, vi su publicación del Toyota Corolla Cross 2023 por $26,900. Ya tengo el crédito pre-evaluado con el BCP.',
        time: '10:35 AM'
      },
      {
        sender: 'buyer',
        text: '¿Tienen disponibilidad en color gris oscuro para entrega inmediata?',
        time: '10:36 AM'
      },
      {
        sender: 'dealer',
        text: '¡Hola Carlos! Sí, contamos con 2 unidades en color Gris Grafito disponibles para entrega esta misma semana.',
        time: '10:40 AM'
      },
      {
        sender: 'dealer',
        text: '¿Te gustaría agendar una prueba de manejo para hoy en la tarde o mañana en la mañana?',
        time: '10:41 AM'
      },
      {
        sender: 'buyer',
        text: 'Excelente. Hoy a las 4:30 PM me queda perfecto. ¿Qué documentos debo llevar?',
        time: '10:42 AM'
      }
    ]
  },
  {
    id: 'ana-valdivia',
    name: 'Ana Sofía Valdivia',
    isOnline: false,
    vehicleOfInterest: 'Honda CR-V 2024',
    statusBadge: 'Crédito Aprobado',
    lastTime: 'Ayer',
    lastMessage: '¿El precio incluye gastos notariales y de placas?',
    messages: [
      {
        sender: 'buyer',
        text: 'Hola, estoy interesada en la Honda CR-V 2024 anunciada en el portal.',
        time: 'Ayer, 03:20 PM'
      },
      {
        sender: 'buyer',
        text: '¿El precio incluye gastos notariales y de placas?',
        time: 'Ayer, 03:22 PM'
      },
      {
        sender: 'dealer',
        text: 'Hola Ana, sí incluye los trámites de placa y tarjeta de propiedad. Te esperamos en el concesionario.',
        time: 'Ayer, 03:45 PM'
      }
    ]
  },
  {
    id: 'roberto-gomez',
    name: 'Roberto Gómez',
    isOnline: false,
    vehicleOfInterest: 'Mazda CX-5 2023',
    statusBadge: 'En Evaluación',
    lastTime: '16 Sep',
    lastMessage: 'Envié los documentos que me solicitaron para el crédito.',
    messages: [
      {
        sender: 'buyer',
        text: 'Buenos días, estoy tramitando mi crédito para el Mazda CX-5.',
        time: '16 Sep, 11:10 AM'
      },
      {
        sender: 'buyer',
        text: 'Envié los documentos que me solicitaron para el crédito.',
        time: '16 Sep, 11:12 AM'
      },
      {
        sender: 'dealer',
        text: 'Recibido Roberto. El analista del banco está revisando tus boletas de pago.',
        time: '16 Sep, 11:30 AM'
      }
    ]
  }
])

const activeChat = ref<ChatConversation>(conversations[0]!)

const selectChat = async (chat: ChatConversation) => {
  activeChat.value = chat
  if (messagingStore.conversations.some(c => c.id === chat.id)) {
    const apiConv = messagingStore.conversations.find(c => c.id === chat.id)
    if (apiConv) {
      await messagingStore.selectConversation(apiConv)
    }
  }
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
  }
}

const handleSendMessage = async () => {
  if (!inputMessage.value.trim()) return

  const now = new Date()
  const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
  const textToSend = inputMessage.value.trim()

  activeChat.value.messages.push({
    sender: 'dealer',
    text: textToSend,
    time: timeStr
  })

  activeChat.value.lastMessage = textToSend
  activeChat.value.lastTime = timeStr
  inputMessage.value = ''

  scrollToBottom()

  // If chat is linked to API conversation, invoke sendMessage
  if (messagingStore.conversations.some(c => c.id === activeChat.value.id)) {
    await messagingStore.sendMessage(textToSend)
  }
}

onMounted(async () => {
  await Promise.all([
    messagingStore.fetchConversations(),
    catalogStore.fetchVehicles(),
    financingStore.fetchSimulations()
  ])

  if (messagingStore.conversations.length > 0) {
    const mapped: ChatConversation[] = messagingStore.conversations.map((c) => ({
      id: c.id,
      name: c.dealerName || 'Prospecto Web',
      isOnline: true,
      vehicleOfInterest: c.vehicleTitle || 'Vehículo de Interés',
      statusBadge: 'Crédito Evaluado',
      lastTime: c.lastActivity,
      lastMessage: c.lastMessageContent || 'Mensaje recibido del cliente.',
      messages: [
        {
          sender: 'buyer' as const,
          text: c.lastMessageContent || 'Hola, deseo recibir información adicional.',
          time: c.lastActivity
        }
      ]
    }))
    conversations.splice(0, conversations.length, ...mapped)
    if (conversations[0]) {
      activeChat.value = conversations[0]
      await messagingStore.selectConversation(messagingStore.conversations[0]!)
    }
  }

  scrollToBottom()
})
</script>

<style scoped>
</style>
