export interface TrustResilienceGate {
  gateId: string;
  releaseRange: '201-210';
  securityEvidence: string[];
  regionalEvidence: string[];
  recoveryEvidence: string[];
  transparencyEvidence: string[];
  decision: 'pending' | 'go' | 'conditional_go' | 'no_go';
}

export const RELEASE_210_CONTROLS = ["security_evidence_required", "regional_evidence_required", "recovery_evidence_required", "transparency_evidence_required"] as const;

export function validateTrustResilienceGate(value: TrustResilienceGate): string[] {
  const errors: string[] = [];
  if (!value.gateId.trim()) errors.push("gateId_required");
  if (!value.securityEvidence.length) errors.push("securityEvidence_required");
  if (!value.regionalEvidence.length) errors.push("regionalEvidence_required");
  if (!value.recoveryEvidence.length) errors.push("recoveryEvidence_required");
  if (!value.transparencyEvidence.length) errors.push("transparencyEvidence_required");
  return [...new Set(errors)];
}
