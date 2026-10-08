import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { BillingApi } from '../infrastructure/billing-api'
import { BillingPlan, Subscription, Invoice, DealerMetrics } from '../domain/subscription.entity'

const billingApi = new BillingApi()

export const useBillingStore = defineStore('billing', () => {
  const plans = ref<BillingPlan[]>([])
  const currentSubscription = ref<Subscription | null>(null)
  const invoices = ref<Invoice[]>([])
  const dealerMetrics = ref<DealerMetrics | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const hasSubscription = computed(() => !!currentSubscription.value)
  const activePlan = computed(() => {
    if (currentSubscription.value && plans.value.length > 0) {
      return plans.value.find(p => p.id === currentSubscription.value?.planId) || plans.value[0]
    }
    return plans.value[0] || null
  })

  const fetchBillingData = async (): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      const [plansData, subData, invoicesData] = await Promise.all([
        billingApi.getPlans(),
        billingApi.getCurrentSubscription(),
        billingApi.getInvoices()
      ])

      plans.value = plansData || []
      currentSubscription.value = subData
      invoices.value = invoicesData || []

      // Fetch dealer ROI metrics directly from API
      try {
        dealerMetrics.value = await billingApi.getDealerMetrics()
      } catch {
        dealerMetrics.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener la información de suscripción.'
    } finally {
      isLoading.value = false
    }
  }

  const fetchPlanDetails = async (planId: number): Promise<BillingPlan | null> => {
    try {
      return await billingApi.getPlanById(planId)
    } catch {
      return plans.value.find(p => p.id === planId) || null
    }
  }

  const downloadInvoicePdf = async (invoiceId: number): Promise<boolean> => {
    try {
      const blob = await billingApi.downloadInvoicePdf(invoiceId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `factura-${invoiceId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al descargar la factura PDF.'
      return false
    }
  }

  const reconcileInvoice = async (invoiceId: number, status: string = 'PAID'): Promise<boolean> => {
    try {
      const updated = await billingApi.reconcileInvoice(invoiceId, status)
      const idx = invoices.value.findIndex(i => i.id === invoiceId)
      if (idx !== -1) {
        invoices.value[idx] = updated
      }
      return true
    } catch {
      return false
    }
  }

  const getCheckoutUrl = async (stripePriceId?: string): Promise<string | null> => {
    isLoading.value = true
    error.value = null
    try {
      const priceId = stripePriceId || activePlan.value?.stripePriceId || 'price_1P_dealer_premium'
      const origin = window.location.origin
      const checkoutUrl = await billingApi.createCheckoutSession({
        stripePriceId: priceId,
        successUrl: `${origin}/billing?success=true`,
        cancelUrl: `${origin}/billing?canceled=true`
      })
      return checkoutUrl
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión segura de pago con Stripe.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const cancelCurrentSubscription = async (): Promise<boolean> => {
    if (!currentSubscription.value?.id) return false
    isLoading.value = true
    try {
      const success = await billingApi.cancelSubscription(currentSubscription.value.id)
      if (success) {
        currentSubscription.value = null
      }
      return success
    } catch {
      return false
    } finally {
      isLoading.value = false
    }
  }

  const createPlan = async (resource: import('../infrastructure/billing-api').CreateBillingPlanResource): Promise<BillingPlan | null> => {
    isLoading.value = true
    error.value = null
    try {
      const newPlan = await billingApi.createPlan(resource)
      plans.value.push(newPlan)
      return newPlan
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear el plan de facturación.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const triggerStripeWebhook = async (payload: any, signature?: string): Promise<string | null> => {
    try {
      return await billingApi.postStripeWebhook(payload, signature)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al procesar el webhook de Stripe.'
      return null
    }
  }

  return {
    plans,
    currentSubscription,
    invoices,
    dealerMetrics,
    isLoading,
    error,
    hasSubscription,
    activePlan,
    fetchBillingData,
    fetchPlanDetails,
    downloadInvoicePdf,
    reconcileInvoice,
    getCheckoutUrl,
    cancelCurrentSubscription,
    createPlan,
    triggerStripeWebhook
  }
})

