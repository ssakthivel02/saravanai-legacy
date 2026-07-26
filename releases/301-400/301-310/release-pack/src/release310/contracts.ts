export interface DigitalTwinAssuranceGate {
  gateId: string;
  releaseRange: '301-310';
  evidenceDomains: string[];
  evidenceIndexSha256: string;
  approvedBy: string[];
  residualRisks: string[];
  conditions: string[];
  decision: 'pending' | 'go' | 'conditional_go' | 'no_go';
}

export const RELEASE_310_CONTROLS = ["owner_accountability_required", "evidence_integrity_required", "evidence_index_hash_required", "residual_risks_recorded", "no_go_supported", "simulation_fidelity_required"] as const;

export function validateDigitalTwinAssuranceGate(value: DigitalTwinAssuranceGate): string[] {
  const errors: string[] = [];
  if (!value.gateId.trim()) errors.push("gateId_required");
  if (!value.evidenceDomains.length) errors.push("evidenceDomains_required");
  if (!value.evidenceIndexSha256.trim()) errors.push("evidenceIndexSha256_required");
  if (!value.approvedBy.length) errors.push("approvedBy_required");
  if (!value.residualRisks.length) errors.push("residualRisks_required");
  if (!value.conditions.length) errors.push("conditions_required");
  if (!/^[a-f0-9]{64}$/i.test(value.evidenceIndexSha256)) errors.push("evidence_hash_invalid");
  if (value.approvedBy.length < 2 && value.decision !== "pending") errors.push("multi_party_approval_required");
  return [...new Set(errors)];
}
