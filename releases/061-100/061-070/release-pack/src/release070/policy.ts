import type { IntelligenceGate } from "./model";

export const RELEASE_070_CONTROL_RULES = ["all_mandatory_domains_pass", "evidence_required", "waiver_requires_risk_acceptance", "owner_approval_required"] as const;

export function validateIntelligenceGate(input: IntelligenceGate): string[] {
  const errors: string[] = [];
  if (!String(input.gateId ?? "").trim()) errors.push("gateId_required");
  if (!input.evidenceIds.length) errors.push("evidenceIds_required");
  if ((input as any).status === "approved" && !input.approvedBy) errors.push("approved_by_required");
  if (!input.evidenceIds.length) errors.push("evidence_required");
  return [...new Set(errors)];
}

export function release070Ready(input: IntelligenceGate): boolean {
  return validateIntelligenceGate(input).length === 0;
}
