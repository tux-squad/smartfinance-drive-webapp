import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import { BillingPlan, Subscription, Invoice } from '../domain/subscription.entity'

export interface CheckoutSessionCommand {
  stripePriceId: string
  successUrl: string
  cancelUrl: string
}

export class BillingApi extends BaseApi {
  /**
   * 8.1 List all active commercial billing plans.
   */
  public async getPlans(): Promise<BillingPlan[]> {
    const response: AxiosResponse<any[]> = await this.http.get('/api/v1/billing/plans')
    return (response.data || []).map(p => new BillingPlan(
      p.id,
      p.name,
      p.description || '',
      p.price,
      p.currency || 'USD',
      p.billingCycle || 'MONTHLY',
      p.maxVehicleListings || 100,
      p.maxSimulationsPerMonth || 500,
      p.stripePriceId
    ))
  }

  /**
   * 8.4 Get current user active subscription.
   */
  public async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const response: AxiosResponse<any> = await this.http.get('/api/v1/billing/subscriptions/me')
      if (!response.data) return null
      return new Subscription(
        response.data.id,
        response.data.planId,
        response.data.status || 'ACTIVE',
        response.data.autoRenew ?? true,
        response.data.currentPeriodEnd,
        response.data.plan ? new BillingPlan(
          response.data.plan.id,
          response.data.plan.name,
          response.data.plan.description || '',
          response.data.plan.price,
          response.data.plan.currency || 'USD'
        ) : undefined
      )
    } catch {
      return null
    }
  }

  /**
   * 8.8 Get current user invoices.
   */
  public async getInvoices(): Promise<Invoice[]> {
    try {
      const response: AxiosResponse<any[]> = await this.http.get('/api/v1/billing/invoices/me')
      return (response.data || []).map(inv => new Invoice(
        inv.id,
        inv.amount,
        inv.currency || 'USD',
        inv.status || 'PAID',
        inv.createdAt
      ))
    } catch {
      return []
    }
  }

  /**
   * 8.7 Create a Stripe checkout session for payment method / plan upgrade.
   */
  public async createCheckoutSession(command: CheckoutSessionCommand): Promise<string> {
    const response: AxiosResponse<{ checkoutUrl: string }> = await this.http.post(
      '/api/v1/billing/subscriptions/checkout-session',
      command
    )
    return response.data.checkoutUrl
  }

  /**
   * 8.5 Create a direct subscription.
   */
  public async createSubscription(planId: number, autoRenew: boolean = true): Promise<Subscription> {
    const response: AxiosResponse<any> = await this.http.post('/api/v1/billing/subscriptions', {
      planId,
      autoRenew
    })
    return new Subscription(
      response.data.id,
      response.data.planId,
      response.data.status || 'ACTIVE',
      response.data.autoRenew ?? true
    )
  }

  /**
   * 8.6 Cancel active subscription.
   */
  public async cancelSubscription(subscriptionId: number): Promise<boolean> {
    const response: AxiosResponse<any> = await this.http.delete(`/api/v1/billing/subscriptions/${subscriptionId}`)
    return response.data?.status === 'CANCELLED'
  }
}
