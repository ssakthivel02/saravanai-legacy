export interface AuditMetadata {
  requestId: string;
  traceId: string;
  tenantId: string;
  actorSubject: string;
  action: string;
  outcome: "allowed" | "denied" | "failed";
  occurredAt: string;
  evidenceRefs: string[];
}
