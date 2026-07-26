export interface ContractObligation {
  obligationId: string;
  contractId: string;
  owner: string;
  objective: string;
  dueAt: string;
  evidenceRefs: string[];
  status: 'open' | 'met' | 'breached' | 'waived';
}

export const RELEASE_153_CONTROLS = ["owner_required", "due_date_required", "evidence_required"] as const;

export function validateContractObligation(value: ContractObligation): string[] {
  const errors: string[] = [];
  if (!value.obligationId.trim()) errors.push("obligationId_required");
  if (!value.contractId.trim()) errors.push("contractId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.objective.trim()) errors.push("objective_required");
  if (!value.dueAt.trim()) errors.push("dueAt_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  return [...new Set(errors)];
}
