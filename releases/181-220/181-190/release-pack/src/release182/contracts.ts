export interface PromptPolicyVersion {
  policyId: string;
  version: string;
  owner: string;
  contentHash: string;
  testSuiteIds: string[];
  approvedBy: string | undefined;
  effectiveFrom: string;
  retiredAt: string | undefined;
}

export const RELEASE_182_CONTROLS = ["owner_required", "content_hash_required", "tests_before_approval", "rollback_version_required"] as const;

export function validatePromptPolicyVersion(value: PromptPolicyVersion): string[] {
  const errors: string[] = [];
  if (!value.policyId.trim()) errors.push("policyId_required");
  if (!value.version.trim()) errors.push("version_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.contentHash.trim()) errors.push("contentHash_required");
  if (!value.testSuiteIds.length) errors.push("testSuiteIds_required");
  if (!value.effectiveFrom.trim()) errors.push("effectiveFrom_required");
  if (!/^[a-f0-9]{64}$/i.test(value.contentHash)) errors.push("content_hash_invalid");
  return [...new Set(errors)];
}
