import type { SupportCase } from "./model";

export const RELEASE_073_CONTROL_RULES = ["owner_required", "sla_required", "p1_immediate_escalation", "sensitive_evidence_restricted", "closure_requires_resolution"] as const;

export function validateSupportCase(input: SupportCase): string[] {
  const errors: string[] = [];
  if (!String(input.caseId ?? "").trim()) errors.push("caseId_required");
  if (!input.evidenceIds.length) errors.push("evidenceIds_required");
  if (!input.evidenceIds.length) errors.push("evidence_required");
  return [...new Set(errors)];
}

export function release073Ready(input: SupportCase): boolean {
  return validateSupportCase(input).length === 0;
}
