<template>
  <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header Banner -->
    <div class="rounded-3xl bg-gradient-to-r from-[#0a1936] via-[#112959] to-[#1e3a8a] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-12 -bottom-12 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md mb-3 border border-blue-500/30">
          <i class="pi pi-sparkles text-xs"></i>
          Asistente SmartFinance
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Consulta IA sobre Crédito Vehicular
        </h1>
        <p class="mt-2 text-sm text-blue-100/80 leading-relaxed">
          Resuelve dudas sobre tasas de interés, cuota inicial recomendada, capacidad de pago y requisitos para tu pre-evaluación en segundos.
        </p>
      </div>
    </div>

    <!-- Quick Question Chips -->
    <div class="space-y-2">
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preguntas frecuentes sugeridas</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="chip in quickPrompts"
          :key="chip"
          type="button"
          @click="sendPrompt(chip)"
          class="text-xs font-medium px-3.5 py-2 rounded-xl bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200 transition-all shadow-xs flex items-center gap-1.5"
        >
          <i class="pi pi-comment text-[11px] text-blue-500"></i>
          {{ chip }}
        </button>
      </div>
    </div>

    <!-- Chat Container -->
    <div class="bg-white rounded-3xl border border-gray-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
      <!-- Chat Messages Area -->
      <div ref="chatContainer" class="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['flex items-start gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start']"
        >
          <!-- Assistant Avatar -->
          <div
            v-if="msg.role === 'assistant'"
            class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a1936] to-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs"
          >
            <i class="pi pi-sparkles text-xs"></i>
          </div>

          <!-- Message Bubble -->
          <div
            :class="[
              'max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line',
              msg.role === 'user'
                ? 'bg-[#eb8f47] text-white rounded-tr-xs shadow-xs'
                : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-xs'
            ]"
          >
            <p>{{ msg.text }}</p>
            <span
              :class="[
                'text-[10px] block mt-1.5 text-right font-medium',
                msg.role === 'user' ? 'text-orange-100' : 'text-gray-400'
              ]"
            >
              {{ msg.time }}
            </span>
          </div>

          <!-- User Avatar -->
          <div
            v-if="msg.role === 'user'"
            class="w-9 h-9 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs shrink-0"
          >
            {{ userInitials }}
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isThinking" class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a1936] to-blue-600 flex items-center justify-center text-white shrink-0">
            <i class="pi pi-spin pi-spinner text-xs"></i>
          </div>
          <div class="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs text-gray-500 rounded-tl-xs flex items-center gap-2">
            <span>Analizando consulta financiera...</span>
          </div>
        </div>
      </div>

      <!-- Chat Input Bar -->
      <div class="p-4 bg-gray-50 border-t border-gray-100">
        <form @submit.prevent="handleSend" class="flex gap-2 items-center">
          <input
            v-model="inputQuery"
            type="text"
            placeholder="Escribe tu consulta sobre créditos, cuotas o requisitos..."
            class="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-xs"
            :disabled="isThinking"
          />
          <button
            type="submit"
            :disabled="!inputQuery.trim() || isThinking"
            class="px-5 py-3 rounded-2xl bg-[#eb8f47] hover:bg-[#d97c36] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Enviar</span>
            <i class="pi pi-send text-xs"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useIamStore } from '@/iam/application/iam.store'
import { useProfilesStore } from '@/profiles/application/profiles.store'
import { useConsultationsStore } from '@/financing/application/consultations.store'

const iamStore = useIamStore()
const profilesStore = useProfilesStore()
const consultationsStore = useConsultationsStore()

onMounted(async () => {
  await Promise.all([
    consultationsStore.fetchHistory(),
    consultationsStore.fetchRecommendations()
  ])

  if (consultationsStore.history.length > 0) {
    consultationsStore.history.forEach(item => {
      messages.value.push({
        role: 'user',
        text: item.prompt,
        time: item.formattedTime
      })
      messages.value.push({
        role: 'assistant',
        text: item.recommendationText,
        time: item.formattedTime
      })
    })
    await scrollToBottom()
  }
})

const userDisplayName = computed(() => {
  if (profilesStore.currentProfile?.fullName) {
    return profilesStore.currentProfile.fullName
  }
  if (iamStore.username && iamStore.username !== 'Invitado') {
    const raw = iamStore.username.split('@')[0] || ''
    const clean = raw.replace(/[._-]/g, ' ')
    if (clean) return clean.charAt(0).toUpperCase() + clean.slice(1)
  }
  return iamStore.username || 'Usuario'
})

const userInitials = computed(() => {
  const parts = userDisplayName.value.trim().split(' ')
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
  }
  return userDisplayName.value.substring(0, 2).toUpperCase()
})

const quickPrompts = [
  '¿Cuál es la cuota inicial mínima recomendada?',
  '¿Cómo se calcula el seguro de desgravamen?',
  '¿Puedo hacer pagos anticipados a capital?',
  '¿Qué documentos necesito para mi pre-evaluación?'
]

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  time: string
}

const formatTime = () => {
  const d = new Date()
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const messages = ref<ChatMessage[]>([
  {
    role: 'assistant',
    text: `¡Hola! Soy tu Asesor Financiero IA de SmartFinance Drive. 🚗💡\n\nPuedo orientarte con el cálculo de cuotas, explicación de TCEA, requisitos de aprobación bancaria o recomendaciones según tus ingresos. ¿En qué te puedo ayudar hoy?`,
    time: formatTime()
  }
])

const inputQuery = ref<string>('')
const isThinking = ref<boolean>(false)
const chatContainer = ref<HTMLDivElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendPrompt = (prompt: string) => {
  inputQuery.value = prompt
  handleSend()
}

const getBotResponse = (query: string): string => {
  const lower = query.toLowerCase()
  if (lower.includes('inicial') || lower.includes('enganche')) {
    return '📌 Recomendación de Cuota Inicial:\nEn el mercado vehicular peruano, las entidades financieras suelen solicitar entre el 10% y el 20% como cuota inicial mínima. Aportar un 20% o más reduce significativamente tu TCEA, disminuye la cuota mensual y facilita la pre-aprobación automática.'
  }
  if (lower.includes('seguro') || lower.includes('desgravamen')) {
    return '🛡️ Seguro de Desgravamen:\nEs un seguro que cubre el saldo deudor de tu crédito vehicular en caso de fallecimiento o invalidez total y permanente. Se calcula típicamente como un porcentaje mensual (aprox. 0.05% a 0.09%) sobre el saldo insoluto del préstamo.'
  }
  if (lower.includes('pago anticipado') || lower.includes('amortiz') || lower.includes('adelanto')) {
    return '✅ Pagos Anticipados y Adelanto de Cuotas:\nPor ley de protección al consumidor (SBS), tienes total derecho a realizar pagos anticipados a capital en cualquier momento SIN cobro de penalidades ni comisiones. Puedes elegir entre reducir el plazo del crédito o reducir el valor de la cuota mensual.'
  }
  if (lower.includes('requisito') || lower.includes('document') || lower.includes('pre-evaluaci')) {
    return '📋 Requisitos estándar para Pre-evaluación:\n1. DNI o Carnet de Extranjería vigente.\n2. Continuidad laboral mínima de 6 meses (dependientes) o 12 meses (independientes con RUC).\n3. Últimas 3 boletas de pago o recibos por honorarios con acreditación SUNAT.\n4. Buen historial crediticio (no registrar deudas morosas graves en centrales de riesgo).'
  }
  if (lower.includes('tasa') || lower.includes('tea') || lower.includes('tcea')) {
    return '📊 Tasa Efectiva (TEA vs TCEA):\nLa TEA representa solo el costo del dinero prestado, mientras que la TCEA (Tasa de Costo Efectivo Anual) incluye todos los costos: intereses, seguros (desgravamen y vehicular) y comisiones. Siempre compara ofertas bancarias basándote en la TCEA.'
  }
  return `He analizado tu consulta sobre "${query}".\n\nTe sugerimos ingresar a la sección de "Vehículos a buscar" y presionar "Solicitar Pre-evaluación" en el auto de tu preferencia para generar una simulación detallada con las tasas reales ofrecidas por nuestros bancos aliados.`
}

const handleSend = async () => {
  const text = inputQuery.value.trim()
  if (!text || isThinking.value) return

  messages.value.push({
    role: 'user',
    text,
    time: formatTime()
  })

  inputQuery.value = ''
  isThinking.value = true
  await scrollToBottom()

  try {
    const consultation = await consultationsStore.askAdvisor({
      prompt: text,
      monthlyIncome: 4500,
      currency: 'PEN'
    })

    if (consultation && consultation.recommendationText) {
      let finalAnswer = consultation.recommendationText
      if (consultation.recommendedCategory) {
        finalAnswer += `\n\n🚗 Categoría sugerida: ${consultation.recommendedCategory}`
      }
      if (consultation.estimatedMaxMonthlyFee > 0) {
        finalAnswer += `\n💳 Cuota mensual máxima estimada: ${consultation.formattedMaxFee}`
      }

      messages.value.push({
        role: 'assistant',
        text: finalAnswer,
        time: formatTime()
      })
    } else {
      messages.value.push({
        role: 'assistant',
        text: getBotResponse(text),
        time: formatTime()
      })
    }
  } catch {
    messages.value.push({
      role: 'assistant',
      text: getBotResponse(text),
      time: formatTime()
    })
  } finally {
    isThinking.value = false
    await scrollToBottom()
  }
}

</script>

<style scoped>
</style>
