/**
 * Chat message within a conversation.
 */
export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly senderUserId: string,
    public readonly content: string,
    public readonly createdAt: string = new Date().toISOString()
  ) {}

  get formattedTime(): string {
    try {
      const d = new Date(this.createdAt)
      return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return this.createdAt
    }
  }
}

/**
 * Domain entity representing an active conversation between Buyer and Dealer.
 */
export class Conversation {
  constructor(
    public readonly id: string,
    public readonly buyerUserId: string,
    public readonly dealerUserId: string,
    public readonly vehicleId: string | null,
    public readonly lastMessageContent: string | null = null,
    public readonly lastMessageTimestamp: string = new Date().toISOString(),
    public readonly unreadBuyerCount: number = 0,
    public readonly unreadDealerCount: number = 0,
    public readonly active: boolean = true,
    public readonly createdAt: string = new Date().toISOString(),
    public readonly dealerName?: string,
    public readonly vehicleTitle?: string,
    public readonly vehiclePrice?: string
  ) {}

  get lastActivity(): string {
    try {
      const d = new Date(this.lastMessageTimestamp)
      const diffMs = Date.now() - d.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      if (diffMins < 1) return 'Ahora'
      if (diffMins < 60) return `Hace ${diffMins} min`
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) return `Hace ${diffHours} h`
      return d.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' })
    } catch {
      return 'Hoy'
    }
  }
}
