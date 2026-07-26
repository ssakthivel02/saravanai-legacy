export interface ImpactAssessment {
  assessmentId: string;
  energyEstimate: number;
  accessibilityEvidence: string[];
  communityRisks: string[];
  mitigations: string[];
  owner: string;
}

export const RELEASE_179_CONTROLS = ["energy_estimate_recorded", "accessibility_evidence_required", "mitigations_required"] as const;

export function validateImpactAssessment(value: ImpactAssessment): string[] {
  const errors: string[] = [];
  if (!value.assessmentId.trim()) errors.push("assessmentId_required");
  if (!Number.isFinite(value.energyEstimate) || value.energyEstimate < 0) errors.push("energyEstimate_invalid");
  if (!value.accessibilityEvidence.length) errors.push("accessibilityEvidence_required");
  if (!value.communityRisks.length) errors.push("communityRisks_required");
  if (!value.mitigations.length) errors.push("mitigations_required");
  if (!value.owner.trim()) errors.push("owner_required");
  return [...new Set(errors)];
}
