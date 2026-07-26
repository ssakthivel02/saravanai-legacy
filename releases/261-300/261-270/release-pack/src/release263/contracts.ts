export interface DecisionTable {
  tableId: string;
  version: string;
  owner: string;
  ruleIds: string[];
  testCaseIds: string[];
  effectiveFrom: string;
  approvedBy: string | undefined;
  status: 'draft' | 'approved' | 'retired';
}

export const RELEASE_263_CONTROLS = ["owner_required", "rules_required", "tests_required", "approval_required"] as const;

export function validateDecisionTable(value: DecisionTable): string[] {
  const errors: string[] = [];
  if (!value.tableId.trim()) errors.push("tableId_required");
  if (!value.version.trim()) errors.push("version_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.ruleIds.length) errors.push("ruleIds_required");
  if (!value.testCaseIds.length) errors.push("testCaseIds_required");
  if (!value.effectiveFrom.trim()) errors.push("effectiveFrom_required");
  return [...new Set(errors)];
}
