export interface KnowledgeExperienceGate {
  gateId: string;
  releaseRange: '271-280';
  provenanceEvidence: string[];
  editorialEvidence: string[];
  safetyEvidence: string[];
  accessibilityEvidence: string[];
  decision: 'pending' | 'go' | 'conditional_go' | 'no_go';
}

export const RELEASE_280_CONTROLS = ["provenance_evidence_required", "editorial_evidence_required", "safety_evidence_required", "accessibility_evidence_required"] as const;

export function validateKnowledgeExperienceGate(value: KnowledgeExperienceGate): string[] {
  const errors: string[] = [];
  if (!value.gateId.trim()) errors.push("gateId_required");
  if (!value.provenanceEvidence.length) errors.push("provenanceEvidence_required");
  if (!value.editorialEvidence.length) errors.push("editorialEvidence_required");
  if (!value.safetyEvidence.length) errors.push("safetyEvidence_required");
  if (!value.accessibilityEvidence.length) errors.push("accessibilityEvidence_required");
  return [...new Set(errors)];
}
