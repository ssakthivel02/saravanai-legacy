export interface ScaleClosure {
  closureId: string;
  releaseRange: '141-180';
  evidenceIndexSha256: string;
  approvedBy: string[];
  residualRisks: string[];
  decision: 'pending' | 'closed' | 'rejected';
}

export const RELEASE_180_CONTROLS = ["evidence_hash_required", "multi_party_approval_required", "residual_risks_recorded"] as const;

export function validateScaleClosure(value: ScaleClosure): string[] {
  const errors: string[] = [];
  if (!value.closureId.trim()) errors.push("closureId_required");
  if (!value.evidenceIndexSha256.trim()) errors.push("evidenceIndexSha256_required");
  if (!value.approvedBy.length) errors.push("approvedBy_required");
  if (!value.residualRisks.length) errors.push("residualRisks_required");
  if (!/^[a-f0-9]{64}$/i.test(value.evidenceIndexSha256)) errors.push("evidence_hash_invalid");
  return [...new Set(errors)];
}
