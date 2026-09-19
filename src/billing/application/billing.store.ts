import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { BillingApi } from '../infrastructure/billing-api'
import { BillingPlan, Subscription, Invoice } from '../domain/subscription.entity'

const billingApi = new BillingApi()

export const useBillingStore = defineStore('billing', () => {
  const plans = ref<BillingPlan[]>([])
  const currentSubscription = ref<Subscription | null>(null)
  const invoices = ref<Invoice[]>([])
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

      plans.value = plansData
      currentSubscription.value = subData
      invoices.value = invoicesData
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener la información de suscripción.'
    } finally {
      isLoading.value = false
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

  return {
    plans,
    currentSubscription,
    invoices,
    isLoading,
    error,
    hasSubscription,
    activePlan,
    fetchBillingData,
    getCheckoutUrl,
    cancelCurrentSubscription
  }
})
