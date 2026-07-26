export interface AgentMemoryScopeAndExpiry {
  policyId: string;
  version: string;
  owner: string;
  ruleIds: string[];
  testCaseIds: string[];
  exceptionIds: string[];
  approvedBy: string | undefined;
  effectiveFrom: string;
  status: 'draft' | 'approved' | 'retired';
}

export const RELEASE_616_CONTROLS = ["owner_accountability_required", "evidence_integrity_required", "tests_before_approval", "exception_governance_required", "bounded_agent_authority_required", "memory_scope_and_expiry_required"] as const;

export function validateAgentMemoryScopeAndExpiry(value: AgentMemoryScopeAndExpiry): string[] {
  const errors: string[] = [];
  if (!value.policyId.trim()) errors.push("policyId_required");
  if (!value.version.trim()) errors.push("version_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.ruleIds.length) errors.push("ruleIds_required");
  if (!value.testCaseIds.length) errors.push("testCaseIds_required");
  if (!value.exceptionIds.length) errors.push("exceptionIds_required");
  if (!value.effectiveFrom.trim()) errors.push("effectiveFrom_required");
  return [...new Set(errors)];
}
