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
 * Domain Entity representing an active user Subscription (API Doc 2.49).
 */
export class Subscription {
  public readonly id: number
  public readonly status: string
  public readonly autoRenew: boolean
  public readonly endDate?: string
  public readonly plan?: BillingPlan
  private readonly _planId?: number
  private readonly _legacyPeriodEnd?: string

  constructor(
    id: number,
    planId: number,
    status: string,
    autoRenew: boolean = true,
    endDate?: string,
    plan?: BillingPlan
  ) {
    this.id = id
    this._planId = planId
    this.status = status
    this.autoRenew = autoRenew
    this.endDate = endDate
    this._legacyPeriodEnd = endDate
    this.plan = plan
  }

  get planId(): number {
    return this.plan?.id || this._planId || 1
  }

  get currentPeriodEnd(): string | undefined {
    return this.endDate || this._legacyPeriodEnd
  }

  get isActive(): boolean {
    return this.status === 'ACTIVE'
  }
}

/**
 * Domain Entity representing a Billing Invoice (API Doc 2.53).
 */
export class Invoice {
  public readonly id: number
  public readonly amount: number
  public readonly currency: string
  public readonly status: string
  public readonly issuedAt?: string
  public readonly pdfUrl?: string
  private readonly _legacyCreatedAt?: string

  constructor(
    id: number,
    amount: number,
    currency: string = 'USD',
    status: string = 'PAID',
    issuedAt?: string,
    pdfUrl?: string
  ) {
    this.id = id
    this.amount = amount
    this.currency = currency
    this.status = status
    this.issuedAt = issuedAt
    this._legacyCreatedAt = issuedAt
    this.pdfUrl = pdfUrl
  }

  get createdAt(): string | undefined {
    return this.issuedAt || this._legacyCreatedAt
  }
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
