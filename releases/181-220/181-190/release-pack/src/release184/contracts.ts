export interface CorpusVersion {
  corpusId: string;
  tenantId: string;
  version: string;
  sourceRefs: string[];
  accessPolicyId: string;
  freshnessAt: string;
  indexStatus: 'building' | 'ready' | 'stale' | 'retired';
}

export const RELEASE_184_CONTROLS = ["source_provenance_required", "access_policy_required", "freshness_recorded", "retirement_supported"] as const;

export function validateCorpusVersion(value: CorpusVersion): string[] {
  const errors: string[] = [];
  if (!value.corpusId.trim()) errors.push("corpusId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.version.trim()) errors.push("version_required");
  if (!value.sourceRefs.length) errors.push("sourceRefs_required");
  if (!value.accessPolicyId.trim()) errors.push("accessPolicyId_required");
  if (!value.freshnessAt.trim()) errors.push("freshnessAt_required");
  return [...new Set(errors)];
}
