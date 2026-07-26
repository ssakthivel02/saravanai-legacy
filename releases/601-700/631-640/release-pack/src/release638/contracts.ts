export interface PrivacyIncidentAndBreachAssessment {
  incidentId: string;
  tenantId: string;
  owner: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  signalRefs: string[];
  evidenceRefs: string[];
  containmentActions: string[];
  status: 'open' | 'contained' | 'recovering' | 'resolved' | 'closed';
}

export const RELEASE_638_CONTROLS = ["owner_accountability_required", "evidence_integrity_required", "severity_required", "containment_required", "evidence_preservation_required", "privacy_review_required", "incident_command_required"] as const;

export function validatePrivacyIncidentAndBreachAssessment(value: PrivacyIncidentAndBreachAssessment): string[] {
  const errors: string[] = [];
  if (!value.incidentId.trim()) errors.push("incidentId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.signalRefs.length) errors.push("signalRefs_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.containmentActions.length) errors.push("containmentActions_required");
  return [...new Set(errors)];
}
