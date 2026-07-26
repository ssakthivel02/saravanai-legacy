import type { DecisionRecord } from "./model";

export const RELEASE_067_CONTROL_RULES = ["outcome_required", "alternatives_recorded", "evidence_required", "explanation_required", "owner_required", "confidence_range"] as const;

export function validateDecisionRecord(input: DecisionRecord): string[] {
  const errors: string[] = [];
  if (!String(input.decisionId ?? "").trim()) errors.push("decisionId_required");
  if (!input.evidenceIds.length) errors.push("evidenceIds_required");
  if (input.confidence < 0 || input.confidence > 1) errors.push("confidence_out_of_range");
  if (!input.evidenceIds.length) errors.push("evidence_required");
  return [...new Set(errors)];
}

export function release067Ready(input: DecisionRecord): boolean {
  return validateDecisionRecord(input).length === 0;
}
