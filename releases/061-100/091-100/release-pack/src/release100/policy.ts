import type { EnterpriseLaunchDecision } from "./model";

export const RELEASE_100_CONTROL_RULES = ["all_mandatory_domains_pass_for_go", "evidence_index_required", "rollback_required", "conditional_go_requires_expiring_exceptions", "multiple_owner_approvals_required"] as const;

export function validateEnterpriseLaunchDecision(input: EnterpriseLaunchDecision): string[] {
  const errors: string[] = [];
  if (!String(input.decisionId ?? "").trim()) errors.push("decisionId_required");
  if ((input as any).status === "approved" && !input.approvedBy) errors.push("approved_by_required");
  return [...new Set(errors)];
}

export function release100Ready(input: EnterpriseLaunchDecision): boolean {
  return validateEnterpriseLaunchDecision(input).length === 0;
}
