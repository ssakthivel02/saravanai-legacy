import type { EcosystemGate } from "./model";

export const RELEASE_080_CONTROL_RULES = ["all_capabilities_pass", "evidence_required", "supplier_risk_resolved", "owner_approval_required"] as const;

export function validateEcosystemGate(input: EcosystemGate): string[] {
  const errors: string[] = [];
  if (!String(input.gateId ?? "").trim()) errors.push("gateId_required");
  if (!input.evidenceIds.length) errors.push("evidenceIds_required");
  if ((input as any).status === "approved" && !input.approvedBy) errors.push("approved_by_required");
  if (!input.evidenceIds.length) errors.push("evidence_required");
  return [...new Set(errors)];
}

export function release080Ready(input: EcosystemGate): boolean {
  return validateEcosystemGate(input).length === 0;
}
