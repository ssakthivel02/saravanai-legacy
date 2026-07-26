export interface PrivilegedSession {
  sessionId: string;
  tenantId: string;
  subject: string;
  privilege: string;
  approvalId: string;
  startsAt: string;
  expiresAt: string;
  recordingEvidenceRef: string;
}

export const RELEASE_206_CONTROLS = ["approval_required", "time_bound_required", "session_evidence_required", "separation_of_duties_required"] as const;

export function validatePrivilegedSession(value: PrivilegedSession): string[] {
  const errors: string[] = [];
  if (!value.sessionId.trim()) errors.push("sessionId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.subject.trim()) errors.push("subject_required");
  if (!value.privilege.trim()) errors.push("privilege_required");
  if (!value.approvalId.trim()) errors.push("approvalId_required");
  if (!value.startsAt.trim()) errors.push("startsAt_required");
  if (!value.expiresAt.trim()) errors.push("expiresAt_required");
  if (!value.recordingEvidenceRef.trim()) errors.push("recordingEvidenceRef_required");
  return [...new Set(errors)];
}
