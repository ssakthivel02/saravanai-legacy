export interface TrustComplianceGate {
  gateId: string;
  releaseRange: '281-290';
  controlEvidence: string[];
  auditEvidence: string[];
  privacyEvidence: string[];
  continuityEvidence: string[];
  decision: 'pending' | 'go' | 'conditional_go' | 'no_go';
}

export const RELEASE_290_CONTROLS = ["control_evidence_required", "audit_evidence_required", "privacy_evidence_required", "continuity_evidence_required"] as const;

export function validateTrustComplianceGate(value: TrustComplianceGate): string[] {
  const errors: string[] = [];
  if (!value.gateId.trim()) errors.push("gateId_required");
  if (!value.controlEvidence.length) errors.push("controlEvidence_required");
  if (!value.auditEvidence.length) errors.push("auditEvidence_required");
  if (!value.privacyEvidence.length) errors.push("privacyEvidence_required");
  if (!value.continuityEvidence.length) errors.push("continuityEvidence_required");
  return [...new Set(errors)];
}
