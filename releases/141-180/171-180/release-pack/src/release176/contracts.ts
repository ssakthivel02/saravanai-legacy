export interface ProductExperiment {
  experimentId: string;
  hypothesis: string;
  cohorts: string[];
  consentRequired: boolean;
  stopRules: string[];
  ethicalReviewId: string | undefined;
}

export const RELEASE_176_CONTROLS = ["hypothesis_required", "stop_rules_required", "high_risk_ethics_review"] as const;

export function validateProductExperiment(value: ProductExperiment): string[] {
  const errors: string[] = [];
  if (!value.experimentId.trim()) errors.push("experimentId_required");
  if (!value.hypothesis.trim()) errors.push("hypothesis_required");
  if (!value.cohorts.length) errors.push("cohorts_required");
  if (!value.stopRules.length) errors.push("stopRules_required");
  return [...new Set(errors)];
}
