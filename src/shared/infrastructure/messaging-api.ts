import { BaseApi } from './base-api'
import type { AxiosResponse } from 'axios'
import { Conversation, ChatMessage } from '../domain/conversation.entity'

export interface StartConversationCommand {
  dealerUserId: string
  vehicleId?: string
  initialMessage: string
}

/**
 * Infrastructure API Gateway for Messaging & Conversations (API Section 9).
 */
export class MessagingApi extends BaseApi {
  /**
   * 9.1 List active conversations for current user.
   * GET /api/v1/conversations
   */
  public async getConversations(): Promise<Conversation[]> {
    const response: AxiosResponse<any[]> = await this.http.get('/api/v1/conversations')
    const list = Array.isArray(response.data) ? response.data : []
    return list.map((c: any) => new Conversation(
      c.id,
      c.buyerUserId,
      c.dealerUserId,
      c.vehicleId || null,
      c.lastMessageContent || null,
      c.lastMessageTimestamp || c.createdAt || new Date().toISOString(),
      Number(c.unreadBuyerCount) || 0,
      Number(c.unreadDealerCount) || 0,
      c.active ?? true,
      c.createdAt || new Date().toISOString(),
      c.dealerName,
      c.vehicleTitle,
      c.vehiclePrice
    ))
  }

  /**
   * 9.2 Get message history for a conversation.
   * GET /api/v1/conversations/{id}/messages
   */
  public async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    const response: AxiosResponse<any[]> = await this.http.get(`/api/v1/conversations/${conversationId}/messages`)
    const list = Array.isArray(response.data) ? response.data : []
    return list.map((m: any) => new ChatMessage(
      m.id || String(Date.now()),
      conversationId,
      m.senderUserId || 'unknown',
      m.content || '',
      m.createdAt || new Date().toISOString()
    ))
  }

  /**
   * 9.3 Start new conversation.
   * POST /api/v1/conversations
   */
  public async startConversation(command: StartConversationCommand): Promise<Conversation> {
    const response: AxiosResponse<any> = await this.http.post('/api/v1/conversations', command)
    const c = response.data
    return new Conversation(
      c.id,
      c.buyerUserId,
      c.dealerUserId,
      c.vehicleId || null,
      c.lastMessageContent || command.initialMessage,
      c.lastMessageTimestamp || new Date().toISOString(),
      Number(c.unreadBuyerCount) || 0,
      Number(c.unreadDealerCount) || 0,
      c.active ?? true,
      c.createdAt || new Date().toISOString(),
      c.dealerName,
      c.vehicleTitle,
      c.vehiclePrice
    )
  }

  /**
   * 9.4 Send message in existing conversation.
   * POST /api/v1/conversations/{id}/messages
   */
  public async sendMessage(conversationId: string, content: string): Promise<ChatMessage> {
    const response: AxiosResponse<any> = await this.http.post(`/api/v1/conversations/${conversationId}/messages`, {
      content
    })
    const m = response.data
    return new ChatMessage(
      m.id || String(Date.now()),
      conversationId,
      m.senderUserId || 'me',
      m.content || content,
      m.createdAt || new Date().toISOString()
    )
  }
}
