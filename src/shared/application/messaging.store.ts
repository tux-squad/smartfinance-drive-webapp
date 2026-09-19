import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Conversation, ChatMessage } from '../domain/conversation.entity'
import { MessagingApi, type StartConversationCommand } from '../infrastructure/messaging-api'

const api = new MessagingApi()

export const useMessagingStore = defineStore('messaging', () => {
  const conversations = ref<Conversation[]>([])
  const activeConversation = ref<Conversation | null>(null)
  const currentMessages = ref<ChatMessage[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const hasConversations = computed(() => conversations.value.length > 0)

  /**
   * Fetches user conversations (9.1).
   */
  const fetchConversations = async (): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      conversations.value = await api.getConversations()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar las conversaciones.'
      conversations.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Loads messages for a selected conversation (9.2).
   */
  const selectConversation = async (conversation: Conversation): Promise<void> => {
    activeConversation.value = conversation
    isLoading.value = true
    try {
      currentMessages.value = await api.getConversationMessages(conversation.id)
    } catch {
      currentMessages.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Sends a new message in the current conversation (9.4).
   */
  const sendMessage = async (content: string): Promise<ChatMessage | null> => {
    if (!activeConversation.value) return null
    try {
      const msg = await api.sendMessage(activeConversation.value.id, content)
      currentMessages.value.push(msg)
      return msg
    } catch {
      // Local optimistic fallback
      const fallbackMsg = new ChatMessage(
        String(Date.now()),
        activeConversation.value.id,
        'me',
        content
      )
      currentMessages.value.push(fallbackMsg)
      return fallbackMsg
    }
  }

  /**
   * Starts a new conversation (9.3).
   */
  const startConversation = async (command: StartConversationCommand): Promise<Conversation | null> => {
    isLoading.value = true
    error.value = null
    try {
      const conv = await api.startConversation(command)
      conversations.value.unshift(conv)
      activeConversation.value = conv
      return conv
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al iniciar la conversación.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    conversations,
    activeConversation,
    currentMessages,
    isLoading,
    error,
    hasConversations,
    fetchConversations,
    selectConversation,
    sendMessage,
    startConversation
  }
})
