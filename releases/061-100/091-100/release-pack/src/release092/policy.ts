import type { RemediationPlan } from "./model";

export const RELEASE_092_CONTROL_RULES = ["trigger_required", "actions_required", "rollback_required", "high_risk_approval_required", "critical_action_manual_only"] as const;

export function validateRemediationPlan(input: RemediationPlan): string[] {
  const errors: string[] = [];
  if (!String(input.planId ?? "").trim()) errors.push("planId_required");
  if (!input.actions.length) errors.push("actions_required");
  return [...new Set(errors)];
}

export function release092Ready(input: RemediationPlan): boolean {
  return validateRemediationPlan(input).length === 0;
}
