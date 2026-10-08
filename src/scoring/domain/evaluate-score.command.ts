/**
 * Command DTO for triggering a credit score evaluation for a client profile (API Doc 2.28).
 */
export class EvaluateScoreCommand {
  constructor(
    public readonly profileId: string,
    public readonly simulationId?: string,
    public readonly monthlyIncomeAmount?: number,
    public readonly projectedMonthlyInstallmentAmount?: number,
    public readonly currency?: string
  ) {}
}
