export interface ServiceAssuranceGate {
  gateId: string;
  releaseRange: '151-160';
  serviceEvidence: string[];
  supplierEvidence: string[];
  privacyEvidence: string[];
  decision: 'pending' | 'go' | 'conditional_go' | 'no_go';
}

export const RELEASE_160_CONTROLS = ["service_evidence_required", "supplier_evidence_required", "privacy_evidence_required"] as const;

export function validateServiceAssuranceGate(value: ServiceAssuranceGate): string[] {
  const errors: string[] = [];
  if (!value.gateId.trim()) errors.push("gateId_required");
  if (!value.serviceEvidence.length) errors.push("serviceEvidence_required");
  if (!value.supplierEvidence.length) errors.push("supplierEvidence_required");
  if (!value.privacyEvidence.length) errors.push("privacyEvidence_required");
  return [...new Set(errors)];
}
