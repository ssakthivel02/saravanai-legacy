export interface VulnerabilityRecord {
  vulnerabilityId: string;
  assetRefs: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  exploitKnown: boolean;
  owner: string;
  remediationDueAt: string;
  exceptionId: string | undefined;
  status: 'open' | 'mitigated' | 'closed';
}

export const RELEASE_203_CONTROLS = ["assets_required", "severity_required", "owner_required", "sla_required"] as const;

export function validateVulnerabilityRecord(value: VulnerabilityRecord): string[] {
  const errors: string[] = [];
  if (!value.vulnerabilityId.trim()) errors.push("vulnerabilityId_required");
  if (!value.assetRefs.length) errors.push("assetRefs_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.remediationDueAt.trim()) errors.push("remediationDueAt_required");
  return [...new Set(errors)];
}
