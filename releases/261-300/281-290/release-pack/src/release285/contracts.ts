export interface PrivacyRequest {
  requestId: string;
  tenantId: string;
  subjectRef: string;
  requestType: 'access' | 'correction' | 'deletion' | 'portability' | 'objection';
  identityVerified: boolean;
  legalHoldRefs: string[];
  dueAt: string;
  status: 'received' | 'verified' | 'processing' | 'completed' | 'rejected';
}

export const RELEASE_285_CONTROLS = ["identity_verification_required", "legal_holds_respected", "due_date_required", "completion_evidence_required"] as const;

export function validatePrivacyRequest(value: PrivacyRequest): string[] {
  const errors: string[] = [];
  if (!value.requestId.trim()) errors.push("requestId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.subjectRef.trim()) errors.push("subjectRef_required");
  if (!value.legalHoldRefs.length) errors.push("legalHoldRefs_required");
  if (!value.dueAt.trim()) errors.push("dueAt_required");
  return [...new Set(errors)];
}
