export interface SupportCase {
  caseId: string;
  tenantId: string;
  severity: 'sev1' | 'sev2' | 'sev3' | 'sev4';
  owner: string;
  responseDueAt: string;
  evidenceRefs: string[];
  status: 'open' | 'investigating' | 'resolved' | 'closed';
}

export const RELEASE_155_CONTROLS = ["severity_required", "owner_required", "response_target_required"] as const;

export function validateSupportCase(value: SupportCase): string[] {
  const errors: string[] = [];
  if (!value.caseId.trim()) errors.push("caseId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.responseDueAt.trim()) errors.push("responseDueAt_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  return [...new Set(errors)];
}
