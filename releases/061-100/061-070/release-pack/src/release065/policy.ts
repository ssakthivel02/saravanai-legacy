import type { EvidenceClaim } from "./model";

export const RELEASE_065_CONTROL_RULES = ["claim_required", "source_required", "confidence_range", "current_fact_verification_required", "confirmed_contradiction_blocks_publish"] as const;

export function validateEvidenceClaim(input: EvidenceClaim): string[] {
  const errors: string[] = [];
  if (!String(input.claimId ?? "").trim()) errors.push("claimId_required");
  if (!input.sourceIds.length) errors.push("sourceIds_required");
  if (input.confidence < 0 || input.confidence > 1) errors.push("confidence_out_of_range");
  if (!input.sourceIds.length) errors.push("source_required");
  return [...new Set(errors)];
}

export function release065Ready(input: EvidenceClaim): boolean {
  return validateEvidenceClaim(input).length === 0;
}
