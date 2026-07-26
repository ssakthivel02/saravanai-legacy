export interface DataIntegrationGate {
  gateId: string;
  releaseRange: '191-200';
  dataEvidence: string[];
  qualityEvidence: string[];
  privacyEvidence: string[];
  integrationEvidence: string[];
  decision: 'pending' | 'go' | 'conditional_go' | 'no_go';
}

export const RELEASE_200_CONTROLS = ["data_evidence_required", "quality_evidence_required", "privacy_evidence_required", "integration_evidence_required"] as const;

export function validateDataIntegrationGate(value: DataIntegrationGate): string[] {
  const errors: string[] = [];
  if (!value.gateId.trim()) errors.push("gateId_required");
  if (!value.dataEvidence.length) errors.push("dataEvidence_required");
  if (!value.qualityEvidence.length) errors.push("qualityEvidence_required");
  if (!value.privacyEvidence.length) errors.push("privacyEvidence_required");
  if (!value.integrationEvidence.length) errors.push("integrationEvidence_required");
  return [...new Set(errors)];
}
