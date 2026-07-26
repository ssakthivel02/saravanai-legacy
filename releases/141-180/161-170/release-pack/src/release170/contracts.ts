export interface PlatformGate {
  gateId: string;
  releaseRange: '161-170';
  platformEvidence: string[];
  securityEvidence: string[];
  reliabilityEvidence: string[];
  decision: 'pending' | 'go' | 'conditional_go' | 'no_go';
}

export const RELEASE_170_CONTROLS = ["platform_evidence_required", "security_evidence_required", "reliability_evidence_required"] as const;

export function validatePlatformGate(value: PlatformGate): string[] {
  const errors: string[] = [];
  if (!value.gateId.trim()) errors.push("gateId_required");
  if (!value.platformEvidence.length) errors.push("platformEvidence_required");
  if (!value.securityEvidence.length) errors.push("securityEvidence_required");
  if (!value.reliabilityEvidence.length) errors.push("reliabilityEvidence_required");
  return [...new Set(errors)];
}
