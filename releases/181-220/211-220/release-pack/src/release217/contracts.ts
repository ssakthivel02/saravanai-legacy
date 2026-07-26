export interface TechnologyEvaluation {
  evaluationId: string;
  candidate: string;
  owner: string;
  requirementScores: Record<string, number>;
  securityEvidence: string[];
  privacyEvidence: string[];
  exitPlanId: string;
  decision: 'shortlist' | 'approve' | 'reject';
}

export const RELEASE_217_CONTROLS = ["requirements_scored", "security_evidence_required", "privacy_evidence_required", "exit_plan_required"] as const;

export function validateTechnologyEvaluation(value: TechnologyEvaluation): string[] {
  const errors: string[] = [];
  if (!value.evaluationId.trim()) errors.push("evaluationId_required");
  if (!value.candidate.trim()) errors.push("candidate_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.securityEvidence.length) errors.push("securityEvidence_required");
  if (!value.privacyEvidence.length) errors.push("privacyEvidence_required");
  if (!value.exitPlanId.trim()) errors.push("exitPlanId_required");
  return [...new Set(errors)];
}
