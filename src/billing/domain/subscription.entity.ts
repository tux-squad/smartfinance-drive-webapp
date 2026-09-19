/**
 * Domain Entity representing a Billing Plan in SmartFinance Drive Platform.
 */
export class BillingPlan {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly currency: string = 'USD',
    public readonly billingCycle: string = 'MONTHLY',
    public readonly maxVehicleListings: number = 100,
    public readonly maxSimulationsPerMonth: number = 500,
    public readonly stripePriceId?: string
  ) {}
}

/**
 * Domain Entity representing an active user Subscription.
 */
export class Subscription {
  constructor(
    public readonly id: number,
    public readonly planId: number,
    public readonly status: string,
    public readonly autoRenew: boolean = true,
    public readonly currentPeriodEnd?: string,
    public readonly plan?: BillingPlan
  ) {}

  get isActive(): boolean {
    return this.status === 'ACTIVE'
  }
}

/**
 * Domain Entity representing a Billing Invoice.
 */
export class Invoice {
  constructor(
    public readonly id: number,
    public readonly amount: number,
    public readonly currency: string = 'USD',
    public readonly status: string = 'PAID',
    public readonly createdAt?: string,
    public readonly pdfUrl?: string
  ) {}
}

/**
 * Domain Entity representing Dealer B2B Performance & ROI Metrics.
 */
export class DealerMetrics {
  constructor(
    public readonly totalLeadsGenerated: number,
    public readonly conversionRate: number,
    public readonly totalVehicleViews: number,
    public readonly membershipRoi: string,
    public readonly activeListingsCount: number,
    public readonly period: string = 'LAST_30_DAYS'
  ) {}
}
