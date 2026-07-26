export interface GaReadinessDecision {
  decisionId: string;
  releaseId: string;
  accountableOwner: string;
  evidenceDomains: string[];
  residualRisks: string[];
  conditions: string[];
  approvedBy: string[];
  decision: 'pending' | 'go' | 'conditional_go' | 'no_go';
}

export const RELEASE_299_CONTROLS = ["accountable_owner_required", "evidence_domains_required", "residual_risks_recorded", "multi_party_approval"] as const;

export function validateGaReadinessDecision(value: GaReadinessDecision): string[] {
  const errors: string[] = [];
  if (!value.decisionId.trim()) errors.push("decisionId_required");
  if (!value.releaseId.trim()) errors.push("releaseId_required");
  if (!value.accountableOwner.trim()) errors.push("accountableOwner_required");
  if (!value.evidenceDomains.length) errors.push("evidenceDomains_required");
  if (!value.residualRisks.length) errors.push("residualRisks_required");
  if (!value.conditions.length) errors.push("conditions_required");
  if (!value.approvedBy.length) errors.push("approvedBy_required");
  return [...new Set(errors)];
}
