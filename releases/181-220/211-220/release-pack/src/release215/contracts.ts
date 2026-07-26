export interface InnovationInitiative {
  initiativeId: string;
  owner: string;
  hypothesis: string;
  experimentIds: string[];
  budgetPence: number;
  ethicalReviewId: string | undefined;
  decision: 'continue' | 'scale' | 'pause' | 'stop';
}

export const RELEASE_215_CONTROLS = ["owner_required", "hypothesis_required", "budget_bounded", "ethical_review_for_high_risk"] as const;

export function validateInnovationInitiative(value: InnovationInitiative): string[] {
  const errors: string[] = [];
  if (!value.initiativeId.trim()) errors.push("initiativeId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.hypothesis.trim()) errors.push("hypothesis_required");
  if (!value.experimentIds.length) errors.push("experimentIds_required");
  if (!Number.isFinite(value.budgetPence) || value.budgetPence < 0) errors.push("budgetPence_invalid");
  return [...new Set(errors)];
}
