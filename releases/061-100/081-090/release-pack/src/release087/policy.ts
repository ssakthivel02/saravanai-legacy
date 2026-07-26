import type { RegulatoryObligation } from "./model";

export const RELEASE_087_CONTROL_RULES = ["official_source_required", "jurisdiction_required", "effective_date_required", "uncertain_requires_legal_review", "control_mapping_required"] as const;

export function validateRegulatoryObligation(input: RegulatoryObligation): string[] {
  const errors: string[] = [];
  if (!String(input.obligationId ?? "").trim()) errors.push("obligationId_required");
  if (!input.controlIds.length) errors.push("controlIds_required");
  return [...new Set(errors)];
}

export function release087Ready(input: RegulatoryObligation): boolean {
  return validateRegulatoryObligation(input).length === 0;
}
