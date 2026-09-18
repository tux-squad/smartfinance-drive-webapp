/**
 * Command DTO for triggering a credit score evaluation for a client profile.
 */
export class EvaluateScoreCommand {
  constructor(public readonly profileId: string) {}
}
