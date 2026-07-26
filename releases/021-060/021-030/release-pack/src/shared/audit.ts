import type { RequestContext } from "./types";

export interface AuditEvent {
  eventId: string;
  occurredAt: string;
  requestId: string;
  actorSubject: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  outcome: "allowed" | "denied" | "error";
  reason?: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export function auditFrom(
  ctx: RequestContext,
  input: Omit<AuditEvent, "occurredAt" | "requestId" | "actorSubject">
): AuditEvent {
  return {
    ...input,
    occurredAt: ctx.now,
    requestId: ctx.requestId,
    actorSubject: ctx.actor?.subject ?? "anonymous"
  };
}
