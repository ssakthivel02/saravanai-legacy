export interface ExperienceGate {
  gateId: string;
  releaseRange: '141-150';
  securityEvidence: string[];
  accessibilityEvidence: string[];
  localisationEvidence: string[];
  decision: 'pending' | 'go' | 'conditional_go' | 'no_go';
}

export const RELEASE_150_CONTROLS = ["security_evidence_required", "accessibility_evidence_required", "localisation_evidence_required"] as const;

export function validateExperienceGate(value: ExperienceGate): string[] {
  const errors: string[] = [];
  if (!value.gateId.trim()) errors.push("gateId_required");
  if (!value.securityEvidence.length) errors.push("securityEvidence_required");
  if (!value.accessibilityEvidence.length) errors.push("accessibilityEvidence_required");
  if (!value.localisationEvidence.length) errors.push("localisationEvidence_required");
  return [...new Set(errors)];
}
