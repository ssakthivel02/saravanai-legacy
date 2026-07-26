export interface CustomerSuccessPlan {
  planId: string;
  tenantId: string;
  successOwner: string;
  goals: string[];
  readinessChecks: string[];
  riskFlags: string[];
}

export const RELEASE_154_CONTROLS = ["success_owner_required", "goals_required", "risk_review_required"] as const;

export function validateCustomerSuccessPlan(value: CustomerSuccessPlan): string[] {
  const errors: string[] = [];
  if (!value.planId.trim()) errors.push("planId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.successOwner.trim()) errors.push("successOwner_required");
  if (!value.goals.length) errors.push("goals_required");
  if (!value.readinessChecks.length) errors.push("readinessChecks_required");
  if (!value.riskFlags.length) errors.push("riskFlags_required");
  return [...new Set(errors)];
}
