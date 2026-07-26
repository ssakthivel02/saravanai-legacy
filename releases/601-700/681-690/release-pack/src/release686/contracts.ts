export interface PolicyExceptionAndRiskAcceptanceV2 {
  decisionId: string;
  accountableOwner: string;
  alternatives: string[];
  evidenceRefs: string[];
  conflictDeclarations: string[];
  conditions: string[];
  approvedBy: string[];
  reviewAt: string;
  decision: 'pending' | 'go' | 'conditional_go' | 'no_go';
}

export const RELEASE_686_CONTROLS = ["owner_accountability_required", "evidence_integrity_required", "alternatives_required", "conflicts_declared", "multi_party_approval_required"] as const;

export function validatePolicyExceptionAndRiskAcceptanceV2(value: PolicyExceptionAndRiskAcceptanceV2): string[] {
  const errors: string[] = [];
  if (!value.decisionId.trim()) errors.push("decisionId_required");
  if (!value.accountableOwner.trim()) errors.push("accountableOwner_required");
  if (!value.alternatives.length) errors.push("alternatives_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.conflictDeclarations.length) errors.push("conflictDeclarations_required");
  if (!value.conditions.length) errors.push("conditions_required");
  if (!value.approvedBy.length) errors.push("approvedBy_required");
  if (!value.reviewAt.trim()) errors.push("reviewAt_required");
  if (value.approvedBy.length < 2 && value.decision !== "pending") errors.push("multi_party_approval_required");
  return [...new Set(errors)];
}
