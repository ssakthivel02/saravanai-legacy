export interface BoardDecision {
  decisionId: string;
  title: string;
  accountableOwner: string;
  alternatives: string[];
  evidenceRefs: string[];
  conflictDeclarations: string[];
  approvedBy: string[];
  reviewAt: string;
}

export const RELEASE_214_CONTROLS = ["accountable_owner_required", "alternatives_recorded", "conflicts_declared", "multi_party_approval"] as const;

export function validateBoardDecision(value: BoardDecision): string[] {
  const errors: string[] = [];
  if (!value.decisionId.trim()) errors.push("decisionId_required");
  if (!value.title.trim()) errors.push("title_required");
  if (!value.accountableOwner.trim()) errors.push("accountableOwner_required");
  if (!value.alternatives.length) errors.push("alternatives_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.conflictDeclarations.length) errors.push("conflictDeclarations_required");
  if (!value.approvedBy.length) errors.push("approvedBy_required");
  if (!value.reviewAt.trim()) errors.push("reviewAt_required");
  return [...new Set(errors)];
}
