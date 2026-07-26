export interface AiSafetyCase {
  caseId: string;
  tenantId: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  requestIds: string[];
  evidenceRefs: string[];
  owner: string;
  status: 'open' | 'contained' | 'resolved' | 'closed';
}

export const RELEASE_187_CONTROLS = ["severity_required", "evidence_preservation_required", "owner_required", "critical_escalation_required"] as const;

export function validateAiSafetyCase(value: AiSafetyCase): string[] {
  const errors: string[] = [];
  if (!value.caseId.trim()) errors.push("caseId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.category.trim()) errors.push("category_required");
  if (!value.requestIds.length) errors.push("requestIds_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.owner.trim()) errors.push("owner_required");
  return [...new Set(errors)];
}
