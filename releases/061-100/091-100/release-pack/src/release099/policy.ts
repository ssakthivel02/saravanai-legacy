import type { EvidencePackage } from "./model";

export const RELEASE_099_CONTROL_RULES = ["controls_required", "evidence_required", "checksum_index_required", "certification_claim_must_be_false", "external_assessment_separate"] as const;

export function validateEvidencePackage(input: EvidencePackage): string[] {
  const errors: string[] = [];
  if (!String(input.packageId ?? "").trim()) errors.push("packageId_required");
  if (!input.controlIds.length) errors.push("controlIds_required");
  if (!input.evidenceIds.length) errors.push("evidenceIds_required");
  if (input.certificationClaim !== false) errors.push("certificationClaim_must_be_false");
  if (!input.evidenceIds.length) errors.push("evidence_required");
  if (input.certificationClaim !== false) errors.push("unsupported_certification_claim");
  return [...new Set(errors)];
}

export function release099Ready(input: EvidencePackage): boolean {
  return validateEvidencePackage(input).length === 0;
}
