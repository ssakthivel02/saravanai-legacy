export interface AuditEngagement {
  engagementId: string;
  scope: string[];
  leadAuditor: string;
  procedureIds: string[];
  sampleRefs: string[];
  findingIds: string[];
  independenceConfirmed: true;
  status: 'planned' | 'fieldwork' | 'reporting' | 'closed';
}

export const RELEASE_283_CONTROLS = ["scope_required", "lead_auditor_required", "procedures_required", "independence_required"] as const;

export function validateAuditEngagement(value: AuditEngagement): string[] {
  const errors: string[] = [];
  if (!value.engagementId.trim()) errors.push("engagementId_required");
  if (!value.scope.length) errors.push("scope_required");
  if (!value.leadAuditor.trim()) errors.push("leadAuditor_required");
  if (!value.procedureIds.length) errors.push("procedureIds_required");
  if (!value.sampleRefs.length) errors.push("sampleRefs_required");
  if (!value.findingIds.length) errors.push("findingIds_required");
  if (value.independenceConfirmed !== true) errors.push("independenceConfirmed_must_remain_true");
  return [...new Set(errors)];
}
